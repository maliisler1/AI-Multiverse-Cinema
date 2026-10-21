/**
 * Kaggle paketi: bölümün kare ve hareket komutlarını (istenirse mevcut başlangıç karelerini de)
 * tek bir zip'te toplar. Bu zip Kaggle'a "dataset" olarak yüklenir:
 *   - kaggle/kare-uret.ipynb komutlardan karakter portresini ve 20 kareyi çizer,
 *   - kaggle/klip-uret.ipynb kareleri ücretsiz ekran kartında hareketli kliplere çevirir.
 *
 * Kullanım:
 *   npm run kaggle:paket                         (Neo-Genesis 1. bölüm, yalnızca komutlar)
 *   npm run kaggle:paket -- --kareler            (uretim/ içindeki mevcut kareleri de ekler)
 *   npm run kaggle:paket -- --dizi=neo-genesis-2099 --bolum=2
 *   npm run kaggle:paket -- --portre=uretim/karakter.png   (hazır karakter portresini de ekler)
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

// Kareler yalnızca istenirse eklenir; yoksa paket komutları taşır ve kareler Kaggle'da çizilir.
let copied = 0;
for (const c of args["kareler"] === "true" ? prod.clips : []) {
  const src = join(ROOT, paths.keyframe(c.key));
  if (!existsSync(src)) continue;
  copyFileSync(src, join(dir, "keyframes", `${c.key}.png`));
  copied++;
}
if (copied && copied < prod.clips.length)
  console.log(`⚠ ${prod.clips.length - copied} karesi eksik; eksikler Kaggle'da çizilebilir.`);

const files = ["plan.json", "keyframes"];
if (args["portre"]) {
  const portre = resolve(args["portre"]);
  if (!existsSync(portre)) fail(`Portre bulunamadı: ${portre}`);
  copyFileSync(portre, join(dir, "portre.png"));
  files.push("portre.png");
}

writeFileSync(
  join(dir, "plan.json"),
  JSON.stringify(
    {
      series: prod.seriesSlug,
      episode: prod.episode,
      style: prod.style,
      characterLook: prod.characterLook,
      clips: prod.clips.map((c) => ({
        key: c.key,
        duration: c.duration,
        face: c.face,
        // SDXL komutu 77 parçayla sınırlı: önce sahne, sonra kısa karakter tarifi; stil ayrı alanda
        // (style) ikinci metin kodlayıcıya gider. Yüzü referans portre taşır.
        keyframe: c.face
          ? `${c.keyframe}, ${prod.characterShort ?? prod.characterLook}`
          : c.keyframe,
        motion: c.motion,
      })),
    },
    null,
    2,
  ),
);

const zip = join(ROOT, "kaggle", `${name}.zip`);
rmSync(zip, { force: true });
// Windows 10+ ile gelen tar (bsdtar) -a ile zip yazar; diğer sistemlerde zip kullanılır.
if (process.platform === "win32")
  execFileSync("tar", ["-a", "-c", "-f", zip, ...files], {
    cwd: dir,
    stdio: "inherit",
  });
else execFileSync("zip", ["-q", "-r", zip, ...files], { cwd: dir, stdio: "inherit" });

console.log(`\n✔ Kaggle paketi hazır: ${zip}`);
console.log(`  ${copied ? `${copied} kare + ` : ""}plan.json (${prod.clips.length} sahne)`);
console.log(`  Kaggle'da: Datasets → New Dataset → bu zip'i yükleyin.`);
