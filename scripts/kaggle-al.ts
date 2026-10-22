/**
 * Kaggle'dan indirilen klip ya da kare zip'ini bölüm klasörüne yerleştirir.
 * Sonra 'npm run birlestir' klipleri (olmayan sahnelerde hareketli kareyi) kullanarak bölümü birleştirir.
 *
 * Kullanım:
 *   npm run kaggle:al                                (İndirilenler klasöründeki en yeni klipler-*.zip)
 *   npm run kaggle:al -- --kareler                   (en yeni kareler-*.zip; eski kareler yedeklenir)
 *   npm run kaggle:al -- --zip="C:\\yol\\klipler-neo-genesis-2099-e1.zip"
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync, statSync } from "node:fs";
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

const frames = args["kareler"] === "true" || /(^|[\\/])kareler-[^\\/]*$/.test(args["zip"] ?? "");

function newestDownload(): string | null {
  const dir = join(homedir(), "Downloads");
  if (!existsSync(dir)) return null;
  const prefix = `${frames ? "kareler" : "klipler"}-${prod!.seriesSlug}-e${prod!.episode}`;
  const zips = readdirSync(dir)
    .filter((f) => f.startsWith(prefix) && f.endsWith(".zip"))
    .map((f) => join(dir, f))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  return zips[0] ?? null;
}

const zip = args["zip"] ? resolve(args["zip"]) : newestDownload();
if (!zip || !existsSync(zip))
  fail("Klip zip'i bulunamadı. Kaggle'dan indirdiğiniz dosyanın yolunu --zip=... ile verin.");

// Windows'ta Git Bash'in GNU tar'ı "C:\\..." yollarını açamaz; Windows'un kendi tar'ı (bsdtar) zip açar.
const WIN_TAR = join(process.env["SystemRoot"] ?? "C:\\Windows", "System32", "tar.exe");

function unzip(file: string, dest: string) {
  if (process.platform === "win32")
    execFileSync(WIN_TAR, ["-x", "-f", file, "-C", dest], { stdio: "inherit" });
  else execFileSync("unzip", ["-o", "-q", file, "-d", dest], { stdio: "inherit" });
}

const paths = storagePaths(prod);
const base = join(ROOT, paths.base);

if (frames) {
  // Kare zip'i: keyframes/, plan.json ve portre.png içerir. Eski kareler silinmez, yedeklenir.
  const keyDir = join(base, "keyframes");
  // Önce geçici klasöre aç; açılamazsa mevcut kareler yerinde kalır.
  const tmp = join(base, `.kareler-${Date.now()}`);
  mkdirSync(tmp, { recursive: true });
  unzip(zip, tmp);
  if (!existsSync(join(tmp, "keyframes"))) fail("Zip'te keyframes/ klasörü yok.");
  if (existsSync(keyDir)) {
    const backup = join(base, `keyframes-eski-${Date.now()}`);
    renameSync(keyDir, backup);
    console.log(`  Eski kareler yedeklendi: ${backup}`);
  }
  renameSync(join(tmp, "keyframes"), keyDir);
  rmSync(tmp, { recursive: true, force: true });
  const have = prod.clips.filter((c) => existsSync(join(ROOT, paths.keyframe(c.key)))).length;
  console.log(`\n✔ ${have}/${prod.clips.length} kare yerleştirildi: ${keyDir}`);
  console.log(
    `  Hareketli kare sürümü için 'npm run birlestir', gerçek video için klip-uret not defteri.`,
  );
} else {
  const clipsDir = join(base, "clips");
  mkdirSync(clipsDir, { recursive: true });
  unzip(zip, clipsDir);
  const have = prod.clips.filter((c) => existsSync(join(clipsDir, `${c.key}.mp4`))).length;
  console.log(`\n✔ ${have}/${prod.clips.length} klip yerleştirildi: ${clipsDir}`);
  const rest = prod.clips.length - have;
  if (rest) console.log(`  Klibi olmayan ${rest} sahne hareketli kare olarak kalacak.`);
  console.log(`  Şimdi 'npm run birlestir' ile bölümü birleştirin.`);
}
