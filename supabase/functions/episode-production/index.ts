/**
 * episode-production — bir bölümü Runway ile adım adım üretir.
 *
 * Adımlar: keyframes (başlangıç kareleri, yüz referansıyla) → clips (video) → voices (8 dil).
 * Her adım kredi onayı ister: istemci `expectedCredits` göndermeli ve sunucunun
 * hesapladığı tutarla aynı olmalı. Onaysız hiçbir Runway isteği yapılmaz.
 *
 * Eylemler (POST JSON, yalnızca yönetici):
 *   overview  { seriesSlug, episode }
 *   start     { seriesSlug, episode, step, expectedCredits, voices?, ttsModel?, langs? }
 *   poll      { seriesSlug, episode }
 *   retry     { seriesSlug, episode, kind, itemKey }
 *   cancel    { seriesSlug, episode }
 *
 * Gizli anahtar: RUNWAY_API_KEY (Supabase Edge Function secrets).
 */
import { createClient } from "npm:@supabase/supabase-js@2.117.3";
import { Ctx, HttpError, cors, findProduction, json, requireAdmin } from "./production.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: cors });
  try {
    const runwayKey = Deno.env.get("RUNWAY_API_KEY");
    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    await requireAdmin(db, req);

    const body = await req.json();
    const prod = findProduction(body.seriesSlug, body.episode);
    const ctx = new Ctx(db, prod, runwayKey ?? null);

    switch (body.action) {
      case "overview":
        return json(await ctx.overview());
      case "start":
        return json(await ctx.start(body));
      case "poll":
        return json(await ctx.poll());
      case "retry":
        return json(await ctx.retry(body.kind, body.itemKey));
      case "cancel":
        return json(await ctx.cancel());
      default:
        throw new HttpError(400, `Bilinmeyen eylem: ${body.action}`);
    }
  } catch (err) {
    if (err instanceof HttpError) return json({ error: err.message, ...err.extra }, err.status);
    return json({ error: err instanceof Error ? err.message : "Sunucu hatası" }, 500);
  }
});

