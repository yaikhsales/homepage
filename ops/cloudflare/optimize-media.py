import subprocess, concurrent.futures
from pathlib import Path
root=Path(".open-next/assets")
files=[p for p in root.rglob("*") if p.is_file() and p.stat().st_size>25*1024*1024]
def optimize(p):
    duration=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",str(p)]))
    rate=max(100,int(22*1024*1024*8/duration/1000)-80)
    target=p.with_name(p.stem+".cf.mp4")
    subprocess.run(["ffmpeg","-v","error","-y","-i",str(p),"-vf",r"scale=trunc(min(960\,iw)/2)*2:-2","-c:v","libx264","-preset","veryfast","-b:v",f"{rate}k","-maxrate",f"{rate}k","-bufsize",f"{rate*2}k","-c:a","aac","-b:a","64k","-movflags","+faststart",str(target)],check=True)
    if target.stat().st_size>25*1024*1024: raise RuntimeError(f"Still oversized: {p}")
    target.replace(p)
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    list(pool.map(optimize,files))
