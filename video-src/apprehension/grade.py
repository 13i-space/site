import numpy as np
from PIL import Image, ImageFilter
def load(k): return np.asarray(Image.open(f'src/{k}.png').convert('RGB')).astype(np.float32)/255
def night(a, horizon):
    h,w,_=a.shape
    lum=a@np.array([.299,.587,.114])
    g=Image.fromarray((lum*255).astype(np.uint8))
    m1=np.asarray(g.filter(ImageFilter.GaussianBlur(3))).astype(np.float32)/255
    m2=np.asarray(Image.fromarray(((lum**2)*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))).astype(np.float32)/255
    std=np.sqrt(np.clip(m2-m1**2,0,1))
    smooth=np.clip(1-std*9,0,1)                       # 1 = smooth (sky), 0 = detail (lights)
    yy=np.linspace(0,1,h)[:,None]
    above=np.clip((horizon-yy)/0.08+0.5,0,1)            # soft fade at horizon
    warm=np.clip((a[...,0]-a[...,2])*3,0,1)
    sky=smooth*np.maximum(above, warm*above*0+0)*1.0
    sky=np.clip(sky*1.2,0,1)
    # night sky colour: navy-black gradient, slight amber glow near horizon
    top=np.array([.015,.02,.045]); hz=np.array([.10,.07,.07])
    t=np.clip(yy/max(horizon,1e-3),0,1)[...,None]
    nightsky=top*(1-t**2)+hz*(t**2)
    out=a*(1-sky[...,None])+nightsky*sky[...,None]
    # warm glow residue below horizon toned down
    return out
def grade(a, exposure=0.85, blue_desat=0.55):
    # slate the blues, keep ambers; gentle S-curve; overall darker
    lum=(a@np.array([.299,.587,.114]))[...,None]
    blue=np.clip((a[...,2]-a[...,0])*2.5,0,1)[...,None]
    a=a*(1-blue*blue_desat)+lum*blue*blue_desat*np.array([.85,.92,1.05])
    a=a*exposure
    a=np.clip(a,0,1); a=a*a*(3-2*a)*0.35+a*0.65   # mild contrast
    # cool shadows, warm highlights
    l=(a@np.array([.299,.587,.114]))[...,None]
    a=a+(1-l)*np.array([-.004,0,.012])*l*4
    return np.clip(a,0,1)
def save(a,k,scale=None):
    im=Image.fromarray((np.clip(a,0,1)*255).astype(np.uint8))
    im.save(f'assets/{k}.png')
plan={'B_skyline':.45,'A_office':.42,'B_atwork':.40,'B_window':.42,'A_back':.62,'C_office':.42,'B_server':None,'C_portrait':None,'C_profile':None,'C_eyes':None,'O_crop':.0,'B_empty':.30}
o=Image.open('src/office.jpg').convert('RGB').crop((0,440,1090,896)); o.save('src/O_crop.png')
for k,hz in plan.items():
    a=load(k)
    if hz: a=night(a,hz)
    a=grade(a, exposure=0.8 if k!='C_eyes' else 0.9)
    save(a,k)
