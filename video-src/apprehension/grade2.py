import numpy as np
from PIL import Image, ImageFilter
import grade as G
def skymask(a,horizon):
    h,w,_=a.shape
    lum=a@np.array([.299,.587,.114])
    L=Image.fromarray((lum*255).astype(np.uint8))
    lb=np.asarray(L.filter(ImageFilter.GaussianBlur(1))).astype(np.float32)/255
    loc=np.asarray(L.filter(ImageFilter.GaussianBlur(4))).astype(np.float32)/255
    spot=np.clip((lb-loc)*6,0,1)                 # small bright lights (windows) -> keep
    mx=a.max(-1); mn=a.min(-1); sat=(mx-mn)/(mx+1e-4)
    skyish=np.clip((lum-0.10)/0.10,0,1)*np.clip(sat*2.5,0,1)*(1-spot)
    yy=np.linspace(0,1,h)[:,None]
    above=np.clip((horizon-yy)/0.06+0.5,0,1)
    m=skyish*above
    mi=Image.fromarray((m*255).astype(np.uint8)).filter(ImageFilter.MedianFilter(7)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.5))
    return np.asarray(mi).astype(np.float32)/255
def night(a,horizon):
    h,w,_=a.shape
    m=skymask(a,horizon)[...,None]
    yy=np.linspace(0,1,h)[:,None,None]; t=np.clip(yy/horizon,0,1)
    navy=np.array([.012,.017,.04])*(1-t**2)+np.array([.07,.05,.05])*t**2
    lum=(a@np.array([.299,.587,.114]))[...,None]
    sky=navy+lum*0.06*np.array([.6,.7,1.0])
    out=a*(1-m)+sky*m
    # tame remaining orange glow above horizon everywhere (halo)
    warm=np.clip((a[...,0]-a[...,2])*2,0,1)[...,None]
    ab=np.clip((horizon-yy)/0.06+0.5,0,1)
    k=warm*ab*(1-m)*0.55
    out=out*(1-k)+(lum*np.array([.55,.5,.55]))*k
    return out
plan={'B_skyline':.47,'A_office':.42,'B_atwork':.40,'B_window':.46,'A_back':.62,'B_empty':.32}
for k,hz in plan.items():
    a=G.load(k); a=night(a,hz); a=G.grade(a,exposure=0.8); G.save(a,k)
