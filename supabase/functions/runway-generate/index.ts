import { createClient } from "npm:@supabase/supabase-js@2.117.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RUNWAY_API_BASE = "https://api.dev.runwayml.com/v1";
const RUNWAY_VERSION = "2024-11-06";

type RunwayTaskResponse = {
  id: string;
  status: "PENDING" | "THROTTLING" | "RUNNING" | "SUCCEEDED" | "FAILED" | "CANCELED";
  output?: string[];
  failureCode?: string;
  failure?: string;
  createdAt?: string;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const runwayKey = Deno.env.get("RUNWAY_API_KEY");

    if (!runwayKey) {
      return new Response(
        JSON.stringify({ error: "Runway API key not configured. Add RUNWAY_API_KEY as an edge function secret." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json();
    const action = body.action as string;

    if (action === "generate") {
      const { episodeId, promptText, promptImage, model, duration, ratio } = body;

      if (!episodeId || !promptText) {
        return new Response(
          JSON.stringify({ error: "Missing required fields: episodeId, promptText" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const genModel = model || "gen4.5";
      const genDuration = duration || 5;
      const genRatio = ratio || "1280:720";

      const payload: Record<string, unknown> = {
        model: genModel,
        promptText,
        ratio: genRatio,
        duration: genDuration,
      };

      if (promptImage) {
        payload.promptImage = promptImage;
      }

      const resp = await fetch(`${RUNWAY_API_BASE}/image_to_video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${runwayKey}`,
          "X-Runway-Version": RUNWAY_VERSION,
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        return new Response(
          JSON.stringify({ error: `Runway API error: ${resp.status}`, details: errText }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const task: RunwayTaskResponse = await resp.json();

      await supabase.from("video_generations").insert({
        episode_id: episodeId,
        user_id: user.id,
        runway_task_id: task.id,
        status: "PENDING",
        model: genModel,
        prompt_text: promptText,
        prompt_image: promptImage || null,
        duration_sec: genDuration,
      });

      return new Response(
        JSON.stringify({ taskId: task.id, status: task.status }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (action === "status") {
      const { taskId } = body;

      if (!taskId) {
        return new Response(
          JSON.stringify({ error: "Missing required field: taskId" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const resp = await fetch(`${RUNWAY_API_BASE}/tasks/${taskId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${runwayKey}`,
          "X-Runway-Version": RUNWAY_VERSION,
        },
      });

      if (!resp.ok) {
        const errText = await resp.text();
        return new Response(
          JSON.stringify({ error: `Runway API error: ${resp.status}`, details: errText }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const task: RunwayTaskResponse = await resp.json();

      const { data: genRow } = await supabase
        .from("video_generations")
        .select("id, episode_id, duration_sec")
        .eq("runway_task_id", taskId)
        .maybeSingle();

      if (genRow) {
        const updateData: Record<string, unknown> = { status: task.status };

        if (task.status === "SUCCEEDED" && task.output && task.output.length > 0) {
          updateData.output_url = task.output[0];
          updateData.completed_at = new Date().toISOString();

          const videoResp = await fetch(task.output[0]);
          if (videoResp.ok) {
            const videoBlob = await videoResp.blob();
            const { data: epRow } = await supabase
              .from("episodes")
              .select("series_id, n")
              .eq("id", genRow.episode_id)
              .maybeSingle();

            if (epRow) {
              const { data: seriesRow } = await supabase
                .from("series")
                .select("slug")
                .eq("id", epRow.series_id)
                .maybeSingle();

              if (seriesRow) {
                const storagePath = `${seriesRow.slug}/e${epRow.n}.mp4`;
                const { error: uploadError } = await supabase.storage
                  .from("videos")
                  .upload(storagePath, videoBlob, { upsert: true, contentType: "video/mp4" });

                if (!uploadError) {
                  await supabase
                    .from("episodes")
                    .update({ video_url: storagePath, status: "ready", duration_sec: genRow.duration_sec })
                    .eq("id", genRow.episode_id);
                  updateData.saved_to_storage = true;
                }
              }
            }
          }
        }

        if (task.status === "FAILED" || task.status === "CANCELED") {
          updateData.failure_reason = task.failure || task.failureCode || "Unknown failure";
        }

        await supabase.from("video_generations").update(updateData).eq("id", genRow.id);
      }

      return new Response(
        JSON.stringify({
          taskId: task.id,
          status: task.status,
          output: task.output,
          failure: task.failure,
          failureCode: task.failureCode,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ error: `Unknown action: ${action}` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
