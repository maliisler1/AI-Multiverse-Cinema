import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const m=vi.hoisted(()=>({
  navigate:vi.fn(), signed:vi.fn(),
  episodes:[{id:"e1",series_id:"s",n:1,status:"ready",video_url:"1.mp4",titles:[],tracks:[]}],
  n:1,
}));
vi.mock("@tanstack/react-router",()=>({
  createFileRoute:()=>()=>({useLoaderData:()=>({id:"s",slug:"story",n:m.n})}),
  Link:({children}:any)=><a>{children}</a>, notFound:()=>new Error(),useNavigate:()=>m.navigate,
}));
vi.mock("@tanstack/react-query",()=>({useSuspenseQuery:()=>({data:m.episodes})}));
vi.mock("@/components/AppShell",()=>({AppShell:({children}:any)=><div>{children}</div>}));
vi.mock("@/lib/store",()=>({useAppState:()=>({state:{unlocked:[],resume:{},audioLang:"tr",subLang:"off"},user:null,update:vi.fn()})}));
vi.mock("@/lib/i18n",()=>({useT:()=>({lang:"tr",t:(k:string)=>k}),LANG_NAMES:{tr:"Türkçe"}}));
vi.mock("@/lib/catalog",()=>({episodeListQuery:()=>({}),seriesListQuery:{},signedUrl:m.signed,trackStatus:()=>"none",episodeTitle:()=>"Pilot"}));
vi.mock("@/lib/ads",()=>({ads:{atSeriesEnd:vi.fn()}}));
import { Player } from "@/routes/izle.$slug.$n";
afterEach(cleanup);
beforeEach(()=>{
  m.n=1;m.navigate.mockClear();m.signed.mockReset();m.signed.mockResolvedValue("https://example.test/video.mp4");
  m.episodes=[{id:"e1",series_id:"s",n:1,status:"ready",video_url:"1.mp4",titles:[],tracks:[]}];
});
describe("M-01 real player feedback",()=>{
  it("renders actual media controls when video signing succeeds",async()=>{
    const {container}=render(<Player/>);
    await waitFor(()=>expect(container.querySelector("video")).toHaveAttribute("src","https://example.test/video.mp4"));
    expect(container.querySelector("video")).toHaveAttribute("controls");
  });
  it("shows an error and permits retry instead of spinning forever",async()=>{
    m.signed.mockResolvedValueOnce(null);
    const {container}=render(<Player/>);
    expect(await screen.findByRole("alert")).toHaveTextContent("Video yüklenemedi");
    fireEvent.click(screen.getByRole("button",{name:"Yeniden dene"}));
    await waitFor(()=>expect(container.querySelector("video")).not.toBeNull());
  });
  it("cannot play a locked episode through a direct route",()=>{
    m.n=10;m.episodes[0]!.n=10;
    const {container}=render(<Player/>);
    expect(screen.getByText("locked_ep")).toBeVisible();
    expect(container.querySelector("video")).toBeNull();
    expect(m.signed).not.toHaveBeenCalled();
  });
  it("makes autoplay a working preference rather than a read-only checkbox",()=>{
    render(<Player/>);
    const box=screen.getByRole("checkbox");
    fireEvent.click(box);
    expect(box).not.toBeChecked();
    expect(localStorage.getItem("amc-autoplay")).toBe("false");
    localStorage.removeItem("amc-autoplay");
  });
});
