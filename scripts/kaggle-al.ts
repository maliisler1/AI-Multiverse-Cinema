/**
 * Kaggle'dan indirilen klip zip'ini bölüm klasörüne yerleştirir.
 * Sonra 'npm run birlestir' klipleri (olmayan sahnelerde hareketli kareyi) kullanarak bölümü birleştirir.
 *
 * Kullanım:
 *   npm run kaggle:al                                (İndirilenler klasöründeki en yeni klipler-*.zip)
 *   npm run kaggle:al -- --zip="C:\\yol\\klipler-neo-genesis-2099-e1.zip"
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { PRODUCTIONS } from "../supabase/functions/_shared/productions/index.ts";
import { storagePaths } from "../supabase/functions/_shared/productions/types.ts";

const ROOT = resolve(process.env["URETIM_DIR"] ?? "uretim");

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...v] = a.replace(/^--/, "").split("=");
    return [k, v.length ? v.join("=") : "true"];
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

function newestDownload(): string | null {
  const dir = join(homedir(), "Downloads");
  if (!existsSync(dir)) return null;
  const prefix = `klipler-${prod!.seriesSlug}-e${prod!.episode}`;
  const zips = readdirSync(dir)
    .filter((f) => f.startsWith(prefix) && f.endsWith(".zip"))
    .map((f) => join(dir, f))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  return zips[0] ?? null;
}

const zip = args["zip"] ? resolve(args["zip"]) : newestDownload();
if (!zip || !existsSync(zip))
  fail("Klip zip'i bulunamadı. Kaggle'dan indirdiğiniz dosyanın yolunu --zip=... ile verin.");

const clipsDir = join(
  ROOT,
  storagePaths(prod)
    .clip("x")
    .replace(/\/x\.mp4$/, ""),
);
mkdirSync(clipsDir, { recursive: true });
// Windows 10+ ile gelen tar (bsdtar) zip açabilir; diğer sistemlerde unzip kullanılır.
if (process.platform === "win32")
  execFileSync("tar", ["-x", "-f", zip, "-C", clipsDir], { stdio: "inherit" });
else execFileSync("unzip", ["-o", "-q", zip, "-d", clipsDir], { stdio: "inherit" });

const have = prod.clips.filter((c) => existsSync(join(clipsDir, `${c.key}.mp4`))).map((c) => c.key);
console.log(`\n✔ ${have.length}/${prod.clips.length} klip yerleştirildi: ${clipsDir}`);
const rest = prod.clips.length - have.length;
if (rest) console.log(`  Klibi olmayan ${rest} sahne hareketli kare olarak kalacak.`);
console.log(`  Şimdi 'npm run birlestir' ile bölümü birleştirin.`);
