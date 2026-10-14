import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks=vi.hoisted(()=>({clear:vi.fn().mockResolvedValue(undefined),lang:"tr"}));
vi.mock("@/lib/store",()=>({useAppState:()=>({clearLocal:mocks.clear,user:null})}));
vi.mock("@/lib/i18n",()=>({useT:()=>({lang:mocks.lang})}));
vi.mock("@/components/AdPrivacyOptions",()=>({AdPrivacyOptions:()=>null}));
import { LocalPrivacy } from "@/components/LocalPrivacy";
afterEach(cleanup);
beforeEach(()=>{mocks.lang="tr";mocks.clear.mockClear();});
describe("M-03 deletion confirmation",()=>{
  it("cancels without deleting and uses Turkish action labels",async()=>{
    render(<LocalPrivacy/>);
    fireEvent.click(screen.getByRole("button",{name:"Yerel verileri sil"}));
    expect(screen.getByRole("alertdialog")).toHaveTextContent("Sunucudaki hesabınız ve verileriniz silinmez");
    expect(screen.getByRole("button",{name:"Verileri sil"})).toBeVisible();
    fireEvent.click(screen.getByRole("button",{name:"İptal"}));
    expect(mocks.clear).not.toHaveBeenCalled();
  });
  it("deletes only after explicit confirmation",async()=>{
    render(<LocalPrivacy/>);
    fireEvent.click(screen.getByRole("button",{name:"Yerel verileri sil"}));
    fireEvent.click(screen.getByRole("button",{name:"Verileri sil"}));
    await waitFor(()=>expect(mocks.clear).toHaveBeenCalledTimes(1));
  });
  it("uses the selected German language for the destructive actions",()=>{
    mocks.lang="de";
    render(<LocalPrivacy/>);
    fireEvent.click(screen.getByRole("button",{name:"Lokale Daten löschen"}));
    expect(screen.getByRole("button",{name:"Abbrechen"})).toBeVisible();
    expect(screen.getByRole("button",{name:"Daten löschen"})).toBeVisible();
  });
});
