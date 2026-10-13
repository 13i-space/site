from PIL import Image, ImageDraw
C={ # name: (file, box)
 'C_portrait':('boardC.png',(95,0,462,485)),
 'C_profile':('boardC.png',(780,0,1222,285)),
 'C_eyes':('boardC.png',(780,288,1222,412)),
 'C_full':('boardC.png',(1226,0,1536,485)),
 'C_office':('boardC.png',(0,575,972,950)),
 'C_skyline':('boardC.png',(976,728,1268,935)),
 'C_server':('boardC.png',(1271,728,1536,935)),
 'B_atwork':('boardB.png',(0,390,1536,690)),
 'B_window':('boardB.png',(1302,97,1536,388)),
 'B_server':('boardB.png',(666,719,1052,985)),
 'B_skyline':('boardB.png',(1056,719,1536,985)),
 'B_empty':('boardB.png',(0,719,663,985)),
 'A_office':('boardA.png',(0,560,990,1024)),
 'A_back':('boardA.png',(663,323,1005,488)),
 'A_corridor':('boardA.png',(994,768,1536,1024)),
 'A_empty':('boardA.png',(994,490,1536,765)),
 'O_office':('office.jpg',(0,0,1600,896)),
}
imgs={}
for k,(f,b) in C.items():
  im=Image.open('src/'+f).convert('RGB').crop(b); im.save(f'src/{k}.png'); imgs[k]=im
W=1800; sheet=Image.new('RGB',(W,2400),(30,30,30)); x=y=0; rowh=0; d=ImageDraw.Draw(sheet)
for k,im in imgs.items():
  t=im.copy(); t.thumbnail((440,300))
  if x+t.width>W: x=0; y+=rowh+30; rowh=0
  sheet.paste(t,(x,y+20)); d.text((x+4,y+4),f'{k} {im.size}',fill=(255,255,0)); x+=t.width+10; rowh=max(rowh,t.height)
sheet.crop((0,0,W,y+rowh+30)).save('sheet.png')
