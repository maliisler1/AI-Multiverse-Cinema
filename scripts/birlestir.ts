/**
 * Bölümü bilgisayarda, uretim/ klasöründeki kare, klip ve seslerden birleştirir.
 * Klibi olan sahnede klibi, olmayanda hareketli kareyi kullanır. Çıktı: uretim/izle/
 *
 * Kullanım:
 *   npm run birlestir
 *   npm run birlestir -- --dizi=neo-genesis-2099 --bolum=2
 */
import { resolve } from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? "true"];
  }),
) as Record<string, string>;

process.env["LOCAL_DIR"] = resolve(process.env["URETIM_DIR"] ?? "uretim");
process.argv = [
  process.argv[0]!,
  "assemble-episode.ts",
  args["dizi"] ?? "neo-genesis-2099",
  args["bolum"] ?? "1",
];
await import("./assemble-episode.ts");
