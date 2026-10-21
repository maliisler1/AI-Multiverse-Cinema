/**
 * Kaggle paketi: bölümün başlangıç karelerini ve hareket komutlarını tek bir zip'te toplar.
 * Bu zip Kaggle'a "dataset" olarak yüklenir; kaggle/klip-uret.ipynb kareleri oradan okuyup
 * ücretsiz ekran kartında hareketli kliplere çevirir.
 *
 * Kullanım:
 *   npm run kaggle:paket                         (Neo-Genesis 1. bölüm)
 *   npm run kaggle:paket -- --dizi=neo-genesis-2099 --bolum=2
 *
 * Çıktı: uretim/kaggle/<dizi>-e<bölüm>.zip
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync, copyFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { PRODUCTIONS } from "../supabase/functions/_shared/productions/index.ts";
import { storagePaths } from "../supabase/functions/_shared/productions/types.ts";

const ROOT = resolve(process.env["URETIM_DIR"] ?? "uretim");

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? "true"];
  }),
) as Record<string, string>;

function fail(msg: string): never {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

const prod = PRODUCTIONS.find(
  (p) =>
    p.seriesSlug === (args["dizi"] ?? "neo-genesis-2099") &&
    p.episode === Number(args["bolum"] ?? 1),
);
if (!prod) fail("Bu dizi/bölüm için üretim planı yok.");
const paths = storagePaths(prod);

const name = `${prod.seriesSlug}-e${prod.episode}`;
const dir = join(ROOT, "kaggle", name);
rmSync(dir, { recursive: true, force: true });
mkdirSync(join(dir, "keyframes"), { recursive: true });

const missing: string[] = [];
for (const c of prod.clips) {
  const src = join(ROOT, paths.keyframe(c.key));
  if (!existsSync(src)) {
    missing.push(c.key);
    continue;
  }
  copyFileSync(src, join(dir, "keyframes", `${c.key}.png`));
}
if (missing.length)
  fail(`Eksik kareler: ${missing.join(", ")}. Önce 'npm run bolum' ile kareleri üretin.`);

writeFileSync(
  join(dir, "plan.json"),
  JSON.stringify(
    {
      series: prod.seriesSlug,
      episode: prod.episode,
      style: prod.style,
      clips: prod.clips.map((c) => ({ key: c.key, duration: c.duration, motion: c.motion })),
    },
    null,
    2,
  ),
);

const zip = join(ROOT, "kaggle", `${name}.zip`);
rmSync(zip, { force: true });
// Windows 10+ ile gelen tar (bsdtar) -a ile zip yazar; diğer sistemlerde zip kullanılır.
if (process.platform === "win32")
  execFileSync("tar", ["-a", "-c", "-f", zip, "plan.json", "keyframes"], {
    cwd: dir,
    stdio: "inherit",
  });
else
  execFileSync("zip", ["-q", "-r", zip, "plan.json", "keyframes"], { cwd: dir, stdio: "inherit" });

console.log(`\n✔ Kaggle paketi hazır: ${zip}`);
console.log(`  ${prod.clips.length} kare + plan.json`);
console.log(`  Kaggle'da: Datasets → New Dataset → bu zip'i yükleyin.`);
