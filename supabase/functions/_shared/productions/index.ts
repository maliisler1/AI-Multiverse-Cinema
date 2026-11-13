import { neoGenesisE1 } from "./neo-genesis-2099-e1.ts";
import { neoGenesisE2 } from "./neo-genesis-e02.ts";
import { neoGenesisE3 } from "./neo-genesis-e03.ts";
import { neoGenesisE4 } from "./neo-genesis-e04.ts";
import { neoGenesisE5 } from "./neo-genesis-e05.ts";
import type { Production } from "./types.ts";

/** Üretim planı hazır olan bölümler. Yeni bölüm eklemek için buraya ekleyin. */
export const PRODUCTIONS: Production[] = [neoGenesisE1, neoGenesisE2, neoGenesisE3, neoGenesisE4, neoGenesisE5];
