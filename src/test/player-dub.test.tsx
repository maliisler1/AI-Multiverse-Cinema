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
vi.mock("@/lib/store",()=>({useAppState:()=>({state:{unlocked:[],resume:{},audioLang:"de",subLang:"off"},user:null,update:vi.fn()})}));
vi.mock("@/lib/i18n",()=>({useT:()=>({lang:"tr",t:(k:string)=>k}),LANG_NAMES:{tr:"Türkçe"}}));
vi.mock("@/lib/catalog",()=>({episodeListQuery:()=>({}),seriesListQuery:{},signedUrl:m.signed,trackStatus:()=>"none",episodeTitle:()=>"Pilot"}));
vi.mock("@/lib/ads",()=>({ads:{atSeriesEnd:vi.fn()}}));
import { Player } from "@/routes/izle.$slug.$n";
afterEach(cleanup);
beforeEach(()=>{
  m.n=1;m.signed.mockReset();m.signed.mockImplementation(async (_b:string,p:string)=>`https://example.test/${p}`);
});
describe("dublaj yedeği",()=>{
  it("seçilen dilde (de) ses yoksa Türkçe sesi çalar",async()=>{
    m.episodes=[{id:"e1",series_id:"s",n:1,status:"ready",video_url:"1.mp4",titles:[],
      tracks:[{kind:"audio",lang:"tr",status:"ready",url:"e1.tr.m4a"},{kind:"audio",lang:"de",status:"planned",url:null}]} as any];
    const {container}=render(<Player/>);
    await waitFor(()=>expect(container.querySelector("audio")).toHaveAttribute("src","https://example.test/e1.tr.m4a"));
  });
  it("seçilen dilde ses varsa onu çalar",async()=>{
    m.episodes=[{id:"e1",series_id:"s",n:1,status:"ready",video_url:"1.mp4",titles:[],
      tracks:[{kind:"audio",lang:"tr",status:"ready",url:"e1.tr.m4a"},{kind:"audio",lang:"de",status:"ready",url:"e1.de.m4a"}]} as any];
    const {container}=render(<Player/>);
    await waitFor(()=>expect(container.querySelector("audio")).toHaveAttribute("src","https://example.test/e1.de.m4a"));
  });
});
