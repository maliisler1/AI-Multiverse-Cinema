import { afterEach, describe, expect, it, vi } from "vitest";
import { detectDeviceLang, LANGS, LANG_NAMES, translate } from "@/lib/i18n";

const setLangs = (langs: string[]) =>
  vi.spyOn(window.navigator, "languages", "get").mockReturnValue(langs);

describe("cihaz diline göre dil seçimi", () => {
  afterEach(() => vi.restoreAllMocks());

  it.each([
    [["it-IT"], "it"],
    [["zh-Hans-CN"], "zh"],
    [["ja-JP"], "ja"],
    [["ru-RU"], "ru"],
    [["ko-KR"], "ko"],
    [["nl-NL", "de-DE"], "de"],
    [["nl-NL"], "en"],
  ])("%j → %s", (langs, want) => {
    setLangs(langs);
    expect(detectDeviceLang()).toBe(want);
  });

  it("her dilin adı ve dil önerisi metni var", () => {
    for (const l of LANGS) {
      expect(LANG_NAMES[l]).toBeTruthy();
      expect(translate(l, "suggest_title")).not.toBe("suggest_title");
    }
  });
});
