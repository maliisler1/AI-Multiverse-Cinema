import subprocess
clips=[f"{i:02d}.mp4" for i in range(1,19)]
D=10.125; T=0.6; END=6.0; ET=1.0
n=len(clips)
vlen=n*D-(n-1)*T
total=vlen-ET+END
args=["ffmpeg","-y","-v","error"]
for c in clips: args+=["-i",c]
args+=["-f","lavfi","-t",str(END),"-i","color=c=black:s=1920x1080:r=24"]
args+=["-i","music.mp3"]
f=[]
for i in range(n):
    f.append(f"[{i}:v]scale=1920:1080:flags=lanczos:force_original_aspect_ratio=increase,crop=1920:1080,unsharp=5:5:0.5,setsar=1,fps=24,format=yuv420p,trim=duration={D},setpts=PTS-STARTPTS[v{i}]")
    f.append(f"[{i}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=duration={D},asetpts=PTS-STARTPTS[a{i}]")
font="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
f.append(f"[{n}:v]format=yuv420p,drawtext=fontfile={font}:text='The Human Code\\: 2300':fontsize=78:fontcolor=white:x=(w-tw)/2:y=h/2-110,drawtext=fontfile={font}:text='Bölüm 2 — Kayıp Sinyal':fontsize=46:fontcolor=0x5fe3d6:x=(w-tw)/2:y=h/2+10,drawtext=fontfile={font}:text='Yakında':fontsize=34:fontcolor=white@0.8:x=(w-tw)/2:y=h/2+80,fade=t=in:st=0:d=1[vend]")
prev="v0"
for i in range(1,n):
    off=round(i*(D-T),3)
    f.append(f"[{prev}][v{i}]xfade=transition=fade:duration={T}:offset={off}[x{i}]"); prev=f"x{i}"
f.append(f"[{prev}][vend]xfade=transition=fade:duration={ET}:offset={round(vlen-ET,3)},fade=t=in:st=0:d=1.2[vout]")
prev="a0"
for i in range(1,n):
    f.append(f"[{prev}][a{i}]acrossfade=d={T}[y{i}]"); prev=f"y{i}"
f.append(f"[{prev}]apad=whole_dur={total},highpass=f=70,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,volume=1.6,asplit=2[dlg][sc]")
f.append(f"[{n+1}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=duration={total},asetpts=PTS-STARTPTS,volume='if(gt(t,{vlen-ET:.2f}),0.75,0.20)':eval=frame,afade=t=in:st=0:d=3,afade=t=out:st={total-2.5:.2f}:d=2.5[mus]")
f.append("[mus][sc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=600:makeup=1[duck]")
f.append("[dlg][duck]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-16:TP=-1.5:LRA=11[aout]")
args+=["-filter_complex",";".join(f),"-map","[vout]","-map","[aout]","-c:v","libx264","-preset","veryfast","-crf","20","-maxrate","6M","-bufsize","12M","-pix_fmt","yuv420p","-c:a","aac","-b:a","160k","-movflags","+faststart","-t",f"{total:.2f}","bolum01.mp4"]
print(round(vlen,2),round(total,2))
subprocess.run(args,check=True)
