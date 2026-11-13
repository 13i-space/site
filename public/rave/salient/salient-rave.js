(()=>{var Ef=0,ch=1,bf=2;var Au=1,Sf=2,Gn=3,Ln=0,kt=1,Bt=2,Pn=0,hs=1,qt=2,hh=3,uh=4,Af=5,Oi=100,wf=101,Tf=102,Rf=103,Cf=104,If=200,Pf=201,Lf=202,Df=203,ka=204,Fa=205,Nf=206,Uf=207,Of=208,Bf=209,kf=210,Ff=211,zf=212,Hf=213,Vf=214,za=0,Ha=1,Va=2,ps=3,Ga=4,Wa=5,Xa=6,qa=7,wu=0,Gf=1,Wf=2,pi=0,Zl=1,Ql=2,$l=3,mr=4,Xf=5,ec=6,tc=7,fh="attached",qf="detached",Tu=300,ms=301,gs=302,ja=303,Ya=304,Uo=306,Fi=1e3,Xn=1001,ir=1002,Pt=1003,nc=1004;var os=1005;var Xt=1006,$s=1007;var In=1008;var Yn=1009,Ru=1010,Cu=1011,sr=1012,ic=1013,zi=1014,Mn=1015,An=1016,sc=1017,rc=1018,xs=1020,Iu=35902,Pu=1021,Lu=1022,rn=1023,Du=1024,Nu=1025,us=1026,vs=1027,gr=1028,oc=1029,Uu=1030,ac=1031;var lc=1033,io=33776,so=33777,ro=33778,oo=33779,Ka=35840,Ja=35841,Za=35842,Qa=35843,$a=36196,el=37492,tl=37496,nl=37808,il=37809,sl=37810,rl=37811,ol=37812,al=37813,ll=37814,cl=37815,hl=37816,ul=37817,fl=37818,dl=37819,pl=37820,ml=37821,ao=36492,gl=36494,xl=36495,Ou=36283,vl=36284,yl=36285,Ml=36286,jf=2200,Yf=2201,Kf=2202,ys=2300,Ms=2301,oa=2302,as=2400,ls=2401,lo=2402,cc=2500,Jf=2501,Bu=0,Oo=1,xr=2,Zf=3200,Qf=3201;var ku=0,$f=1,fi="",St="srgb",Ft="srgb-linear",Bo="linear",nt="srgb";var Xi=7680;var dh=519,ed=512,td=513,nd=514,Fu=515,id=516,sd=517,rd=518,od=519,_l=35044;var ph="300 es",qn=2e3,co=2001,Kn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let i=this._listeners[e];if(i!==void 0){let r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let n=this._listeners[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,e);e.target=null}}},Nt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],mh=1234567,er=Math.PI/180,_s=180/Math.PI;function _n(){let s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Nt[s&255]+Nt[s>>8&255]+Nt[s>>16&255]+Nt[s>>24&255]+"-"+Nt[e&255]+Nt[e>>8&255]+"-"+Nt[e>>16&15|64]+Nt[e>>24&255]+"-"+Nt[t&63|128]+Nt[t>>8&255]+"-"+Nt[t>>16&255]+Nt[t>>24&255]+Nt[n&255]+Nt[n>>8&255]+Nt[n>>16&255]+Nt[n>>24&255]).toLowerCase()}function Ot(s,e,t){return Math.max(e,Math.min(t,s))}function hc(s,e){return(s%e+e)%e}function ad(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function ld(s,e,t){return s!==e?(t-s)/(e-s):0}function tr(s,e,t){return(1-t)*s+t*e}function cd(s,e,t,n){return tr(s,e,1-Math.exp(-t*n))}function hd(s,e=1){return e-Math.abs(hc(s,e*2)-e)}function ud(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function fd(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function dd(s,e){return s+Math.floor(Math.random()*(e-s+1))}function pd(s,e){return s+Math.random()*(e-s)}function md(s){return s*(.5-Math.random())}function gd(s){s!==void 0&&(mh=s);let e=mh+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function xd(s){return s*er}function vd(s){return s*_s}function yd(s){return(s&s-1)===0&&s!==0}function Md(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function _d(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Ed(s,e,t,n,i){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),f=o((e-n)/2),d=r((n-e)/2),g=o((n-e)/2);switch(i){case"XYX":s.set(a*h,l*u,l*f,a*c);break;case"YZY":s.set(l*f,a*h,l*u,a*c);break;case"ZXZ":s.set(l*u,l*f,a*h,a*c);break;case"XZX":s.set(a*h,l*g,l*d,a*c);break;case"YXY":s.set(l*d,a*h,l*g,a*c);break;case"ZYZ":s.set(l*g,l*d,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function yn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function rt(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}var zu={DEG2RAD:er,RAD2DEG:_s,generateUUID:_n,clamp:Ot,euclideanModulo:hc,mapLinear:ad,inverseLerp:ld,lerp:tr,damp:cd,pingpong:hd,smoothstep:ud,smootherstep:fd,randInt:dd,randFloat:pd,randFloatSpread:md,seededRandom:gd,degToRad:xd,radToDeg:vd,isPowerOfTwo:yd,ceilPowerOfTwo:Md,floorPowerOfTwo:_d,setQuaternionFromProperEuler:Ed,normalize:rt,denormalize:yn},Ce=class s{constructor(e=0,t=0){s.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ot(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*i+e.x,this.y=r*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ze=class s{constructor(e,t,n,i,r,o,a,l,c){s.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c)}set(e,t,n,i,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=i,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],d=n[5],g=n[8],x=i[0],m=i[3],p=i[6],A=i[1],E=i[4],v=i[7],P=i[2],w=i[5],R=i[8];return r[0]=o*x+a*A+l*P,r[3]=o*m+a*E+l*w,r[6]=o*p+a*v+l*R,r[1]=c*x+h*A+u*P,r[4]=c*m+h*E+u*w,r[7]=c*p+h*v+u*R,r[2]=f*x+d*A+g*P,r[5]=f*m+d*E+g*w,r[8]=f*p+d*v+g*R,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,f=a*l-h*r,d=c*r-o*l,g=t*u+n*f+i*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/g;return e[0]=u*x,e[1]=(i*c-h*n)*x,e[2]=(a*n-i*o)*x,e[3]=f*x,e[4]=(h*t-i*l)*x,e[5]=(i*r-a*t)*x,e[6]=d*x,e[7]=(n*l-c*t)*x,e[8]=(o*t-n*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-i*c,i*l,-i*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(aa.makeScale(e,t)),this}rotate(e){return this.premultiply(aa.makeRotation(-e)),this}translate(e,t){return this.premultiply(aa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},aa=new ze;function Hu(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function rr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function bd(){let s=rr("canvas");return s.style.display="block",s}var gh={};function Zs(s){s in gh||(gh[s]=!0,console.warn(s))}function Sd(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function Ad(s){let e=s.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function wd(s){let e=s.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}var Ge={enabled:!0,workingColorSpace:Ft,spaces:{},convert:function(s,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===nt&&(s.r=jn(s.r),s.g=jn(s.g),s.b=jn(s.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(s.applyMatrix3(this.spaces[e].toXYZ),s.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===nt&&(s.r=fs(s.r),s.g=fs(s.g),s.b=fs(s.b))),s},fromWorkingColorSpace:function(s,e){return this.convert(s,this.workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===fi?Bo:this.spaces[s].transfer},getLuminanceCoefficients:function(s,e=this.workingColorSpace){return s.fromArray(this.spaces[e].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,e,t){return s.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}};function jn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function fs(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var xh=[.64,.33,.3,.6,.15,.06],vh=[.2126,.7152,.0722],yh=[.3127,.329],Mh=new ze().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),_h=new ze().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ge.define({[Ft]:{primaries:xh,whitePoint:yh,transfer:Bo,toXYZ:Mh,fromXYZ:_h,luminanceCoefficients:vh,workingColorSpaceConfig:{unpackColorSpace:St},outputColorSpaceConfig:{drawingBufferColorSpace:St}},[St]:{primaries:xh,whitePoint:yh,transfer:nt,toXYZ:Mh,fromXYZ:_h,luminanceCoefficients:vh,outputColorSpaceConfig:{drawingBufferColorSpace:St}}});var qi,El=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{qi===void 0&&(qi=rr("canvas")),qi.width=e.width,qi.height=e.height;let n=qi.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=qi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=rr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=jn(r[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(jn(t[n]/255)*255):t[n]=jn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Td=0,ho=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Td++}),this.uuid=_n(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(la(i[o].image)):r.push(la(i[o]))}else r=la(i);n.url=r}return t||(e.images[this.uuid]=n),n}};function la(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?El.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Rd=0,Lt=class s extends Kn{constructor(e=s.DEFAULT_IMAGE,t=s.DEFAULT_MAPPING,n=Xn,i=Xn,r=Xt,o=In,a=rn,l=Yn,c=s.DEFAULT_ANISOTROPY,h=fi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Rd++}),this.uuid=_n(),this.name="",this.source=new ho(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Ce(0,0),this.repeat=new Ce(1,1),this.center=new Ce(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ze,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Tu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Fi:e.x=e.x-Math.floor(e.x);break;case Xn:e.x=e.x<0?0:1;break;case ir:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Fi:e.y=e.y-Math.floor(e.y);break;case Xn:e.y=e.y<0?0:1;break;case ir:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Lt.DEFAULT_IMAGE=null;Lt.DEFAULT_MAPPING=Tu;Lt.DEFAULT_ANISOTROPY=1;var $e=class s{constructor(e=0,t=0,n=0,i=1){s.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r,l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],d=l[5],g=l[9],x=l[2],m=l[6],p=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+x)<.1&&Math.abs(g+m)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let E=(c+1)/2,v=(d+1)/2,P=(p+1)/2,w=(h+f)/4,R=(u+x)/4,D=(g+m)/4;return E>v&&E>P?E<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(E),i=w/n,r=R/n):v>P?v<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(v),n=w/i,r=D/i):P<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(P),n=R/r,i=D/r),this.set(n,i,r,t),this}let A=Math.sqrt((m-g)*(m-g)+(u-x)*(u-x)+(f-h)*(f-h));return Math.abs(A)<.001&&(A=1),this.x=(m-g)/A,this.y=(u-x)/A,this.z=(f-h)/A,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},bl=class extends Kn{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new $e(0,0,e,t),this.scissorTest=!1,this.viewport=new $e(0,0,e,t);let i={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Xt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let r=new Lt(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new ho(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Gt=class extends bl{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},uo=class extends Lt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=Xn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Sl=class extends Lt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=Xn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Tt=class{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],f=r[o+0],d=r[o+1],g=r[o+2],x=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=f,e[t+1]=d,e[t+2]=g,e[t+3]=x;return}if(u!==x||l!==f||c!==d||h!==g){let m=1-a,p=l*f+c*d+h*g+u*x,A=p>=0?1:-1,E=1-p*p;if(E>Number.EPSILON){let P=Math.sqrt(E),w=Math.atan2(P,p*A);m=Math.sin(m*w)/P,a=Math.sin(a*w)/P}let v=a*A;if(l=l*m+f*v,c=c*m+d*v,h=h*m+g*v,u=u*m+x*v,m===1-a){let P=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=P,c*=P,h*=P,u*=P}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,o){let a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[o],f=r[o+1],d=r[o+2],g=r[o+3];return e[t]=a*g+h*u+l*d-c*f,e[t+1]=l*g+h*f+c*u-a*d,e[t+2]=c*g+h*d+a*f-l*u,e[t+3]=h*g-a*u-l*f-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,i=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),u=a(r/2),f=l(n/2),d=l(i/2),g=l(r/2);switch(o){case"XYZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"YZX":this._x=f*h*u+c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u-f*d*g;break;case"XZY":this._x=f*h*u-c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=n+a+u;if(f>0){let d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(o-i)*d}else if(n>a&&n>u){let d=2*Math.sqrt(1+n-a-u);this._w=(h-l)/d,this._x=.25*d,this._y=(i+o)/d,this._z=(r+c)/d}else if(a>u){let d=2*Math.sqrt(1+a-n-u);this._w=(r-c)/d,this._x=(i+o)/d,this._y=.25*d,this._z=(l+h)/d}else{let d=2*Math.sqrt(1+u-n-a);this._w=(o-i)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ot(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,i=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,i=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+i*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let d=1-t;return this._w=d*o+t*this._w,this._x=d*n+t*this._x,this._y=d*i+t*this._y,this._z=d*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,f=Math.sin(t*h)/c;return this._w=o*u+this._w*f,this._x=n*u+this._x*f,this._y=i*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},N=class s{constructor(e=0,t=0,n=0){s.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Eh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Eh.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*i-a*n),h=2*(a*t-r*i),u=2*(r*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=i+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,i=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ca.copy(this).projectOnVector(e),this.sub(ca)}reflect(e){return this.sub(ca.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ot(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ca=new N,Eh=new Tt,jt=class{constructor(e=new N(1/0,1/0,1/0),t=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(gn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(gn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=gn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,gn):gn.fromBufferAttribute(r,o),gn.applyMatrix4(e.matrixWorld),this.expandByPoint(gn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ir.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ir.copy(n.boundingBox)),Ir.applyMatrix4(e.matrixWorld),this.union(Ir)}let i=e.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,gn),gn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Gs),Pr.subVectors(this.max,Gs),ji.subVectors(e.a,Gs),Yi.subVectors(e.b,Gs),Ki.subVectors(e.c,Gs),oi.subVectors(Yi,ji),ai.subVectors(Ki,Yi),Ci.subVectors(ji,Ki);let t=[0,-oi.z,oi.y,0,-ai.z,ai.y,0,-Ci.z,Ci.y,oi.z,0,-oi.x,ai.z,0,-ai.x,Ci.z,0,-Ci.x,-oi.y,oi.x,0,-ai.y,ai.x,0,-Ci.y,Ci.x,0];return!ha(t,ji,Yi,Ki,Pr)||(t=[1,0,0,0,1,0,0,0,1],!ha(t,ji,Yi,Ki,Pr))?!1:(Lr.crossVectors(oi,ai),t=[Lr.x,Lr.y,Lr.z],ha(t,ji,Yi,Ki,Pr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,gn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(gn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Bn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Bn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Bn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Bn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Bn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Bn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Bn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Bn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Bn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},Bn=[new N,new N,new N,new N,new N,new N,new N,new N],gn=new N,Ir=new jt,ji=new N,Yi=new N,Ki=new N,oi=new N,ai=new N,Ci=new N,Gs=new N,Pr=new N,Lr=new N,Ii=new N;function ha(s,e,t,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Ii.fromArray(s,r);let a=i.x*Math.abs(Ii.x)+i.y*Math.abs(Ii.y)+i.z*Math.abs(Ii.z),l=e.dot(Ii),c=t.dot(Ii),h=n.dot(Ii);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Cd=new jt,Ws=new N,ua=new N,Zt=class{constructor(e=new N,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Cd.setFromPoints(e).getCenter(n);let i=0;for(let r=0,o=e.length;r<o;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ws.subVectors(e,this.center);let t=Ws.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Ws,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ua.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ws.copy(e.center).add(ua)),this.expandByPoint(Ws.copy(e.center).sub(ua))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},kn=new N,fa=new N,Dr=new N,li=new N,da=new N,Nr=new N,pa=new N,Es=class{constructor(e=new N,t=new N(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,kn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=kn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(kn.copy(this.origin).addScaledVector(this.direction,t),kn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){fa.copy(e).add(t).multiplyScalar(.5),Dr.copy(t).sub(e).normalize(),li.copy(this.origin).sub(fa);let r=e.distanceTo(t)*.5,o=-this.direction.dot(Dr),a=li.dot(this.direction),l=-li.dot(Dr),c=li.lengthSq(),h=Math.abs(1-o*o),u,f,d,g;if(h>0)if(u=o*l-a,f=o*a-l,g=r*h,u>=0)if(f>=-g)if(f<=g){let x=1/h;u*=x,f*=x,d=u*(u+o*f+2*a)+f*(o*u+f+2*l)+c}else f=r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;else f<=-g?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c):f<=g?(u=0,f=Math.min(Math.max(-r,-l),r),d=f*(f+2*l)+c):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(fa).addScaledVector(Dr,f),d}intersectSphere(e,t){kn.subVectors(e.center,this.origin);let n=kn.dot(this.direction),i=kn.dot(kn)-n*n,r=e.radius*e.radius;if(i>r)return null;let o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,i=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,i=(e.min.x-f.x)*c),h>=0?(r=(e.min.y-f.y)*h,o=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,o=(e.min.y-f.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(a=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,kn)!==null}intersectTriangle(e,t,n,i,r){da.subVectors(t,e),Nr.subVectors(n,e),pa.crossVectors(da,Nr);let o=this.direction.dot(pa),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;li.subVectors(this.origin,e);let l=a*this.direction.dot(Nr.crossVectors(li,Nr));if(l<0)return null;let c=a*this.direction.dot(da.cross(li));if(c<0||l+c>o)return null;let h=-a*li.dot(pa);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},De=class s{constructor(e,t,n,i,r,o,a,l,c,h,u,f,d,g,x,m){s.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c,h,u,f,d,g,x,m)}set(e,t,n,i,r,o,a,l,c,h,u,f,d,g,x,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=x,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new s().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,i=1/Ji.setFromMatrixColumn(e,0).length(),r=1/Ji.setFromMatrixColumn(e,1).length(),o=1/Ji.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,i=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let f=o*h,d=o*u,g=a*h,x=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=d+g*c,t[5]=f-x*c,t[9]=-a*l,t[2]=x-f*c,t[6]=g+d*c,t[10]=o*l}else if(e.order==="YXZ"){let f=l*h,d=l*u,g=c*h,x=c*u;t[0]=f+x*a,t[4]=g*a-d,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=d*a-g,t[6]=x+f*a,t[10]=o*l}else if(e.order==="ZXY"){let f=l*h,d=l*u,g=c*h,x=c*u;t[0]=f-x*a,t[4]=-o*u,t[8]=g+d*a,t[1]=d+g*a,t[5]=o*h,t[9]=x-f*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let f=o*h,d=o*u,g=a*h,x=a*u;t[0]=l*h,t[4]=g*c-d,t[8]=f*c+x,t[1]=l*u,t[5]=x*c+f,t[9]=d*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let f=o*l,d=o*c,g=a*l,x=a*c;t[0]=l*h,t[4]=x-f*u,t[8]=g*u+d,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=d*u+g,t[10]=f-x*u}else if(e.order==="XZY"){let f=o*l,d=o*c,g=a*l,x=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+x,t[5]=o*h,t[9]=d*u-g,t[2]=g*u-d,t[6]=a*h,t[10]=x*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Id,e,Pd)}lookAt(e,t,n){let i=this.elements;return Kt.subVectors(e,t),Kt.lengthSq()===0&&(Kt.z=1),Kt.normalize(),ci.crossVectors(n,Kt),ci.lengthSq()===0&&(Math.abs(n.z)===1?Kt.x+=1e-4:Kt.z+=1e-4,Kt.normalize(),ci.crossVectors(n,Kt)),ci.normalize(),Ur.crossVectors(Kt,ci),i[0]=ci.x,i[4]=Ur.x,i[8]=Kt.x,i[1]=ci.y,i[5]=Ur.y,i[9]=Kt.y,i[2]=ci.z,i[6]=Ur.z,i[10]=Kt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],d=n[13],g=n[2],x=n[6],m=n[10],p=n[14],A=n[3],E=n[7],v=n[11],P=n[15],w=i[0],R=i[4],D=i[8],b=i[12],y=i[1],M=i[5],C=i[9],L=i[13],U=i[2],F=i[6],W=i[10],J=i[14],I=i[3],Y=i[7],se=i[11],le=i[15];return r[0]=o*w+a*y+l*U+c*I,r[4]=o*R+a*M+l*F+c*Y,r[8]=o*D+a*C+l*W+c*se,r[12]=o*b+a*L+l*J+c*le,r[1]=h*w+u*y+f*U+d*I,r[5]=h*R+u*M+f*F+d*Y,r[9]=h*D+u*C+f*W+d*se,r[13]=h*b+u*L+f*J+d*le,r[2]=g*w+x*y+m*U+p*I,r[6]=g*R+x*M+m*F+p*Y,r[10]=g*D+x*C+m*W+p*se,r[14]=g*b+x*L+m*J+p*le,r[3]=A*w+E*y+v*U+P*I,r[7]=A*R+E*M+v*F+P*Y,r[11]=A*D+E*C+v*W+P*se,r[15]=A*b+E*L+v*J+P*le,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],d=e[14],g=e[3],x=e[7],m=e[11],p=e[15];return g*(+r*l*u-i*c*u-r*a*f+n*c*f+i*a*d-n*l*d)+x*(+t*l*d-t*c*f+r*o*f-i*o*d+i*c*h-r*l*h)+m*(+t*c*u-t*a*d-r*o*u+n*o*d+r*a*h-n*c*h)+p*(-i*a*h-t*l*u+t*a*f+i*o*u-n*o*f+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],d=e[11],g=e[12],x=e[13],m=e[14],p=e[15],A=u*m*c-x*f*c+x*l*d-a*m*d-u*l*p+a*f*p,E=g*f*c-h*m*c-g*l*d+o*m*d+h*l*p-o*f*p,v=h*x*c-g*u*c+g*a*d-o*x*d-h*a*p+o*u*p,P=g*u*l-h*x*l-g*a*f+o*x*f+h*a*m-o*u*m,w=t*A+n*E+i*v+r*P;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let R=1/w;return e[0]=A*R,e[1]=(x*f*r-u*m*r-x*i*d+n*m*d+u*i*p-n*f*p)*R,e[2]=(a*m*r-x*l*r+x*i*c-n*m*c-a*i*p+n*l*p)*R,e[3]=(u*l*r-a*f*r-u*i*c+n*f*c+a*i*d-n*l*d)*R,e[4]=E*R,e[5]=(h*m*r-g*f*r+g*i*d-t*m*d-h*i*p+t*f*p)*R,e[6]=(g*l*r-o*m*r-g*i*c+t*m*c+o*i*p-t*l*p)*R,e[7]=(o*f*r-h*l*r+h*i*c-t*f*c-o*i*d+t*l*d)*R,e[8]=v*R,e[9]=(g*u*r-h*x*r-g*n*d+t*x*d+h*n*p-t*u*p)*R,e[10]=(o*x*r-g*a*r+g*n*c-t*x*c-o*n*p+t*a*p)*R,e[11]=(h*a*r-o*u*r-h*n*c+t*u*c+o*n*d-t*a*d)*R,e[12]=P*R,e[13]=(h*x*i-g*u*i+g*n*f-t*x*f-h*n*m+t*u*m)*R,e[14]=(g*a*i-o*x*i-g*n*l+t*x*l+o*n*m-t*a*m)*R,e[15]=(o*u*i-h*a*i+h*n*l-t*u*l-o*n*f+t*a*f)*R,this}scale(e){let t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,o){return this.set(1,n,r,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,f=r*c,d=r*h,g=r*u,x=o*h,m=o*u,p=a*u,A=l*c,E=l*h,v=l*u,P=n.x,w=n.y,R=n.z;return i[0]=(1-(x+p))*P,i[1]=(d+v)*P,i[2]=(g-E)*P,i[3]=0,i[4]=(d-v)*w,i[5]=(1-(f+p))*w,i[6]=(m+A)*w,i[7]=0,i[8]=(g+E)*R,i[9]=(m-A)*R,i[10]=(1-(f+x))*R,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements,r=Ji.set(i[0],i[1],i[2]).length(),o=Ji.set(i[4],i[5],i[6]).length(),a=Ji.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],xn.copy(this);let c=1/r,h=1/o,u=1/a;return xn.elements[0]*=c,xn.elements[1]*=c,xn.elements[2]*=c,xn.elements[4]*=h,xn.elements[5]*=h,xn.elements[6]*=h,xn.elements[8]*=u,xn.elements[9]*=u,xn.elements[10]*=u,t.setFromRotationMatrix(xn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,i,r,o,a=qn){let l=this.elements,c=2*r/(t-e),h=2*r/(n-i),u=(t+e)/(t-e),f=(n+i)/(n-i),d,g;if(a===qn)d=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===co)d=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,r,o,a=qn){let l=this.elements,c=1/(t-e),h=1/(n-i),u=1/(o-r),f=(t+e)*c,d=(n+i)*h,g,x;if(a===qn)g=(o+r)*u,x=-2*u;else if(a===co)g=r*u,x=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=x,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Ji=new N,xn=new De,Id=new N(0,0,0),Pd=new N(1,1,1),ci=new N,Ur=new N,Kt=new N,bh=new De,Sh=new Tt,on=class s{constructor(e=0,t=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],u=i[2],f=i[6],d=i[10];switch(t){case"XYZ":this._y=Math.asin(Ot(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ot(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ot(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ot(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ot(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Ot(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return bh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(bh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Sh.setFromEuler(this),this.setFromQuaternion(Sh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};on.DEFAULT_ORDER="XYZ";var fo=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Ld=0,Ah=new N,Zi=new Tt,Fn=new De,Or=new N,Xs=new N,Dd=new N,Nd=new Tt,wh=new N(1,0,0),Th=new N(0,1,0),Rh=new N(0,0,1),Ch={type:"added"},Ud={type:"removed"},Qi={type:"childadded",child:null},ma={type:"childremoved",child:null},xt=class s extends Kn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ld++}),this.uuid=_n(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let e=new N,t=new on,n=new Tt,i=new N(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new De},normalMatrix:{value:new ze}}),this.matrix=new De,this.matrixWorld=new De,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new fo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Zi.setFromAxisAngle(e,t),this.quaternion.multiply(Zi),this}rotateOnWorldAxis(e,t){return Zi.setFromAxisAngle(e,t),this.quaternion.premultiply(Zi),this}rotateX(e){return this.rotateOnAxis(wh,e)}rotateY(e){return this.rotateOnAxis(Th,e)}rotateZ(e){return this.rotateOnAxis(Rh,e)}translateOnAxis(e,t){return Ah.copy(e).applyQuaternion(this.quaternion),this.position.add(Ah.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(wh,e)}translateY(e){return this.translateOnAxis(Th,e)}translateZ(e){return this.translateOnAxis(Rh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Fn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Or.copy(e):Or.set(e,t,n);let i=this.parent;this.updateWorldMatrix(!0,!1),Xs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Fn.lookAt(Xs,Or,this.up):Fn.lookAt(Or,Xs,this.up),this.quaternion.setFromRotationMatrix(Fn),i&&(Fn.extractRotation(i.matrixWorld),Zi.setFromRotationMatrix(Fn),this.quaternion.premultiply(Zi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ch),Qi.child=e,this.dispatchEvent(Qi),Qi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Ud),ma.child=e,this.dispatchEvent(ma),ma.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Fn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Fn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Fn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ch),Qi.child=e,this.dispatchEvent(Qi),Qi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xs,e,Dd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xs,Nd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];i.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),f=o(e.skeletons),d=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}};xt.DEFAULT_UP=new N(0,1,0);xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var vn=new N,zn=new N,ga=new N,Hn=new N,$i=new N,es=new N,Ih=new N,xa=new N,va=new N,ya=new N,Ma=new $e,_a=new $e,Ea=new $e,Bi=class s{constructor(e=new N,t=new N,n=new N){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),vn.subVectors(e,t),i.cross(vn);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){vn.subVectors(i,t),zn.subVectors(n,t),ga.subVectors(e,t);let o=vn.dot(vn),a=vn.dot(zn),l=vn.dot(ga),c=zn.dot(zn),h=zn.dot(ga),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let f=1/u,d=(c*l-a*h)*f,g=(o*h-a*l)*f;return r.set(1-d-g,g,d)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Hn)===null?!1:Hn.x>=0&&Hn.y>=0&&Hn.x+Hn.y<=1}static getInterpolation(e,t,n,i,r,o,a,l){return this.getBarycoord(e,t,n,i,Hn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Hn.x),l.addScaledVector(o,Hn.y),l.addScaledVector(a,Hn.z),l)}static getInterpolatedAttribute(e,t,n,i,r,o){return Ma.setScalar(0),_a.setScalar(0),Ea.setScalar(0),Ma.fromBufferAttribute(e,t),_a.fromBufferAttribute(e,n),Ea.fromBufferAttribute(e,i),o.setScalar(0),o.addScaledVector(Ma,r.x),o.addScaledVector(_a,r.y),o.addScaledVector(Ea,r.z),o}static isFrontFacing(e,t,n,i){return vn.subVectors(n,t),zn.subVectors(e,t),vn.cross(zn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return vn.subVectors(this.c,this.b),zn.subVectors(this.a,this.b),vn.cross(zn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return s.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return s.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return s.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return s.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return s.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,r=this.c,o,a;$i.subVectors(i,n),es.subVectors(r,n),xa.subVectors(e,n);let l=$i.dot(xa),c=es.dot(xa);if(l<=0&&c<=0)return t.copy(n);va.subVectors(e,i);let h=$i.dot(va),u=es.dot(va);if(h>=0&&u<=h)return t.copy(i);let f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector($i,o);ya.subVectors(e,r);let d=$i.dot(ya),g=es.dot(ya);if(g>=0&&d<=g)return t.copy(r);let x=d*c-l*g;if(x<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(es,a);let m=h*g-d*u;if(m<=0&&u-h>=0&&d-g>=0)return Ih.subVectors(r,i),a=(u-h)/(u-h+(d-g)),t.copy(i).addScaledVector(Ih,a);let p=1/(m+x+f);return o=x*p,a=f*p,t.copy(n).addScaledVector($i,o).addScaledVector(es,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Vu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},hi={h:0,s:0,l:0},Br={h:0,s:0,l:0};function ba(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}var he=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=St){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ge.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=Ge.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ge.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=Ge.workingColorSpace){if(e=hc(e,1),t=Ot(t,0,1),n=Ot(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=ba(o,r,e+1/3),this.g=ba(o,r,e),this.b=ba(o,r,e-1/3)}return Ge.toWorkingColorSpace(this,i),this}setStyle(e,t=St){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=St){let n=Vu[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=jn(e.r),this.g=jn(e.g),this.b=jn(e.b),this}copyLinearToSRGB(e){return this.r=fs(e.r),this.g=fs(e.g),this.b=fs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=St){return Ge.fromWorkingColorSpace(Ut.copy(this),e),Math.round(Ot(Ut.r*255,0,255))*65536+Math.round(Ot(Ut.g*255,0,255))*256+Math.round(Ot(Ut.b*255,0,255))}getHexString(e=St){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ge.workingColorSpace){Ge.fromWorkingColorSpace(Ut.copy(this),t);let n=Ut.r,i=Ut.g,r=Ut.b,o=Math.max(n,i,r),a=Math.min(n,i,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Ge.workingColorSpace){return Ge.fromWorkingColorSpace(Ut.copy(this),t),e.r=Ut.r,e.g=Ut.g,e.b=Ut.b,e}getStyle(e=St){Ge.fromWorkingColorSpace(Ut.copy(this),e);let t=Ut.r,n=Ut.g,i=Ut.b;return e!==St?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(hi),this.setHSL(hi.h+e,hi.s+t,hi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(hi),e.getHSL(Br);let n=tr(hi.h,Br.h,t),i=tr(hi.s,Br.s,t),r=tr(hi.l,Br.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ut=new he;he.NAMES=Vu;var Od=0,Qt=class extends Kn{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Od++}),this.uuid=_n(),this.name="",this.blending=hs,this.side=Ln,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ka,this.blendDst=Fa,this.blendEquation=Oi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new he(0,0,0),this.blendAlpha=0,this.depthFunc=ps,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=dh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Xi,this.stencilZFail=Xi,this.stencilZPass=Xi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==hs&&(n.blending=this.blending),this.side!==Ln&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ka&&(n.blendSrc=this.blendSrc),this.blendDst!==Fa&&(n.blendDst=this.blendDst),this.blendEquation!==Oi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ps&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==dh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Xi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Xi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Xi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=i(e.textures),o=i(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},We=class extends Qt{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new he(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.combine=wu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var bt=new N,kr=new Ce,gt=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=_l,this.updateRanges=[],this.gpuType=Mn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)kr.fromBufferAttribute(this,t),kr.applyMatrix3(e),this.setXY(t,kr.x,kr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix3(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix4(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyNormalMatrix(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.transformDirection(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=yn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=rt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=yn(t,this.array)),t}setX(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=yn(t,this.array)),t}setY(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=yn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=yn(t,this.array)),t}setW(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array),i=rt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array),i=rt(i,this.array),r=rt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==_l&&(e.usage=this.usage),e}};var po=class extends gt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var mo=class extends gt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var it=class extends gt{constructor(e,t,n){super(new Float32Array(e),t,n)}},Bd=0,sn=new De,Sa=new xt,ts=new N,Jt=new jt,qs=new jt,It=new N,Mt=class s extends Kn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Bd++}),this.uuid=_n(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Hu(e)?mo:po)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new ze().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return sn.makeRotationFromQuaternion(e),this.applyMatrix4(sn),this}rotateX(e){return sn.makeRotationX(e),this.applyMatrix4(sn),this}rotateY(e){return sn.makeRotationY(e),this.applyMatrix4(sn),this}rotateZ(e){return sn.makeRotationZ(e),this.applyMatrix4(sn),this}translate(e,t,n){return sn.makeTranslation(e,t,n),this.applyMatrix4(sn),this}scale(e,t,n){return sn.makeScale(e,t,n),this.applyMatrix4(sn),this}lookAt(e){return Sa.lookAt(e),Sa.updateMatrix(),this.applyMatrix4(Sa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ts).negate(),this.translate(ts.x,ts.y,ts.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let i=0,r=e.length;i<r;i++){let o=e[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new it(n,3))}else{for(let n=0,i=t.count;n<i;n++){let r=e[n];t.setXYZ(n,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new jt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let r=t[n];Jt.setFromBufferAttribute(r),this.morphTargetsRelative?(It.addVectors(this.boundingBox.min,Jt.min),this.boundingBox.expandByPoint(It),It.addVectors(this.boundingBox.max,Jt.max),this.boundingBox.expandByPoint(It)):(this.boundingBox.expandByPoint(Jt.min),this.boundingBox.expandByPoint(Jt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Zt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(e){let n=this.boundingSphere.center;if(Jt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];qs.setFromBufferAttribute(a),this.morphTargetsRelative?(It.addVectors(Jt.min,qs.min),Jt.expandByPoint(It),It.addVectors(Jt.max,qs.max),Jt.expandByPoint(It)):(Jt.expandByPoint(qs.min),Jt.expandByPoint(qs.max))}Jt.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)It.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(It));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)It.fromBufferAttribute(a,c),l&&(ts.fromBufferAttribute(e,c),It.add(ts)),i=Math.max(i,n.distanceToSquared(It))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new gt(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let D=0;D<n.count;D++)a[D]=new N,l[D]=new N;let c=new N,h=new N,u=new N,f=new Ce,d=new Ce,g=new Ce,x=new N,m=new N;function p(D,b,y){c.fromBufferAttribute(n,D),h.fromBufferAttribute(n,b),u.fromBufferAttribute(n,y),f.fromBufferAttribute(r,D),d.fromBufferAttribute(r,b),g.fromBufferAttribute(r,y),h.sub(c),u.sub(c),d.sub(f),g.sub(f);let M=1/(d.x*g.y-g.x*d.y);isFinite(M)&&(x.copy(h).multiplyScalar(g.y).addScaledVector(u,-d.y).multiplyScalar(M),m.copy(u).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(M),a[D].add(x),a[b].add(x),a[y].add(x),l[D].add(m),l[b].add(m),l[y].add(m))}let A=this.groups;A.length===0&&(A=[{start:0,count:e.count}]);for(let D=0,b=A.length;D<b;++D){let y=A[D],M=y.start,C=y.count;for(let L=M,U=M+C;L<U;L+=3)p(e.getX(L+0),e.getX(L+1),e.getX(L+2))}let E=new N,v=new N,P=new N,w=new N;function R(D){P.fromBufferAttribute(i,D),w.copy(P);let b=a[D];E.copy(b),E.sub(P.multiplyScalar(P.dot(b))).normalize(),v.crossVectors(w,b);let M=v.dot(l[D])<0?-1:1;o.setXYZW(D,E.x,E.y,E.z,M)}for(let D=0,b=A.length;D<b;++D){let y=A[D],M=y.start,C=y.count;for(let L=M,U=M+C;L<U;L+=3)R(e.getX(L+0)),R(e.getX(L+1)),R(e.getX(L+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new gt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);let i=new N,r=new N,o=new N,a=new N,l=new N,c=new N,h=new N,u=new N;if(e)for(let f=0,d=e.count;f<d;f+=3){let g=e.getX(f+0),x=e.getX(f+1),m=e.getX(f+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,x),o.fromBufferAttribute(t,m),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,d=t.count;f<d;f+=3)i.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)It.fromBufferAttribute(e,t),It.normalize(),e.setXYZ(t,It.x,It.y,It.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,f=new c.constructor(l.length*h),d=0,g=0;for(let x=0,m=l.length;x<m;x++){a.isInterleavedBufferAttribute?d=l[x]*a.data.stride+a.offset:d=l[x]*h;for(let p=0;p<h;p++)f[g++]=c[d++]}return new gt(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new s,n=this.index.array,i=this.attributes;for(let a in i){let l=i[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let f=c[h],d=e(f,n);l.push(d)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let i={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){let d=c[u];h.push(d.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let i=e.attributes;for(let c in i){let h=i[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ph=new De,Pi=new Es,Fr=new Zt,Lh=new N,zr=new N,Hr=new N,Vr=new N,Aa=new N,Gr=new N,Dh=new N,Wr=new N,Q=class extends xt{constructor(e=new Mt,t=new We){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let a=this.morphTargetInfluences;if(r&&a){Gr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(Aa.fromBufferAttribute(u,e),o?Gr.addScaledVector(Aa,h):Gr.addScaledVector(Aa.sub(t),h))}t.add(Gr)}return t}raycast(e,t){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Fr.copy(n.boundingSphere),Fr.applyMatrix4(r),Pi.copy(e.ray).recast(e.near),!(Fr.containsPoint(Pi.origin)===!1&&(Pi.intersectSphere(Fr,Lh)===null||Pi.origin.distanceToSquared(Lh)>(e.far-e.near)**2))&&(Ph.copy(r).invert(),Pi.copy(e.ray).applyMatrix4(Ph),!(n.boundingBox!==null&&Pi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Pi)))}_computeIntersections(e,t,n){let i,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=f.length;g<x;g++){let m=f[g],p=o[m.materialIndex],A=Math.max(m.start,d.start),E=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let v=A,P=E;v<P;v+=3){let w=a.getX(v),R=a.getX(v+1),D=a.getX(v+2);i=Xr(this,p,e,n,c,h,u,w,R,D),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{let g=Math.max(0,d.start),x=Math.min(a.count,d.start+d.count);for(let m=g,p=x;m<p;m+=3){let A=a.getX(m),E=a.getX(m+1),v=a.getX(m+2);i=Xr(this,o,e,n,c,h,u,A,E,v),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,x=f.length;g<x;g++){let m=f[g],p=o[m.materialIndex],A=Math.max(m.start,d.start),E=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let v=A,P=E;v<P;v+=3){let w=v,R=v+1,D=v+2;i=Xr(this,p,e,n,c,h,u,w,R,D),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{let g=Math.max(0,d.start),x=Math.min(l.count,d.start+d.count);for(let m=g,p=x;m<p;m+=3){let A=m,E=m+1,v=m+2;i=Xr(this,o,e,n,c,h,u,A,E,v),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}};function kd(s,e,t,n,i,r,o,a){let l;if(e.side===kt?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,e.side===Ln,a),l===null)return null;Wr.copy(a),Wr.applyMatrix4(s.matrixWorld);let c=t.ray.origin.distanceTo(Wr);return c<t.near||c>t.far?null:{distance:c,point:Wr.clone(),object:s}}function Xr(s,e,t,n,i,r,o,a,l,c){s.getVertexPosition(a,zr),s.getVertexPosition(l,Hr),s.getVertexPosition(c,Vr);let h=kd(s,e,t,n,zr,Hr,Vr,Dh);if(h){let u=new N;Bi.getBarycoord(Dh,zr,Hr,Vr,u),i&&(h.uv=Bi.getInterpolatedAttribute(i,a,l,c,u,new Ce)),r&&(h.uv1=Bi.getInterpolatedAttribute(r,a,l,c,u,new Ce)),o&&(h.normal=Bi.getInterpolatedAttribute(o,a,l,c,u,new N),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let f={a,b:l,c,normal:new N,materialIndex:0};Bi.getNormal(zr,Hr,Vr,f.normal),h.face=f,h.barycoord=u}return h}var Pe=class s extends Mt{constructor(e=1,t=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};let a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],f=0,d=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,i,o,2),g("x","z","y",1,-1,e,n,-t,i,o,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new it(c,3)),this.setAttribute("normal",new it(h,3)),this.setAttribute("uv",new it(u,2));function g(x,m,p,A,E,v,P,w,R,D,b){let y=v/R,M=P/D,C=v/2,L=P/2,U=w/2,F=R+1,W=D+1,J=0,I=0,Y=new N;for(let se=0;se<W;se++){let le=se*M-L;for(let V=0;V<F;V++){let Z=V*y-C;Y[x]=Z*A,Y[m]=le*E,Y[p]=U,c.push(Y.x,Y.y,Y.z),Y[x]=0,Y[m]=0,Y[p]=w>0?1:-1,h.push(Y.x,Y.y,Y.z),u.push(V/R),u.push(1-se/D),J+=1}}for(let se=0;se<D;se++)for(let le=0;le<R;le++){let V=f+le+F*se,Z=f+le+F*(se+1),O=f+(le+1)+F*(se+1),G=f+(le+1)+F*se;l.push(V,Z,G),l.push(Z,O,G),I+=6}a.addGroup(d,I,b),d+=I,f+=J}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function bs(s){let e={};for(let t in s){e[t]={};for(let n in s[t]){let i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Vt(s){let e={};for(let t=0;t<s.length;t++){let n=bs(s[t]);for(let i in n)e[i]=n[i]}return e}function Fd(s){let e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Gu(s){let e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ge.workingColorSpace}var bi={clone:bs,merge:Vt},zd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Hd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ct=class extends Qt{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=zd,this.fragmentShader=Hd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=bs(e.uniforms),this.uniformsGroups=Fd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},go=class extends xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new De,this.projectionMatrix=new De,this.projectionMatrixInverse=new De,this.coordinateSystem=qn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},ui=new N,Nh=new Ce,Uh=new Ce,wt=class extends go{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=_s*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(er*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return _s*2*Math.atan(Math.tan(er*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ui.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ui.x,ui.y).multiplyScalar(-e/ui.z),ui.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ui.x,ui.y).multiplyScalar(-e/ui.z)}getViewSize(e,t){return this.getViewBounds(e,Nh,Uh),t.subVectors(Uh,Nh)}setViewOffset(e,t,n,i,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(er*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,t-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},ns=-90,is=1,Al=class extends xt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new wt(ns,is,e,t);i.layers=this.layers,this.add(i);let r=new wt(ns,is,e,t);r.layers=this.layers,this.add(r);let o=new wt(ns,is,e,t);o.layers=this.layers,this.add(o);let a=new wt(ns,is,e,t);a.layers=this.layers,this.add(a);let l=new wt(ns,is,e,t);l.layers=this.layers,this.add(l);let c=new wt(ns,is,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,i,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===qn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===co)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(u,f,d),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},xo=class extends Lt{constructor(e,t,n,i,r,o,a,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:ms,super(e,t,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},wl=class extends Gt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new xo(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Xt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Pe(5,5,5),r=new ct({name:"CubemapFromEquirect",uniforms:bs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:kt,blending:Pn});r.uniforms.tEquirect.value=t;let o=new Q(i,r),a=t.minFilter;return t.minFilter===In&&(t.minFilter=Xt),new Al(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,i){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(r)}},wa=new N,Vd=new N,Gd=new ze,Wn=class{constructor(e=new N(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=wa.subVectors(n,t).cross(Vd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(wa),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Gd.getNormalMatrix(e),i=this.coplanarPoint(wa).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Li=new Zt,qr=new N,or=class{constructor(e=new Wn,t=new Wn,n=new Wn,i=new Wn,r=new Wn,o=new Wn){this.planes=[e,t,n,i,r,o]}set(e,t,n,i,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=qn){let n=this.planes,i=e.elements,r=i[0],o=i[1],a=i[2],l=i[3],c=i[4],h=i[5],u=i[6],f=i[7],d=i[8],g=i[9],x=i[10],m=i[11],p=i[12],A=i[13],E=i[14],v=i[15];if(n[0].setComponents(l-r,f-c,m-d,v-p).normalize(),n[1].setComponents(l+r,f+c,m+d,v+p).normalize(),n[2].setComponents(l+o,f+h,m+g,v+A).normalize(),n[3].setComponents(l-o,f-h,m-g,v-A).normalize(),n[4].setComponents(l-a,f-u,m-x,v-E).normalize(),t===qn)n[5].setComponents(l+a,f+u,m+x,v+E).normalize();else if(t===co)n[5].setComponents(a,u,x,E).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Li.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Li.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Li)}intersectsSprite(e){return Li.center.set(0,0,0),Li.radius=.7071067811865476,Li.applyMatrix4(e.matrixWorld),this.intersectsSphere(Li)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(qr.x=i.normal.x>0?e.max.x:e.min.x,qr.y=i.normal.y>0?e.max.y:e.min.y,qr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(qr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Wu(){let s=null,e=!1,t=null,n=null;function i(r,o){t(r,o),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Wd(s){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,u=c.byteLength,f=s.createBuffer();s.bindBuffer(l,f),s.bufferData(l,c,h),a.onUploadCallback();let d;if(c instanceof Float32Array)d=s.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=s.HALF_FLOAT:d=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=s.SHORT;else if(c instanceof Uint32Array)d=s.UNSIGNED_INT;else if(c instanceof Int32Array)d=s.INT;else if(c instanceof Int8Array)d=s.BYTE;else if(c instanceof Uint8Array)d=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(s.bindBuffer(c,a),u.length===0)s.bufferSubData(c,0,h);else{u.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<u.length;d++){let g=u[f],x=u[d];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++f,u[f]=x)}u.length=f+1;for(let d=0,g=u.length;d<g;d++){let x=u[d];s.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(s.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:r,update:o}}var $t=class s extends Mt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,u=e/a,f=t/l,d=[],g=[],x=[],m=[];for(let p=0;p<h;p++){let A=p*f-o;for(let E=0;E<c;E++){let v=E*u-r;g.push(v,-A,0),x.push(0,0,1),m.push(E/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let A=0;A<a;A++){let E=A+c*p,v=A+c*(p+1),P=A+1+c*(p+1),w=A+1+c*p;d.push(E,v,w),d.push(v,P,w)}this.setIndex(d),this.setAttribute("position",new it(g,3)),this.setAttribute("normal",new it(x,3)),this.setAttribute("uv",new it(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.width,e.height,e.widthSegments,e.heightSegments)}},Xd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,qd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,jd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Yd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Kd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Jd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Zd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Qd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,$d=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,ep=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,tp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,np=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ip=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,sp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,rp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,op=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,ap=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,lp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,cp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,hp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,up=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,fp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,dp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,pp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,mp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,gp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,xp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,vp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,yp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Mp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,_p="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ep=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,bp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Sp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ap=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,wp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Tp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Rp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Cp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ip=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Pp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Lp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Dp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Np=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Up=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Op=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Bp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,kp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Fp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,zp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Hp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Vp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Gp=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Wp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Xp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,qp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,jp=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Yp=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Kp=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Jp=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Zp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Qp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,$p=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,em=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,tm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,nm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,im=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,sm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,rm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,om=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,am=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,cm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,hm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,um=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,dm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,pm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,mm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,gm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,xm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,vm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ym=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Mm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,_m=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Em=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,bm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Sm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Am=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,wm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Tm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Rm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Cm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Im=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Pm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Lm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Dm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Nm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Um=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Om=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Bm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,km=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Fm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,zm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Hm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Vm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Gm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Wm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Xm=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,jm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ym=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Km=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Jm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Zm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Qm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,$m=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,eg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,tg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ng=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ig=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,rg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,og=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ag=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,cg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,ug=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,fg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,dg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,mg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,yg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Mg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_g=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Eg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,bg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ve={alphahash_fragment:Xd,alphahash_pars_fragment:qd,alphamap_fragment:jd,alphamap_pars_fragment:Yd,alphatest_fragment:Kd,alphatest_pars_fragment:Jd,aomap_fragment:Zd,aomap_pars_fragment:Qd,batching_pars_vertex:$d,batching_vertex:ep,begin_vertex:tp,beginnormal_vertex:np,bsdfs:ip,iridescence_fragment:sp,bumpmap_pars_fragment:rp,clipping_planes_fragment:op,clipping_planes_pars_fragment:ap,clipping_planes_pars_vertex:lp,clipping_planes_vertex:cp,color_fragment:hp,color_pars_fragment:up,color_pars_vertex:fp,color_vertex:dp,common:pp,cube_uv_reflection_fragment:mp,defaultnormal_vertex:gp,displacementmap_pars_vertex:xp,displacementmap_vertex:vp,emissivemap_fragment:yp,emissivemap_pars_fragment:Mp,colorspace_fragment:_p,colorspace_pars_fragment:Ep,envmap_fragment:bp,envmap_common_pars_fragment:Sp,envmap_pars_fragment:Ap,envmap_pars_vertex:wp,envmap_physical_pars_fragment:Bp,envmap_vertex:Tp,fog_vertex:Rp,fog_pars_vertex:Cp,fog_fragment:Ip,fog_pars_fragment:Pp,gradientmap_pars_fragment:Lp,lightmap_pars_fragment:Dp,lights_lambert_fragment:Np,lights_lambert_pars_fragment:Up,lights_pars_begin:Op,lights_toon_fragment:kp,lights_toon_pars_fragment:Fp,lights_phong_fragment:zp,lights_phong_pars_fragment:Hp,lights_physical_fragment:Vp,lights_physical_pars_fragment:Gp,lights_fragment_begin:Wp,lights_fragment_maps:Xp,lights_fragment_end:qp,logdepthbuf_fragment:jp,logdepthbuf_pars_fragment:Yp,logdepthbuf_pars_vertex:Kp,logdepthbuf_vertex:Jp,map_fragment:Zp,map_pars_fragment:Qp,map_particle_fragment:$p,map_particle_pars_fragment:em,metalnessmap_fragment:tm,metalnessmap_pars_fragment:nm,morphinstance_vertex:im,morphcolor_vertex:sm,morphnormal_vertex:rm,morphtarget_pars_vertex:om,morphtarget_vertex:am,normal_fragment_begin:lm,normal_fragment_maps:cm,normal_pars_fragment:hm,normal_pars_vertex:um,normal_vertex:fm,normalmap_pars_fragment:dm,clearcoat_normal_fragment_begin:pm,clearcoat_normal_fragment_maps:mm,clearcoat_pars_fragment:gm,iridescence_pars_fragment:xm,opaque_fragment:vm,packing:ym,premultiplied_alpha_fragment:Mm,project_vertex:_m,dithering_fragment:Em,dithering_pars_fragment:bm,roughnessmap_fragment:Sm,roughnessmap_pars_fragment:Am,shadowmap_pars_fragment:wm,shadowmap_pars_vertex:Tm,shadowmap_vertex:Rm,shadowmask_pars_fragment:Cm,skinbase_vertex:Im,skinning_pars_vertex:Pm,skinning_vertex:Lm,skinnormal_vertex:Dm,specularmap_fragment:Nm,specularmap_pars_fragment:Um,tonemapping_fragment:Om,tonemapping_pars_fragment:Bm,transmission_fragment:km,transmission_pars_fragment:Fm,uv_pars_fragment:zm,uv_pars_vertex:Hm,uv_vertex:Vm,worldpos_vertex:Gm,background_vert:Wm,background_frag:Xm,backgroundCube_vert:qm,backgroundCube_frag:jm,cube_vert:Ym,cube_frag:Km,depth_vert:Jm,depth_frag:Zm,distanceRGBA_vert:Qm,distanceRGBA_frag:$m,equirect_vert:eg,equirect_frag:tg,linedashed_vert:ng,linedashed_frag:ig,meshbasic_vert:sg,meshbasic_frag:rg,meshlambert_vert:og,meshlambert_frag:ag,meshmatcap_vert:lg,meshmatcap_frag:cg,meshnormal_vert:hg,meshnormal_frag:ug,meshphong_vert:fg,meshphong_frag:dg,meshphysical_vert:pg,meshphysical_frag:mg,meshtoon_vert:gg,meshtoon_frag:xg,points_vert:vg,points_frag:yg,shadow_vert:Mg,shadow_frag:_g,sprite_vert:Eg,sprite_frag:bg},ue={common:{diffuse:{value:new he(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ze}},envmap:{envMap:{value:null},envMapRotation:{value:new ze},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ze},normalScale:{value:new Ce(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new he(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new he(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0},uvTransform:{value:new ze}},sprite:{diffuse:{value:new he(16777215)},opacity:{value:1},center:{value:new Ce(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}}},Cn={basic:{uniforms:Vt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.fog]),vertexShader:Ve.meshbasic_vert,fragmentShader:Ve.meshbasic_frag},lambert:{uniforms:Vt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new he(0)}}]),vertexShader:Ve.meshlambert_vert,fragmentShader:Ve.meshlambert_frag},phong:{uniforms:Vt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new he(0)},specular:{value:new he(1118481)},shininess:{value:30}}]),vertexShader:Ve.meshphong_vert,fragmentShader:Ve.meshphong_frag},standard:{uniforms:Vt([ue.common,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.roughnessmap,ue.metalnessmap,ue.fog,ue.lights,{emissive:{value:new he(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag},toon:{uniforms:Vt([ue.common,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.gradientmap,ue.fog,ue.lights,{emissive:{value:new he(0)}}]),vertexShader:Ve.meshtoon_vert,fragmentShader:Ve.meshtoon_frag},matcap:{uniforms:Vt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,{matcap:{value:null}}]),vertexShader:Ve.meshmatcap_vert,fragmentShader:Ve.meshmatcap_frag},points:{uniforms:Vt([ue.points,ue.fog]),vertexShader:Ve.points_vert,fragmentShader:Ve.points_frag},dashed:{uniforms:Vt([ue.common,ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ve.linedashed_vert,fragmentShader:Ve.linedashed_frag},depth:{uniforms:Vt([ue.common,ue.displacementmap]),vertexShader:Ve.depth_vert,fragmentShader:Ve.depth_frag},normal:{uniforms:Vt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,{opacity:{value:1}}]),vertexShader:Ve.meshnormal_vert,fragmentShader:Ve.meshnormal_frag},sprite:{uniforms:Vt([ue.sprite,ue.fog]),vertexShader:Ve.sprite_vert,fragmentShader:Ve.sprite_frag},background:{uniforms:{uvTransform:{value:new ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ve.background_vert,fragmentShader:Ve.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ze}},vertexShader:Ve.backgroundCube_vert,fragmentShader:Ve.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ve.cube_vert,fragmentShader:Ve.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ve.equirect_vert,fragmentShader:Ve.equirect_frag},distanceRGBA:{uniforms:Vt([ue.common,ue.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ve.distanceRGBA_vert,fragmentShader:Ve.distanceRGBA_frag},shadow:{uniforms:Vt([ue.lights,ue.fog,{color:{value:new he(0)},opacity:{value:1}}]),vertexShader:Ve.shadow_vert,fragmentShader:Ve.shadow_frag}};Cn.physical={uniforms:Vt([Cn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ze},clearcoatNormalScale:{value:new Ce(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ze},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ze},sheen:{value:0},sheenColor:{value:new he(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ze},transmissionSamplerSize:{value:new Ce},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ze},attenuationDistance:{value:0},attenuationColor:{value:new he(0)},specularColor:{value:new he(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ze},anisotropyVector:{value:new Ce},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ze}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag};var jr={r:0,b:0,g:0},Di=new on,Sg=new De;function Ag(s,e,t,n,i,r,o){let a=new he(0),l=r===!0?0:1,c,h,u=null,f=0,d=null;function g(A){let E=A.isScene===!0?A.background:null;return E&&E.isTexture&&(E=(A.backgroundBlurriness>0?t:e).get(E)),E}function x(A){let E=!1,v=g(A);v===null?p(a,l):v&&v.isColor&&(p(v,1),E=!0);let P=s.xr.getEnvironmentBlendMode();P==="additive"?n.buffers.color.setClear(0,0,0,1,o):P==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||E)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function m(A,E){let v=g(E);v&&(v.isCubeTexture||v.mapping===Uo)?(h===void 0&&(h=new Q(new Pe(1,1,1),new ct({name:"BackgroundCubeMaterial",uniforms:bs(Cn.backgroundCube.uniforms),vertexShader:Cn.backgroundCube.vertexShader,fragmentShader:Cn.backgroundCube.fragmentShader,side:kt,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(P,w,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),Di.copy(E.backgroundRotation),Di.x*=-1,Di.y*=-1,Di.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Di.y*=-1,Di.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Sg.makeRotationFromEuler(Di)),h.material.toneMapped=Ge.getTransfer(v.colorSpace)!==nt,(u!==v||f!==v.version||d!==s.toneMapping)&&(h.material.needsUpdate=!0,u=v,f=v.version,d=s.toneMapping),h.layers.enableAll(),A.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new Q(new $t(2,2),new ct({name:"BackgroundMaterial",uniforms:bs(Cn.background.uniforms),vertexShader:Cn.background.vertexShader,fragmentShader:Cn.background.fragmentShader,side:Ln,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.toneMapped=Ge.getTransfer(v.colorSpace)!==nt,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||f!==v.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,u=v,f=v.version,d=s.toneMapping),c.layers.enableAll(),A.unshift(c,c.geometry,c.material,0,0,null))}function p(A,E){A.getRGB(jr,Gu(s)),n.buffers.color.setClear(jr.r,jr.g,jr.b,E,o)}return{getClearColor:function(){return a},setClearColor:function(A,E=1){a.set(A),l=E,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(A){l=A,p(a,l)},render:x,addToRenderList:m}}function wg(s,e){let t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=f(null),r=i,o=!1;function a(y,M,C,L,U){let F=!1,W=u(L,C,M);r!==W&&(r=W,c(r.object)),F=d(y,L,C,U),F&&g(y,L,C,U),U!==null&&e.update(U,s.ELEMENT_ARRAY_BUFFER),(F||o)&&(o=!1,v(y,M,C,L),U!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(U).buffer))}function l(){return s.createVertexArray()}function c(y){return s.bindVertexArray(y)}function h(y){return s.deleteVertexArray(y)}function u(y,M,C){let L=C.wireframe===!0,U=n[y.id];U===void 0&&(U={},n[y.id]=U);let F=U[M.id];F===void 0&&(F={},U[M.id]=F);let W=F[L];return W===void 0&&(W=f(l()),F[L]=W),W}function f(y){let M=[],C=[],L=[];for(let U=0;U<t;U++)M[U]=0,C[U]=0,L[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:M,enabledAttributes:C,attributeDivisors:L,object:y,attributes:{},index:null}}function d(y,M,C,L){let U=r.attributes,F=M.attributes,W=0,J=C.getAttributes();for(let I in J)if(J[I].location>=0){let se=U[I],le=F[I];if(le===void 0&&(I==="instanceMatrix"&&y.instanceMatrix&&(le=y.instanceMatrix),I==="instanceColor"&&y.instanceColor&&(le=y.instanceColor)),se===void 0||se.attribute!==le||le&&se.data!==le.data)return!0;W++}return r.attributesNum!==W||r.index!==L}function g(y,M,C,L){let U={},F=M.attributes,W=0,J=C.getAttributes();for(let I in J)if(J[I].location>=0){let se=F[I];se===void 0&&(I==="instanceMatrix"&&y.instanceMatrix&&(se=y.instanceMatrix),I==="instanceColor"&&y.instanceColor&&(se=y.instanceColor));let le={};le.attribute=se,se&&se.data&&(le.data=se.data),U[I]=le,W++}r.attributes=U,r.attributesNum=W,r.index=L}function x(){let y=r.newAttributes;for(let M=0,C=y.length;M<C;M++)y[M]=0}function m(y){p(y,0)}function p(y,M){let C=r.newAttributes,L=r.enabledAttributes,U=r.attributeDivisors;C[y]=1,L[y]===0&&(s.enableVertexAttribArray(y),L[y]=1),U[y]!==M&&(s.vertexAttribDivisor(y,M),U[y]=M)}function A(){let y=r.newAttributes,M=r.enabledAttributes;for(let C=0,L=M.length;C<L;C++)M[C]!==y[C]&&(s.disableVertexAttribArray(C),M[C]=0)}function E(y,M,C,L,U,F,W){W===!0?s.vertexAttribIPointer(y,M,C,U,F):s.vertexAttribPointer(y,M,C,L,U,F)}function v(y,M,C,L){x();let U=L.attributes,F=C.getAttributes(),W=M.defaultAttributeValues;for(let J in F){let I=F[J];if(I.location>=0){let Y=U[J];if(Y===void 0&&(J==="instanceMatrix"&&y.instanceMatrix&&(Y=y.instanceMatrix),J==="instanceColor"&&y.instanceColor&&(Y=y.instanceColor)),Y!==void 0){let se=Y.normalized,le=Y.itemSize,V=e.get(Y);if(V===void 0)continue;let Z=V.buffer,O=V.type,G=V.bytesPerElement,ee=O===s.INT||O===s.UNSIGNED_INT||Y.gpuType===ic;if(Y.isInterleavedBufferAttribute){let ie=Y.data,ce=ie.stride,xe=Y.offset;if(ie.isInstancedInterleavedBuffer){for(let _e=0;_e<I.locationSize;_e++)p(I.location+_e,ie.meshPerAttribute);y.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let _e=0;_e<I.locationSize;_e++)m(I.location+_e);s.bindBuffer(s.ARRAY_BUFFER,Z);for(let _e=0;_e<I.locationSize;_e++)E(I.location+_e,le/I.locationSize,O,se,ce*G,(xe+le/I.locationSize*_e)*G,ee)}else{if(Y.isInstancedBufferAttribute){for(let ie=0;ie<I.locationSize;ie++)p(I.location+ie,Y.meshPerAttribute);y.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let ie=0;ie<I.locationSize;ie++)m(I.location+ie);s.bindBuffer(s.ARRAY_BUFFER,Z);for(let ie=0;ie<I.locationSize;ie++)E(I.location+ie,le/I.locationSize,O,se,le*G,le/I.locationSize*ie*G,ee)}}else if(W!==void 0){let se=W[J];if(se!==void 0)switch(se.length){case 2:s.vertexAttrib2fv(I.location,se);break;case 3:s.vertexAttrib3fv(I.location,se);break;case 4:s.vertexAttrib4fv(I.location,se);break;default:s.vertexAttrib1fv(I.location,se)}}}}A()}function P(){D();for(let y in n){let M=n[y];for(let C in M){let L=M[C];for(let U in L)h(L[U].object),delete L[U];delete M[C]}delete n[y]}}function w(y){if(n[y.id]===void 0)return;let M=n[y.id];for(let C in M){let L=M[C];for(let U in L)h(L[U].object),delete L[U];delete M[C]}delete n[y.id]}function R(y){for(let M in n){let C=n[M];if(C[y.id]===void 0)continue;let L=C[y.id];for(let U in L)h(L[U].object),delete L[U];delete C[y.id]}}function D(){b(),o=!0,r!==i&&(r=i,c(r.object))}function b(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:D,resetDefaultState:b,dispose:P,releaseStatesOfGeometry:w,releaseStatesOfProgram:R,initAttributes:x,enableAttribute:m,disableUnusedAttributes:A}}function Tg(s,e,t){let n;function i(c){n=c}function r(c,h){s.drawArrays(n,c,h),t.update(h,n,1)}function o(c,h,u){u!==0&&(s.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function a(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let d=0;for(let g=0;g<u;g++)d+=h[g];t.update(d,n,1)}function l(c,h,u,f){if(u===0)return;let d=e.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<c.length;g++)o(c[g],h[g],f[g]);else{d.multiDrawArraysInstancedWEBGL(n,c,0,h,0,f,0,u);let g=0;for(let x=0;x<u;x++)g+=h[x]*f[x];t.update(g,n,1)}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Rg(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){let R=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(R){return!(R!==rn&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){let D=R===An&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Yn&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==Mn&&!D)}function l(R){if(R==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),A=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),E=s.getParameter(s.MAX_VARYING_VECTORS),v=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),P=g>0,w=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:f,maxTextures:d,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:A,maxVaryings:E,maxFragmentUniforms:v,vertexTextures:P,maxSamples:w}}function Cg(s){let e=this,t=null,n=0,i=!1,r=!1,o=new Wn,a=new ze,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){let d=u.length!==0||f||n!==0||i;return i=f,n=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,d){let g=u.clippingPlanes,x=u.clipIntersection,m=u.clipShadows,p=s.get(u);if(!i||g===null||g.length===0||r&&!m)r?h(null):c();else{let A=r?0:n,E=A*4,v=p.clippingState||null;l.value=v,v=h(g,f,E,d);for(let P=0;P!==E;++P)v[P]=t[P];p.clippingState=v,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=A}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,d,g){let x=u!==null?u.length:0,m=null;if(x!==0){if(m=l.value,g!==!0||m===null){let p=d+x*4,A=f.matrixWorldInverse;a.getNormalMatrix(A),(m===null||m.length<p)&&(m=new Float32Array(p));for(let E=0,v=d;E!==x;++E,v+=4)o.copy(u[E]).applyMatrix4(A,a),o.normal.toArray(m,v),m[v+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}function Ig(s){let e=new WeakMap;function t(o,a){return a===ja?o.mapping=ms:a===Ya&&(o.mapping=gs),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===ja||a===Ya)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new wl(l.height);return c.fromEquirectangularTexture(s,o),e.set(o,c),o.addEventListener("dispose",i),t(c.texture,o.mapping)}else return null}}return o}function i(o){let a=o.target;a.removeEventListener("dispose",i);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var mi=class extends go{constructor(e=-1,t=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-e,o=n+e,a=i+t,l=i-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},cs=4,Oh=[.125,.215,.35,.446,.526,.582],ki=20,Ta=new mi,Bh=new he,Ra=null,Ca=0,Ia=0,Pa=!1,Ui=(1+Math.sqrt(5))/2,ss=1/Ui,kh=[new N(-Ui,ss,0),new N(Ui,ss,0),new N(-ss,0,Ui),new N(ss,0,Ui),new N(0,Ui,-ss),new N(0,Ui,ss),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)],Ss=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){Ra=this._renderer.getRenderTarget(),Ca=this._renderer.getActiveCubeFace(),Ia=this._renderer.getActiveMipmapLevel(),Pa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Hh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=zh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ra,Ca,Ia),this._renderer.xr.enabled=Pa,e.scissorTest=!1,Yr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ms||e.mapping===gs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ra=this._renderer.getRenderTarget(),Ca=this._renderer.getActiveCubeFace(),Ia=this._renderer.getActiveMipmapLevel(),Pa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Xt,minFilter:Xt,generateMipmaps:!1,type:An,format:rn,colorSpace:Ft,depthBuffer:!1},i=Fh(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Fh(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Pg(r)),this._blurMaterial=Lg(r,e,t)}return i}_compileMaterial(e){let t=new Q(this._lodPlanes[0],e);this._renderer.compile(t,Ta)}_sceneToCubeUV(e,t,n,i){let a=new wt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(Bh),h.toneMapping=pi,h.autoClear=!1;let d=new We({name:"PMREM.Background",side:kt,depthWrite:!1,depthTest:!1}),g=new Q(new Pe,d),x=!1,m=e.background;m?m.isColor&&(d.color.copy(m),e.background=null,x=!0):(d.color.copy(Bh),x=!0);for(let p=0;p<6;p++){let A=p%3;A===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):A===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));let E=this._cubeSize;Yr(i,A*E,p>2?E:0,E,E),h.setRenderTarget(i),x&&h.render(g,a),h.render(e,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=u,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,i=e.mapping===ms||e.mapping===gs;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Hh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=zh());let r=i?this._cubemapMaterial:this._equirectMaterial,o=new Q(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;Yr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,Ta)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let i=this._lodPlanes.length;for(let r=1;r<i;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=kh[(i-r-1)%kh.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,i,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",r),this._halfBlur(o,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new Q(this._lodPlanes[i],c),f=c.uniforms,d=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*ki-1),x=r/g,m=isFinite(r)?1+Math.floor(h*x):ki;m>ki&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ki}`);let p=[],A=0;for(let R=0;R<ki;++R){let D=R/x,b=Math.exp(-D*D/2);p.push(b),R===0?A+=b:R<m&&(A+=2*b)}for(let R=0;R<p.length;R++)p[R]=p[R]/A;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:E}=this;f.dTheta.value=g,f.mipInt.value=E-n;let v=this._sizeLods[i],P=3*v*(i>E-cs?i-E+cs:0),w=4*(this._cubeSize-v);Yr(t,P,w,3*v,2*v),l.setRenderTarget(t),l.render(u,Ta)}};function Pg(s){let e=[],t=[],n=[],i=s,r=s-cs+1+Oh.length;for(let o=0;o<r;o++){let a=Math.pow(2,i);t.push(a);let l=1/a;o>s-cs?l=Oh[o-s+cs-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,g=6,x=3,m=2,p=1,A=new Float32Array(x*g*d),E=new Float32Array(m*g*d),v=new Float32Array(p*g*d);for(let w=0;w<d;w++){let R=w%3*2/3-1,D=w>2?0:-1,b=[R,D,0,R+2/3,D,0,R+2/3,D+1,0,R,D,0,R+2/3,D+1,0,R,D+1,0];A.set(b,x*g*w),E.set(f,m*g*w);let y=[w,w,w,w,w,w];v.set(y,p*g*w)}let P=new Mt;P.setAttribute("position",new gt(A,x)),P.setAttribute("uv",new gt(E,m)),P.setAttribute("faceIndex",new gt(v,p)),e.push(P),i>cs&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Fh(s,e,t){let n=new Gt(s,e,t);return n.texture.mapping=Uo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Yr(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function Lg(s,e,t){let n=new Float32Array(ki),i=new N(0,1,0);return new ct({name:"SphericalGaussianBlur",defines:{n:ki,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:uc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function zh(){return new ct({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:uc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function Hh(){return new ct({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:uc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function uc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Dg(s){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===ja||l===Ya,h=l===ms||l===gs;if(c||h){let u=e.get(a),f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new Ss(s)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let d=a.image;return c&&d&&d.height>0||h&&d&&i(d)?(t===null&&(t=new Ss(s)),u=c?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function i(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function Ng(s){let e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let i=t(n);return i===null&&Zs("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Ug(s,e,t,n){let i={},r=new WeakMap;function o(u){let f=u.target;f.index!==null&&e.remove(f.index);for(let g in f.attributes)e.remove(f.attributes[g]);for(let g in f.morphAttributes){let x=f.morphAttributes[g];for(let m=0,p=x.length;m<p;m++)e.remove(x[m])}f.removeEventListener("dispose",o),delete i[f.id];let d=r.get(f);d&&(e.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(u,f){return i[f.id]===!0||(f.addEventListener("dispose",o),i[f.id]=!0,t.memory.geometries++),f}function l(u){let f=u.attributes;for(let g in f)e.update(f[g],s.ARRAY_BUFFER);let d=u.morphAttributes;for(let g in d){let x=d[g];for(let m=0,p=x.length;m<p;m++)e.update(x[m],s.ARRAY_BUFFER)}}function c(u){let f=[],d=u.index,g=u.attributes.position,x=0;if(d!==null){let A=d.array;x=d.version;for(let E=0,v=A.length;E<v;E+=3){let P=A[E+0],w=A[E+1],R=A[E+2];f.push(P,w,w,R,R,P)}}else if(g!==void 0){let A=g.array;x=g.version;for(let E=0,v=A.length/3-1;E<v;E+=3){let P=E+0,w=E+1,R=E+2;f.push(P,w,w,R,R,P)}}else return;let m=new(Hu(f)?mo:po)(f,1);m.version=x;let p=r.get(u);p&&e.remove(p),r.set(u,m)}function h(u){let f=r.get(u);if(f){let d=u.index;d!==null&&f.version<d.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function Og(s,e,t){let n;function i(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,d){s.drawElements(n,d,r,f*o),t.update(d,n,1)}function c(f,d,g){g!==0&&(s.drawElementsInstanced(n,d,r,f*o,g),t.update(d,n,g))}function h(f,d,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,f,0,g);let m=0;for(let p=0;p<g;p++)m+=d[p];t.update(m,n,1)}function u(f,d,g,x){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)c(f[p]/o,d[p],x[p]);else{m.multiDrawElementsInstancedWEBGL(n,d,0,r,f,0,x,0,g);let p=0;for(let A=0;A<g;A++)p+=d[A]*x[A];t.update(p,n,1)}}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Bg(s){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case s.TRIANGLES:t.triangles+=a*(r/3);break;case s.LINES:t.lines+=a*(r/2);break;case s.LINE_STRIP:t.lines+=a*(r-1);break;case s.LINE_LOOP:t.lines+=a*r;break;case s.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function kg(s,e,t){let n=new WeakMap,i=new $e;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,f=n.get(a);if(f===void 0||f.count!==u){let b=function(){R.dispose(),n.delete(a),a.removeEventListener("dispose",b)};f!==void 0&&f.texture.dispose();let d=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],A=a.morphAttributes.color||[],E=0;d===!0&&(E=1),g===!0&&(E=2),x===!0&&(E=3);let v=a.attributes.position.count*E,P=1;v>e.maxTextureSize&&(P=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let w=new Float32Array(v*P*4*u),R=new uo(w,v,P,u);R.type=Mn,R.needsUpdate=!0;let D=E*4;for(let y=0;y<u;y++){let M=m[y],C=p[y],L=A[y],U=v*P*4*y;for(let F=0;F<M.count;F++){let W=F*D;d===!0&&(i.fromBufferAttribute(M,F),w[U+W+0]=i.x,w[U+W+1]=i.y,w[U+W+2]=i.z,w[U+W+3]=0),g===!0&&(i.fromBufferAttribute(C,F),w[U+W+4]=i.x,w[U+W+5]=i.y,w[U+W+6]=i.z,w[U+W+7]=0),x===!0&&(i.fromBufferAttribute(L,F),w[U+W+8]=i.x,w[U+W+9]=i.y,w[U+W+10]=i.z,w[U+W+11]=L.itemSize===4?i.w:1)}}f={count:u,texture:R,size:new Ce(v,P)},n.set(a,f),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",o.morphTexture,t);else{let d=0;for(let x=0;x<c.length;x++)d+=c[x];let g=a.morphTargetsRelative?1:1-d;l.getUniforms().setValue(s,"morphTargetBaseInfluence",g),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",f.size)}return{update:r}}function Fg(s,e,t,n){let i=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=e.get(l,h);if(i.get(u)!==c&&(e.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){let f=l.skeleton;i.get(f)!==c&&(f.update(),i.set(f,c))}return u}function o(){i=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}var vo=class extends Lt{constructor(e,t,n,i,r,o,a,l,c,h=us){if(h!==us&&h!==vs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===us&&(n=zi),n===void 0&&h===vs&&(n=xs),super(null,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Pt,this.minFilter=l!==void 0?l:Pt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Xu=new Lt,Vh=new vo(1,1),qu=new uo,ju=new Sl,Yu=new xo,Gh=[],Wh=[],Xh=new Float32Array(16),qh=new Float32Array(9),jh=new Float32Array(4);function Ps(s,e,t){let n=s[0];if(n<=0||n>0)return s;let i=e*t,r=Gh[i];if(r===void 0&&(r=new Float32Array(i),Gh[i]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,s[o].toArray(r,a)}return r}function Rt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function Ct(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function ko(s,e){let t=Wh[e];t===void 0&&(t=new Int32Array(e),Wh[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function zg(s,e){let t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function Hg(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;s.uniform2fv(this.addr,e),Ct(t,e)}}function Vg(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Rt(t,e))return;s.uniform3fv(this.addr,e),Ct(t,e)}}function Gg(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;s.uniform4fv(this.addr,e),Ct(t,e)}}function Wg(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(Rt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Ct(t,e)}else{if(Rt(t,n))return;jh.set(n),s.uniformMatrix2fv(this.addr,!1,jh),Ct(t,n)}}function Xg(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(Rt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Ct(t,e)}else{if(Rt(t,n))return;qh.set(n),s.uniformMatrix3fv(this.addr,!1,qh),Ct(t,n)}}function qg(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(Rt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Ct(t,e)}else{if(Rt(t,n))return;Xh.set(n),s.uniformMatrix4fv(this.addr,!1,Xh),Ct(t,n)}}function jg(s,e){let t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function Yg(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;s.uniform2iv(this.addr,e),Ct(t,e)}}function Kg(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Rt(t,e))return;s.uniform3iv(this.addr,e),Ct(t,e)}}function Jg(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;s.uniform4iv(this.addr,e),Ct(t,e)}}function Zg(s,e){let t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function Qg(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;s.uniform2uiv(this.addr,e),Ct(t,e)}}function $g(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Rt(t,e))return;s.uniform3uiv(this.addr,e),Ct(t,e)}}function e0(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;s.uniform4uiv(this.addr,e),Ct(t,e)}}function t0(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(Vh.compareFunction=Fu,r=Vh):r=Xu,t.setTexture2D(e||r,i)}function n0(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||ju,i)}function i0(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Yu,i)}function s0(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||qu,i)}function r0(s){switch(s){case 5126:return zg;case 35664:return Hg;case 35665:return Vg;case 35666:return Gg;case 35674:return Wg;case 35675:return Xg;case 35676:return qg;case 5124:case 35670:return jg;case 35667:case 35671:return Yg;case 35668:case 35672:return Kg;case 35669:case 35673:return Jg;case 5125:return Zg;case 36294:return Qg;case 36295:return $g;case 36296:return e0;case 35678:case 36198:case 36298:case 36306:case 35682:return t0;case 35679:case 36299:case 36307:return n0;case 35680:case 36300:case 36308:case 36293:return i0;case 36289:case 36303:case 36311:case 36292:return s0}}function o0(s,e){s.uniform1fv(this.addr,e)}function a0(s,e){let t=Ps(e,this.size,2);s.uniform2fv(this.addr,t)}function l0(s,e){let t=Ps(e,this.size,3);s.uniform3fv(this.addr,t)}function c0(s,e){let t=Ps(e,this.size,4);s.uniform4fv(this.addr,t)}function h0(s,e){let t=Ps(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function u0(s,e){let t=Ps(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function f0(s,e){let t=Ps(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function d0(s,e){s.uniform1iv(this.addr,e)}function p0(s,e){s.uniform2iv(this.addr,e)}function m0(s,e){s.uniform3iv(this.addr,e)}function g0(s,e){s.uniform4iv(this.addr,e)}function x0(s,e){s.uniform1uiv(this.addr,e)}function v0(s,e){s.uniform2uiv(this.addr,e)}function y0(s,e){s.uniform3uiv(this.addr,e)}function M0(s,e){s.uniform4uiv(this.addr,e)}function _0(s,e,t){let n=this.cache,i=e.length,r=ko(t,i);Rt(n,r)||(s.uniform1iv(this.addr,r),Ct(n,r));for(let o=0;o!==i;++o)t.setTexture2D(e[o]||Xu,r[o])}function E0(s,e,t){let n=this.cache,i=e.length,r=ko(t,i);Rt(n,r)||(s.uniform1iv(this.addr,r),Ct(n,r));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||ju,r[o])}function b0(s,e,t){let n=this.cache,i=e.length,r=ko(t,i);Rt(n,r)||(s.uniform1iv(this.addr,r),Ct(n,r));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||Yu,r[o])}function S0(s,e,t){let n=this.cache,i=e.length,r=ko(t,i);Rt(n,r)||(s.uniform1iv(this.addr,r),Ct(n,r));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||qu,r[o])}function A0(s){switch(s){case 5126:return o0;case 35664:return a0;case 35665:return l0;case 35666:return c0;case 35674:return h0;case 35675:return u0;case 35676:return f0;case 5124:case 35670:return d0;case 35667:case 35671:return p0;case 35668:case 35672:return m0;case 35669:case 35673:return g0;case 5125:return x0;case 36294:return v0;case 36295:return y0;case 36296:return M0;case 35678:case 36198:case 36298:case 36306:case 35682:return _0;case 35679:case 36299:case 36307:return E0;case 35680:case 36300:case 36308:case 36293:return b0;case 36289:case 36303:case 36311:case 36292:return S0}}var Tl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=r0(t.type)}},Rl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=A0(t.type)}},Cl=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let i=this.seq;for(let r=0,o=i.length;r!==o;++r){let a=i[r];a.setValue(e,t[a.id],n)}}},La=/(\w+)(\])?(\[|\.)?/g;function Yh(s,e){s.seq.push(e),s.map[e.id]=e}function w0(s,e,t){let n=s.name,i=n.length;for(La.lastIndex=0;;){let r=La.exec(n),o=La.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Yh(t,c===void 0?new Tl(a,s,e):new Rl(a,s,e));break}else{let u=t.map[a];u===void 0&&(u=new Cl(a),Yh(t,u)),t=u}}}var ds=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){let r=e.getActiveUniform(t,i),o=e.getUniformLocation(t,r.name);w0(r,o,this)}}setValue(e,t,n,i){let r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){let i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,i)}}static seqWithValue(e,t){let n=[];for(let i=0,r=e.length;i!==r;++i){let o=e[i];o.id in t&&n.push(o)}return n}};function Kh(s,e,t){let n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}var T0=37297,R0=0;function C0(s,e){let t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=i;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var Jh=new ze;function I0(s){Ge._getMatrix(Jh,Ge.workingColorSpace,s);let e=`mat3( ${Jh.elements.map(t=>t.toFixed(4))} )`;switch(Ge.getTransfer(s)){case Bo:return[e,"LinearTransferOETF"];case nt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Zh(s,e,t){let n=s.getShaderParameter(e,s.COMPILE_STATUS),i=s.getShaderInfoLog(e).trim();if(n&&i==="")return"";let r=/ERROR: 0:(\d+)/.exec(i);if(r){let o=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+C0(s.getShaderSource(e),o)}else return i}function P0(s,e){let t=I0(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function L0(s,e){let t;switch(e){case Zl:t="Linear";break;case Ql:t="Reinhard";break;case $l:t="Cineon";break;case mr:t="ACESFilmic";break;case ec:t="AgX";break;case tc:t="Neutral";break;case Xf:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Kr=new N;function D0(){Ge.getLuminanceCoefficients(Kr);let s=Kr.x.toFixed(4),e=Kr.y.toFixed(4),t=Kr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function N0(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Qs).join(`
`)}function U0(s){let e=[];for(let t in s){let n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function O0(s,e){let t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(e,i),o=r.name,a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:s.getAttribLocation(e,o),locationSize:a}}return t}function Qs(s){return s!==""}function Qh(s,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function $h(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var B0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Il(s){return s.replace(B0,F0)}var k0=new Map;function F0(s,e){let t=Ve[e];if(t===void 0){let n=k0.get(e);if(n!==void 0)t=Ve[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Il(t)}var z0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function eu(s){return s.replace(z0,H0)}function H0(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function tu(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function V0(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Au?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===Sf?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Gn&&(e="SHADOWMAP_TYPE_VSM"),e}function G0(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case ms:case gs:e="ENVMAP_TYPE_CUBE";break;case Uo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function W0(s){let e="ENVMAP_MODE_REFLECTION";return s.envMap&&s.envMapMode===gs&&(e="ENVMAP_MODE_REFRACTION"),e}function X0(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case wu:e="ENVMAP_BLENDING_MULTIPLY";break;case Gf:e="ENVMAP_BLENDING_MIX";break;case Wf:e="ENVMAP_BLENDING_ADD";break}return e}function q0(s){let e=s.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function j0(s,e,t,n){let i=s.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=V0(t),c=G0(t),h=W0(t),u=X0(t),f=q0(t),d=N0(t),g=U0(r),x=i.createProgram(),m,p,A=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Qs).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Qs).join(`
`),p.length>0&&(p+=`
`)):(m=[tu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Qs).join(`
`),p=[tu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==pi?"#define TONE_MAPPING":"",t.toneMapping!==pi?Ve.tonemapping_pars_fragment:"",t.toneMapping!==pi?L0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ve.colorspace_pars_fragment,P0("linearToOutputTexel",t.outputColorSpace),D0(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Qs).join(`
`)),o=Il(o),o=Qh(o,t),o=$h(o,t),a=Il(a),a=Qh(a,t),a=$h(a,t),o=eu(o),a=eu(a),t.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===ph?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ph?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let E=A+m+o,v=A+p+a,P=Kh(i,i.VERTEX_SHADER,E),w=Kh(i,i.FRAGMENT_SHADER,v);i.attachShader(x,P),i.attachShader(x,w),t.index0AttributeName!==void 0?i.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(x,0,"position"),i.linkProgram(x);function R(M){if(s.debug.checkShaderErrors){let C=i.getProgramInfoLog(x).trim(),L=i.getShaderInfoLog(P).trim(),U=i.getShaderInfoLog(w).trim(),F=!0,W=!0;if(i.getProgramParameter(x,i.LINK_STATUS)===!1)if(F=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,x,P,w);else{let J=Zh(i,P,"vertex"),I=Zh(i,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(x,i.VALIDATE_STATUS)+`

Material Name: `+M.name+`
Material Type: `+M.type+`

Program Info Log: `+C+`
`+J+`
`+I)}else C!==""?console.warn("THREE.WebGLProgram: Program Info Log:",C):(L===""||U==="")&&(W=!1);W&&(M.diagnostics={runnable:F,programLog:C,vertexShader:{log:L,prefix:m},fragmentShader:{log:U,prefix:p}})}i.deleteShader(P),i.deleteShader(w),D=new ds(i,x),b=O0(i,x)}let D;this.getUniforms=function(){return D===void 0&&R(this),D};let b;this.getAttributes=function(){return b===void 0&&R(this),b};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=i.getProgramParameter(x,T0)),y},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=R0++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=P,this.fragmentShader=w,this}var Y0=0,Pl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Ll(e),t.set(e,n)),n}},Ll=class{constructor(e){this.id=Y0++,this.code=e,this.usedTimes=0}};function K0(s,e,t,n,i,r,o){let a=new fo,l=new Pl,c=new Set,h=[],u=i.logarithmicDepthBuffer,f=i.vertexTextures,d=i.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(b){return c.add(b),b===0?"uv":`uv${b}`}function m(b,y,M,C,L){let U=C.fog,F=L.geometry,W=b.isMeshStandardMaterial?C.environment:null,J=(b.isMeshStandardMaterial?t:e).get(b.envMap||W),I=J&&J.mapping===Uo?J.image.height:null,Y=g[b.type];b.precision!==null&&(d=i.getMaxPrecision(b.precision),d!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",d,"instead."));let se=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,le=se!==void 0?se.length:0,V=0;F.morphAttributes.position!==void 0&&(V=1),F.morphAttributes.normal!==void 0&&(V=2),F.morphAttributes.color!==void 0&&(V=3);let Z,O,G,ee;if(Y){let st=Cn[Y];Z=st.vertexShader,O=st.fragmentShader}else Z=b.vertexShader,O=b.fragmentShader,l.update(b),G=l.getVertexShaderID(b),ee=l.getFragmentShaderID(b);let ie=s.getRenderTarget(),ce=s.state.buffers.depth.getReversed(),xe=L.isInstancedMesh===!0,_e=L.isBatchedMesh===!0,Xe=!!b.map,Ne=!!b.matcap,je=!!J,B=!!b.aoMap,Ze=!!b.lightMap,Ue=!!b.bumpMap,Be=!!b.normalMap,Ee=!!b.displacementMap,at=!!b.emissiveMap,Re=!!b.metalnessMap,T=!!b.roughnessMap,_=b.anisotropy>0,X=b.clearcoat>0,te=b.dispersion>0,re=b.iridescence>0,$=b.sheen>0,we=b.transmission>0,de=_&&!!b.anisotropyMap,ve=X&&!!b.clearcoatMap,Je=X&&!!b.clearcoatNormalMap,oe=X&&!!b.clearcoatRoughnessMap,ye=re&&!!b.iridescenceMap,Ie=re&&!!b.iridescenceThicknessMap,Le=$&&!!b.sheenColorMap,Me=$&&!!b.sheenRoughnessMap,Ye=!!b.specularMap,He=!!b.specularColorMap,ut=!!b.specularIntensityMap,k=we&&!!b.transmissionMap,fe=we&&!!b.thicknessMap,K=!!b.gradientMap,ne=!!b.alphaMap,ge=b.alphaTest>0,pe=!!b.alphaHash,ke=!!b.extensions,yt=pi;b.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(yt=s.toneMapping);let Dt={shaderID:Y,shaderType:b.type,shaderName:b.name,vertexShader:Z,fragmentShader:O,defines:b.defines,customVertexShaderID:G,customFragmentShaderID:ee,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:d,batching:_e,batchingColor:_e&&L._colorsTexture!==null,instancing:xe,instancingColor:xe&&L.instanceColor!==null,instancingMorph:xe&&L.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ie===null?s.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:Ft,alphaToCoverage:!!b.alphaToCoverage,map:Xe,matcap:Ne,envMap:je,envMapMode:je&&J.mapping,envMapCubeUVHeight:I,aoMap:B,lightMap:Ze,bumpMap:Ue,normalMap:Be,displacementMap:f&&Ee,emissiveMap:at,normalMapObjectSpace:Be&&b.normalMapType===$f,normalMapTangentSpace:Be&&b.normalMapType===ku,metalnessMap:Re,roughnessMap:T,anisotropy:_,anisotropyMap:de,clearcoat:X,clearcoatMap:ve,clearcoatNormalMap:Je,clearcoatRoughnessMap:oe,dispersion:te,iridescence:re,iridescenceMap:ye,iridescenceThicknessMap:Ie,sheen:$,sheenColorMap:Le,sheenRoughnessMap:Me,specularMap:Ye,specularColorMap:He,specularIntensityMap:ut,transmission:we,transmissionMap:k,thicknessMap:fe,gradientMap:K,opaque:b.transparent===!1&&b.blending===hs&&b.alphaToCoverage===!1,alphaMap:ne,alphaTest:ge,alphaHash:pe,combine:b.combine,mapUv:Xe&&x(b.map.channel),aoMapUv:B&&x(b.aoMap.channel),lightMapUv:Ze&&x(b.lightMap.channel),bumpMapUv:Ue&&x(b.bumpMap.channel),normalMapUv:Be&&x(b.normalMap.channel),displacementMapUv:Ee&&x(b.displacementMap.channel),emissiveMapUv:at&&x(b.emissiveMap.channel),metalnessMapUv:Re&&x(b.metalnessMap.channel),roughnessMapUv:T&&x(b.roughnessMap.channel),anisotropyMapUv:de&&x(b.anisotropyMap.channel),clearcoatMapUv:ve&&x(b.clearcoatMap.channel),clearcoatNormalMapUv:Je&&x(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:oe&&x(b.clearcoatRoughnessMap.channel),iridescenceMapUv:ye&&x(b.iridescenceMap.channel),iridescenceThicknessMapUv:Ie&&x(b.iridescenceThicknessMap.channel),sheenColorMapUv:Le&&x(b.sheenColorMap.channel),sheenRoughnessMapUv:Me&&x(b.sheenRoughnessMap.channel),specularMapUv:Ye&&x(b.specularMap.channel),specularColorMapUv:He&&x(b.specularColorMap.channel),specularIntensityMapUv:ut&&x(b.specularIntensityMap.channel),transmissionMapUv:k&&x(b.transmissionMap.channel),thicknessMapUv:fe&&x(b.thicknessMap.channel),alphaMapUv:ne&&x(b.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(Be||_),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!F.attributes.uv&&(Xe||ne),fog:!!U,useFog:b.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:ce,skinning:L.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:le,morphTextureStride:V,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:s.shadowMap.enabled&&M.length>0,shadowMapType:s.shadowMap.type,toneMapping:yt,decodeVideoTexture:Xe&&b.map.isVideoTexture===!0&&Ge.getTransfer(b.map.colorSpace)===nt,decodeVideoTextureEmissive:at&&b.emissiveMap.isVideoTexture===!0&&Ge.getTransfer(b.emissiveMap.colorSpace)===nt,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Bt,flipSided:b.side===kt,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:ke&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ke&&b.extensions.multiDraw===!0||_e)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Dt.vertexUv1s=c.has(1),Dt.vertexUv2s=c.has(2),Dt.vertexUv3s=c.has(3),c.clear(),Dt}function p(b){let y=[];if(b.shaderID?y.push(b.shaderID):(y.push(b.customVertexShaderID),y.push(b.customFragmentShaderID)),b.defines!==void 0)for(let M in b.defines)y.push(M),y.push(b.defines[M]);return b.isRawShaderMaterial===!1&&(A(y,b),E(y,b),y.push(s.outputColorSpace)),y.push(b.customProgramCacheKey),y.join()}function A(b,y){b.push(y.precision),b.push(y.outputColorSpace),b.push(y.envMapMode),b.push(y.envMapCubeUVHeight),b.push(y.mapUv),b.push(y.alphaMapUv),b.push(y.lightMapUv),b.push(y.aoMapUv),b.push(y.bumpMapUv),b.push(y.normalMapUv),b.push(y.displacementMapUv),b.push(y.emissiveMapUv),b.push(y.metalnessMapUv),b.push(y.roughnessMapUv),b.push(y.anisotropyMapUv),b.push(y.clearcoatMapUv),b.push(y.clearcoatNormalMapUv),b.push(y.clearcoatRoughnessMapUv),b.push(y.iridescenceMapUv),b.push(y.iridescenceThicknessMapUv),b.push(y.sheenColorMapUv),b.push(y.sheenRoughnessMapUv),b.push(y.specularMapUv),b.push(y.specularColorMapUv),b.push(y.specularIntensityMapUv),b.push(y.transmissionMapUv),b.push(y.thicknessMapUv),b.push(y.combine),b.push(y.fogExp2),b.push(y.sizeAttenuation),b.push(y.morphTargetsCount),b.push(y.morphAttributeCount),b.push(y.numDirLights),b.push(y.numPointLights),b.push(y.numSpotLights),b.push(y.numSpotLightMaps),b.push(y.numHemiLights),b.push(y.numRectAreaLights),b.push(y.numDirLightShadows),b.push(y.numPointLightShadows),b.push(y.numSpotLightShadows),b.push(y.numSpotLightShadowsWithMaps),b.push(y.numLightProbes),b.push(y.shadowMapType),b.push(y.toneMapping),b.push(y.numClippingPlanes),b.push(y.numClipIntersection),b.push(y.depthPacking)}function E(b,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),b.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reverseDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),b.push(a.mask)}function v(b){let y=g[b.type],M;if(y){let C=Cn[y];M=bi.clone(C.uniforms)}else M=b.uniforms;return M}function P(b,y){let M;for(let C=0,L=h.length;C<L;C++){let U=h[C];if(U.cacheKey===y){M=U,++M.usedTimes;break}}return M===void 0&&(M=new j0(s,y,b,r),h.push(M)),M}function w(b){if(--b.usedTimes===0){let y=h.indexOf(b);h[y]=h[h.length-1],h.pop(),b.destroy()}}function R(b){l.remove(b)}function D(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:v,acquireProgram:P,releaseProgram:w,releaseShaderCache:R,programs:h,dispose:D}}function J0(){let s=new WeakMap;function e(o){return s.has(o)}function t(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,l){s.get(o)[a]=l}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function Z0(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function nu(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function iu(){let s=[],e=0,t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function o(u,f,d,g,x,m){let p=s[e];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:x,group:m},s[e]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=x,p.group=m),e++,p}function a(u,f,d,g,x,m){let p=o(u,f,d,g,x,m);d.transmission>0?n.push(p):d.transparent===!0?i.push(p):t.push(p)}function l(u,f,d,g,x,m){let p=o(u,f,d,g,x,m);d.transmission>0?n.unshift(p):d.transparent===!0?i.unshift(p):t.unshift(p)}function c(u,f){t.length>1&&t.sort(u||Z0),n.length>1&&n.sort(f||nu),i.length>1&&i.sort(f||nu)}function h(){for(let u=e,f=s.length;u<f;u++){let d=s[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:a,unshift:l,finish:h,sort:c}}function Q0(){let s=new WeakMap;function e(n,i){let r=s.get(n),o;return r===void 0?(o=new iu,s.set(n,[o])):i>=r.length?(o=new iu,r.push(o)):o=r[i],o}function t(){s=new WeakMap}return{get:e,dispose:t}}function $0(){let s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new N,color:new he};break;case"SpotLight":t={position:new N,direction:new N,color:new he,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new N,color:new he,distance:0,decay:0};break;case"HemisphereLight":t={direction:new N,skyColor:new he,groundColor:new he};break;case"RectAreaLight":t={color:new he,position:new N,halfWidth:new N,halfHeight:new N};break}return s[e.id]=t,t}}}function ex(){let s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ce};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ce};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ce,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}var tx=0;function nx(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function ix(s){let e=new $0,t=ex(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new N);let i=new N,r=new De,o=new De;function a(c){let h=0,u=0,f=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let d=0,g=0,x=0,m=0,p=0,A=0,E=0,v=0,P=0,w=0,R=0;c.sort(nx);for(let b=0,y=c.length;b<y;b++){let M=c[b],C=M.color,L=M.intensity,U=M.distance,F=M.shadow&&M.shadow.map?M.shadow.map.texture:null;if(M.isAmbientLight)h+=C.r*L,u+=C.g*L,f+=C.b*L;else if(M.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(M.sh.coefficients[W],L);R++}else if(M.isDirectionalLight){let W=e.get(M);if(W.color.copy(M.color).multiplyScalar(M.intensity),M.castShadow){let J=M.shadow,I=t.get(M);I.shadowIntensity=J.intensity,I.shadowBias=J.bias,I.shadowNormalBias=J.normalBias,I.shadowRadius=J.radius,I.shadowMapSize=J.mapSize,n.directionalShadow[d]=I,n.directionalShadowMap[d]=F,n.directionalShadowMatrix[d]=M.shadow.matrix,A++}n.directional[d]=W,d++}else if(M.isSpotLight){let W=e.get(M);W.position.setFromMatrixPosition(M.matrixWorld),W.color.copy(C).multiplyScalar(L),W.distance=U,W.coneCos=Math.cos(M.angle),W.penumbraCos=Math.cos(M.angle*(1-M.penumbra)),W.decay=M.decay,n.spot[x]=W;let J=M.shadow;if(M.map&&(n.spotLightMap[P]=M.map,P++,J.updateMatrices(M),M.castShadow&&w++),n.spotLightMatrix[x]=J.matrix,M.castShadow){let I=t.get(M);I.shadowIntensity=J.intensity,I.shadowBias=J.bias,I.shadowNormalBias=J.normalBias,I.shadowRadius=J.radius,I.shadowMapSize=J.mapSize,n.spotShadow[x]=I,n.spotShadowMap[x]=F,v++}x++}else if(M.isRectAreaLight){let W=e.get(M);W.color.copy(C).multiplyScalar(L),W.halfWidth.set(M.width*.5,0,0),W.halfHeight.set(0,M.height*.5,0),n.rectArea[m]=W,m++}else if(M.isPointLight){let W=e.get(M);if(W.color.copy(M.color).multiplyScalar(M.intensity),W.distance=M.distance,W.decay=M.decay,M.castShadow){let J=M.shadow,I=t.get(M);I.shadowIntensity=J.intensity,I.shadowBias=J.bias,I.shadowNormalBias=J.normalBias,I.shadowRadius=J.radius,I.shadowMapSize=J.mapSize,I.shadowCameraNear=J.camera.near,I.shadowCameraFar=J.camera.far,n.pointShadow[g]=I,n.pointShadowMap[g]=F,n.pointShadowMatrix[g]=M.shadow.matrix,E++}n.point[g]=W,g++}else if(M.isHemisphereLight){let W=e.get(M);W.skyColor.copy(M.color).multiplyScalar(L),W.groundColor.copy(M.groundColor).multiplyScalar(L),n.hemi[p]=W,p++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ue.LTC_FLOAT_1,n.rectAreaLTC2=ue.LTC_FLOAT_2):(n.rectAreaLTC1=ue.LTC_HALF_1,n.rectAreaLTC2=ue.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;let D=n.hash;(D.directionalLength!==d||D.pointLength!==g||D.spotLength!==x||D.rectAreaLength!==m||D.hemiLength!==p||D.numDirectionalShadows!==A||D.numPointShadows!==E||D.numSpotShadows!==v||D.numSpotMaps!==P||D.numLightProbes!==R)&&(n.directional.length=d,n.spot.length=x,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=A,n.directionalShadowMap.length=A,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=A,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=v+P-w,n.spotLightMap.length=P,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=R,D.directionalLength=d,D.pointLength=g,D.spotLength=x,D.rectAreaLength=m,D.hemiLength=p,D.numDirectionalShadows=A,D.numPointShadows=E,D.numSpotShadows=v,D.numSpotMaps=P,D.numLightProbes=R,n.version=tx++)}function l(c,h){let u=0,f=0,d=0,g=0,x=0,m=h.matrixWorldInverse;for(let p=0,A=c.length;p<A;p++){let E=c[p];if(E.isDirectionalLight){let v=n.directional[u];v.direction.setFromMatrixPosition(E.matrixWorld),i.setFromMatrixPosition(E.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),u++}else if(E.isSpotLight){let v=n.spot[d];v.position.setFromMatrixPosition(E.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(E.matrixWorld),i.setFromMatrixPosition(E.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),d++}else if(E.isRectAreaLight){let v=n.rectArea[g];v.position.setFromMatrixPosition(E.matrixWorld),v.position.applyMatrix4(m),o.identity(),r.copy(E.matrixWorld),r.premultiply(m),o.extractRotation(r),v.halfWidth.set(E.width*.5,0,0),v.halfHeight.set(0,E.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),g++}else if(E.isPointLight){let v=n.point[f];v.position.setFromMatrixPosition(E.matrixWorld),v.position.applyMatrix4(m),f++}else if(E.isHemisphereLight){let v=n.hemi[x];v.direction.setFromMatrixPosition(E.matrixWorld),v.direction.transformDirection(m),x++}}}return{setup:a,setupView:l,state:n}}function su(s){let e=new ix(s),t=[],n=[];function i(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function sx(s){let e=new WeakMap;function t(i,r=0){let o=e.get(i),a;return o===void 0?(a=new su(s),e.set(i,[a])):r>=o.length?(a=new su(s),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var Dl=class extends Qt{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Zf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Nl=class extends Qt{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},rx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ox=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function ax(s,e,t){let n=new or,i=new Ce,r=new Ce,o=new $e,a=new Dl({depthPacking:Qf}),l=new Nl,c={},h=t.maxTextureSize,u={[Ln]:kt,[kt]:Ln,[Bt]:Bt},f=new ct({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ce},radius:{value:4}},vertexShader:rx,fragmentShader:ox}),d=f.clone();d.defines.HORIZONTAL_PASS=1;let g=new Mt;g.setAttribute("position",new gt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new Q(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Au;let p=this.type;this.render=function(w,R,D){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;let b=s.getRenderTarget(),y=s.getActiveCubeFace(),M=s.getActiveMipmapLevel(),C=s.state;C.setBlending(Pn),C.buffers.color.setClear(1,1,1,1),C.buffers.depth.setTest(!0),C.setScissorTest(!1);let L=p!==Gn&&this.type===Gn,U=p===Gn&&this.type!==Gn;for(let F=0,W=w.length;F<W;F++){let J=w[F],I=J.shadow;if(I===void 0){console.warn("THREE.WebGLShadowMap:",J,"has no shadow.");continue}if(I.autoUpdate===!1&&I.needsUpdate===!1)continue;i.copy(I.mapSize);let Y=I.getFrameExtents();if(i.multiply(Y),r.copy(I.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/Y.x),i.x=r.x*Y.x,I.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/Y.y),i.y=r.y*Y.y,I.mapSize.y=r.y)),I.map===null||L===!0||U===!0){let le=this.type!==Gn?{minFilter:Pt,magFilter:Pt}:{};I.map!==null&&I.map.dispose(),I.map=new Gt(i.x,i.y,le),I.map.texture.name=J.name+".shadowMap",I.camera.updateProjectionMatrix()}s.setRenderTarget(I.map),s.clear();let se=I.getViewportCount();for(let le=0;le<se;le++){let V=I.getViewport(le);o.set(r.x*V.x,r.y*V.y,r.x*V.z,r.y*V.w),C.viewport(o),I.updateMatrices(J,le),n=I.getFrustum(),v(R,D,I.camera,J,this.type)}I.isPointLightShadow!==!0&&this.type===Gn&&A(I,D),I.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(b,y,M)};function A(w,R){let D=e.update(x);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,d.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Gt(i.x,i.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,s.setRenderTarget(w.mapPass),s.clear(),s.renderBufferDirect(R,null,D,f,x,null),d.uniforms.shadow_pass.value=w.mapPass.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,s.setRenderTarget(w.map),s.clear(),s.renderBufferDirect(R,null,D,d,x,null)}function E(w,R,D,b){let y=null,M=D.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(M!==void 0)y=M;else if(y=D.isPointLight===!0?l:a,s.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){let C=y.uuid,L=R.uuid,U=c[C];U===void 0&&(U={},c[C]=U);let F=U[L];F===void 0&&(F=y.clone(),U[L]=F,R.addEventListener("dispose",P)),y=F}if(y.visible=R.visible,y.wireframe=R.wireframe,b===Gn?y.side=R.shadowSide!==null?R.shadowSide:R.side:y.side=R.shadowSide!==null?R.shadowSide:u[R.side],y.alphaMap=R.alphaMap,y.alphaTest=R.alphaTest,y.map=R.map,y.clipShadows=R.clipShadows,y.clippingPlanes=R.clippingPlanes,y.clipIntersection=R.clipIntersection,y.displacementMap=R.displacementMap,y.displacementScale=R.displacementScale,y.displacementBias=R.displacementBias,y.wireframeLinewidth=R.wireframeLinewidth,y.linewidth=R.linewidth,D.isPointLight===!0&&y.isMeshDistanceMaterial===!0){let C=s.properties.get(y);C.light=D}return y}function v(w,R,D,b,y){if(w.visible===!1)return;if(w.layers.test(R.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&y===Gn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,w.matrixWorld);let L=e.update(w),U=w.material;if(Array.isArray(U)){let F=L.groups;for(let W=0,J=F.length;W<J;W++){let I=F[W],Y=U[I.materialIndex];if(Y&&Y.visible){let se=E(w,Y,b,y);w.onBeforeShadow(s,w,R,D,L,se,I),s.renderBufferDirect(D,null,L,se,w,I),w.onAfterShadow(s,w,R,D,L,se,I)}}}else if(U.visible){let F=E(w,U,b,y);w.onBeforeShadow(s,w,R,D,L,F,null),s.renderBufferDirect(D,null,L,F,w,null),w.onAfterShadow(s,w,R,D,L,F,null)}}let C=w.children;for(let L=0,U=C.length;L<U;L++)v(C[L],R,D,b,y)}function P(w){w.target.removeEventListener("dispose",P);for(let D in c){let b=c[D],y=w.target.uuid;y in b&&(b[y].dispose(),delete b[y])}}}var lx={[za]:Ha,[Va]:Xa,[Ga]:qa,[ps]:Wa,[Ha]:za,[Xa]:Va,[qa]:Ga,[Wa]:ps};function cx(s,e){function t(){let k=!1,fe=new $e,K=null,ne=new $e(0,0,0,0);return{setMask:function(ge){K!==ge&&!k&&(s.colorMask(ge,ge,ge,ge),K=ge)},setLocked:function(ge){k=ge},setClear:function(ge,pe,ke,yt,Dt){Dt===!0&&(ge*=yt,pe*=yt,ke*=yt),fe.set(ge,pe,ke,yt),ne.equals(fe)===!1&&(s.clearColor(ge,pe,ke,yt),ne.copy(fe))},reset:function(){k=!1,K=null,ne.set(-1,0,0,0)}}}function n(){let k=!1,fe=!1,K=null,ne=null,ge=null;return{setReversed:function(pe){if(fe!==pe){let ke=e.get("EXT_clip_control");fe?ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.ZERO_TO_ONE_EXT):ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.NEGATIVE_ONE_TO_ONE_EXT);let yt=ge;ge=null,this.setClear(yt)}fe=pe},getReversed:function(){return fe},setTest:function(pe){pe?ie(s.DEPTH_TEST):ce(s.DEPTH_TEST)},setMask:function(pe){K!==pe&&!k&&(s.depthMask(pe),K=pe)},setFunc:function(pe){if(fe&&(pe=lx[pe]),ne!==pe){switch(pe){case za:s.depthFunc(s.NEVER);break;case Ha:s.depthFunc(s.ALWAYS);break;case Va:s.depthFunc(s.LESS);break;case ps:s.depthFunc(s.LEQUAL);break;case Ga:s.depthFunc(s.EQUAL);break;case Wa:s.depthFunc(s.GEQUAL);break;case Xa:s.depthFunc(s.GREATER);break;case qa:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}ne=pe}},setLocked:function(pe){k=pe},setClear:function(pe){ge!==pe&&(fe&&(pe=1-pe),s.clearDepth(pe),ge=pe)},reset:function(){k=!1,K=null,ne=null,ge=null,fe=!1}}}function i(){let k=!1,fe=null,K=null,ne=null,ge=null,pe=null,ke=null,yt=null,Dt=null;return{setTest:function(st){k||(st?ie(s.STENCIL_TEST):ce(s.STENCIL_TEST))},setMask:function(st){fe!==st&&!k&&(s.stencilMask(st),fe=st)},setFunc:function(st,pn,Un){(K!==st||ne!==pn||ge!==Un)&&(s.stencilFunc(st,pn,Un),K=st,ne=pn,ge=Un)},setOp:function(st,pn,Un){(pe!==st||ke!==pn||yt!==Un)&&(s.stencilOp(st,pn,Un),pe=st,ke=pn,yt=Un)},setLocked:function(st){k=st},setClear:function(st){Dt!==st&&(s.clearStencil(st),Dt=st)},reset:function(){k=!1,fe=null,K=null,ne=null,ge=null,pe=null,ke=null,yt=null,Dt=null}}}let r=new t,o=new n,a=new i,l=new WeakMap,c=new WeakMap,h={},u={},f=new WeakMap,d=[],g=null,x=!1,m=null,p=null,A=null,E=null,v=null,P=null,w=null,R=new he(0,0,0),D=0,b=!1,y=null,M=null,C=null,L=null,U=null,F=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),W=!1,J=0,I=s.getParameter(s.VERSION);I.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(I)[1]),W=J>=1):I.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(I)[1]),W=J>=2);let Y=null,se={},le=s.getParameter(s.SCISSOR_BOX),V=s.getParameter(s.VIEWPORT),Z=new $e().fromArray(le),O=new $e().fromArray(V);function G(k,fe,K,ne){let ge=new Uint8Array(4),pe=s.createTexture();s.bindTexture(k,pe),s.texParameteri(k,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(k,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let ke=0;ke<K;ke++)k===s.TEXTURE_3D||k===s.TEXTURE_2D_ARRAY?s.texImage3D(fe,0,s.RGBA,1,1,ne,0,s.RGBA,s.UNSIGNED_BYTE,ge):s.texImage2D(fe+ke,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,ge);return pe}let ee={};ee[s.TEXTURE_2D]=G(s.TEXTURE_2D,s.TEXTURE_2D,1),ee[s.TEXTURE_CUBE_MAP]=G(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),ee[s.TEXTURE_2D_ARRAY]=G(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),ee[s.TEXTURE_3D]=G(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ie(s.DEPTH_TEST),o.setFunc(ps),Ue(!1),Be(ch),ie(s.CULL_FACE),B(Pn);function ie(k){h[k]!==!0&&(s.enable(k),h[k]=!0)}function ce(k){h[k]!==!1&&(s.disable(k),h[k]=!1)}function xe(k,fe){return u[k]!==fe?(s.bindFramebuffer(k,fe),u[k]=fe,k===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=fe),k===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=fe),!0):!1}function _e(k,fe){let K=d,ne=!1;if(k){K=f.get(fe),K===void 0&&(K=[],f.set(fe,K));let ge=k.textures;if(K.length!==ge.length||K[0]!==s.COLOR_ATTACHMENT0){for(let pe=0,ke=ge.length;pe<ke;pe++)K[pe]=s.COLOR_ATTACHMENT0+pe;K.length=ge.length,ne=!0}}else K[0]!==s.BACK&&(K[0]=s.BACK,ne=!0);ne&&s.drawBuffers(K)}function Xe(k){return g!==k?(s.useProgram(k),g=k,!0):!1}let Ne={[Oi]:s.FUNC_ADD,[wf]:s.FUNC_SUBTRACT,[Tf]:s.FUNC_REVERSE_SUBTRACT};Ne[Rf]=s.MIN,Ne[Cf]=s.MAX;let je={[If]:s.ZERO,[Pf]:s.ONE,[Lf]:s.SRC_COLOR,[ka]:s.SRC_ALPHA,[kf]:s.SRC_ALPHA_SATURATE,[Of]:s.DST_COLOR,[Nf]:s.DST_ALPHA,[Df]:s.ONE_MINUS_SRC_COLOR,[Fa]:s.ONE_MINUS_SRC_ALPHA,[Bf]:s.ONE_MINUS_DST_COLOR,[Uf]:s.ONE_MINUS_DST_ALPHA,[Ff]:s.CONSTANT_COLOR,[zf]:s.ONE_MINUS_CONSTANT_COLOR,[Hf]:s.CONSTANT_ALPHA,[Vf]:s.ONE_MINUS_CONSTANT_ALPHA};function B(k,fe,K,ne,ge,pe,ke,yt,Dt,st){if(k===Pn){x===!0&&(ce(s.BLEND),x=!1);return}if(x===!1&&(ie(s.BLEND),x=!0),k!==Af){if(k!==m||st!==b){if((p!==Oi||v!==Oi)&&(s.blendEquation(s.FUNC_ADD),p=Oi,v=Oi),st)switch(k){case hs:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case qt:s.blendFunc(s.ONE,s.ONE);break;case hh:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case uh:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}else switch(k){case hs:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case qt:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case hh:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case uh:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}A=null,E=null,P=null,w=null,R.set(0,0,0),D=0,m=k,b=st}return}ge=ge||fe,pe=pe||K,ke=ke||ne,(fe!==p||ge!==v)&&(s.blendEquationSeparate(Ne[fe],Ne[ge]),p=fe,v=ge),(K!==A||ne!==E||pe!==P||ke!==w)&&(s.blendFuncSeparate(je[K],je[ne],je[pe],je[ke]),A=K,E=ne,P=pe,w=ke),(yt.equals(R)===!1||Dt!==D)&&(s.blendColor(yt.r,yt.g,yt.b,Dt),R.copy(yt),D=Dt),m=k,b=!1}function Ze(k,fe){k.side===Bt?ce(s.CULL_FACE):ie(s.CULL_FACE);let K=k.side===kt;fe&&(K=!K),Ue(K),k.blending===hs&&k.transparent===!1?B(Pn):B(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),o.setFunc(k.depthFunc),o.setTest(k.depthTest),o.setMask(k.depthWrite),r.setMask(k.colorWrite);let ne=k.stencilWrite;a.setTest(ne),ne&&(a.setMask(k.stencilWriteMask),a.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),a.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),at(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?ie(s.SAMPLE_ALPHA_TO_COVERAGE):ce(s.SAMPLE_ALPHA_TO_COVERAGE)}function Ue(k){y!==k&&(k?s.frontFace(s.CW):s.frontFace(s.CCW),y=k)}function Be(k){k!==Ef?(ie(s.CULL_FACE),k!==M&&(k===ch?s.cullFace(s.BACK):k===bf?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):ce(s.CULL_FACE),M=k}function Ee(k){k!==C&&(W&&s.lineWidth(k),C=k)}function at(k,fe,K){k?(ie(s.POLYGON_OFFSET_FILL),(L!==fe||U!==K)&&(s.polygonOffset(fe,K),L=fe,U=K)):ce(s.POLYGON_OFFSET_FILL)}function Re(k){k?ie(s.SCISSOR_TEST):ce(s.SCISSOR_TEST)}function T(k){k===void 0&&(k=s.TEXTURE0+F-1),Y!==k&&(s.activeTexture(k),Y=k)}function _(k,fe,K){K===void 0&&(Y===null?K=s.TEXTURE0+F-1:K=Y);let ne=se[K];ne===void 0&&(ne={type:void 0,texture:void 0},se[K]=ne),(ne.type!==k||ne.texture!==fe)&&(Y!==K&&(s.activeTexture(K),Y=K),s.bindTexture(k,fe||ee[k]),ne.type=k,ne.texture=fe)}function X(){let k=se[Y];k!==void 0&&k.type!==void 0&&(s.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function te(){try{s.compressedTexImage2D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function re(){try{s.compressedTexImage3D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function $(){try{s.texSubImage2D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function we(){try{s.texSubImage3D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function de(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ve(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Je(){try{s.texStorage2D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function oe(){try{s.texStorage3D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ye(){try{s.texImage2D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Ie(){try{s.texImage3D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Le(k){Z.equals(k)===!1&&(s.scissor(k.x,k.y,k.z,k.w),Z.copy(k))}function Me(k){O.equals(k)===!1&&(s.viewport(k.x,k.y,k.z,k.w),O.copy(k))}function Ye(k,fe){let K=c.get(fe);K===void 0&&(K=new WeakMap,c.set(fe,K));let ne=K.get(k);ne===void 0&&(ne=s.getUniformBlockIndex(fe,k.name),K.set(k,ne))}function He(k,fe){let ne=c.get(fe).get(k);l.get(fe)!==ne&&(s.uniformBlockBinding(fe,ne,k.__bindingPointIndex),l.set(fe,ne))}function ut(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},Y=null,se={},u={},f=new WeakMap,d=[],g=null,x=!1,m=null,p=null,A=null,E=null,v=null,P=null,w=null,R=new he(0,0,0),D=0,b=!1,y=null,M=null,C=null,L=null,U=null,Z.set(0,0,s.canvas.width,s.canvas.height),O.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ie,disable:ce,bindFramebuffer:xe,drawBuffers:_e,useProgram:Xe,setBlending:B,setMaterial:Ze,setFlipSided:Ue,setCullFace:Be,setLineWidth:Ee,setPolygonOffset:at,setScissorTest:Re,activeTexture:T,bindTexture:_,unbindTexture:X,compressedTexImage2D:te,compressedTexImage3D:re,texImage2D:ye,texImage3D:Ie,updateUBOMapping:Ye,uniformBlockBinding:He,texStorage2D:Je,texStorage3D:oe,texSubImage2D:$,texSubImage3D:we,compressedTexSubImage2D:de,compressedTexSubImage3D:ve,scissor:Le,viewport:Me,reset:ut}}function ru(s,e,t,n){let i=hx(n);switch(t){case Pu:return s*e;case Du:return s*e;case Nu:return s*e*2;case gr:return s*e/i.components*i.byteLength;case oc:return s*e/i.components*i.byteLength;case Uu:return s*e*2/i.components*i.byteLength;case ac:return s*e*2/i.components*i.byteLength;case Lu:return s*e*3/i.components*i.byteLength;case rn:return s*e*4/i.components*i.byteLength;case lc:return s*e*4/i.components*i.byteLength;case io:case so:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case ro:case oo:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Ja:case Qa:return Math.max(s,16)*Math.max(e,8)/4;case Ka:case Za:return Math.max(s,8)*Math.max(e,8)/2;case $a:case el:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case tl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case nl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case il:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case sl:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case rl:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case ol:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case al:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case ll:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case cl:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case hl:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case ul:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case fl:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case dl:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case pl:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case ml:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case ao:case gl:case xl:return Math.ceil(s/4)*Math.ceil(e/4)*16;case Ou:case vl:return Math.ceil(s/4)*Math.ceil(e/4)*8;case yl:case Ml:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function hx(s){switch(s){case Yn:case Ru:return{byteLength:1,components:1};case sr:case Cu:case An:return{byteLength:2,components:1};case sc:case rc:return{byteLength:2,components:4};case zi:case ic:case Mn:return{byteLength:4,components:1};case Iu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}function ux(s,e,t,n,i,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ce,h=new WeakMap,u,f=new WeakMap,d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,_){return d?new OffscreenCanvas(T,_):rr("canvas")}function x(T,_,X){let te=1,re=Re(T);if((re.width>X||re.height>X)&&(te=X/Math.max(re.width,re.height)),te<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){let $=Math.floor(te*re.width),we=Math.floor(te*re.height);u===void 0&&(u=g($,we));let de=_?g($,we):u;return de.width=$,de.height=we,de.getContext("2d").drawImage(T,0,0,$,we),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+re.width+"x"+re.height+") to ("+$+"x"+we+")."),de}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+re.width+"x"+re.height+")."),T;return T}function m(T){return T.generateMipmaps}function p(T){s.generateMipmap(T)}function A(T){return T.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?s.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function E(T,_,X,te,re=!1){if(T!==null){if(s[T]!==void 0)return s[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let $=_;if(_===s.RED&&(X===s.FLOAT&&($=s.R32F),X===s.HALF_FLOAT&&($=s.R16F),X===s.UNSIGNED_BYTE&&($=s.R8)),_===s.RED_INTEGER&&(X===s.UNSIGNED_BYTE&&($=s.R8UI),X===s.UNSIGNED_SHORT&&($=s.R16UI),X===s.UNSIGNED_INT&&($=s.R32UI),X===s.BYTE&&($=s.R8I),X===s.SHORT&&($=s.R16I),X===s.INT&&($=s.R32I)),_===s.RG&&(X===s.FLOAT&&($=s.RG32F),X===s.HALF_FLOAT&&($=s.RG16F),X===s.UNSIGNED_BYTE&&($=s.RG8)),_===s.RG_INTEGER&&(X===s.UNSIGNED_BYTE&&($=s.RG8UI),X===s.UNSIGNED_SHORT&&($=s.RG16UI),X===s.UNSIGNED_INT&&($=s.RG32UI),X===s.BYTE&&($=s.RG8I),X===s.SHORT&&($=s.RG16I),X===s.INT&&($=s.RG32I)),_===s.RGB_INTEGER&&(X===s.UNSIGNED_BYTE&&($=s.RGB8UI),X===s.UNSIGNED_SHORT&&($=s.RGB16UI),X===s.UNSIGNED_INT&&($=s.RGB32UI),X===s.BYTE&&($=s.RGB8I),X===s.SHORT&&($=s.RGB16I),X===s.INT&&($=s.RGB32I)),_===s.RGBA_INTEGER&&(X===s.UNSIGNED_BYTE&&($=s.RGBA8UI),X===s.UNSIGNED_SHORT&&($=s.RGBA16UI),X===s.UNSIGNED_INT&&($=s.RGBA32UI),X===s.BYTE&&($=s.RGBA8I),X===s.SHORT&&($=s.RGBA16I),X===s.INT&&($=s.RGBA32I)),_===s.RGB&&X===s.UNSIGNED_INT_5_9_9_9_REV&&($=s.RGB9_E5),_===s.RGBA){let we=re?Bo:Ge.getTransfer(te);X===s.FLOAT&&($=s.RGBA32F),X===s.HALF_FLOAT&&($=s.RGBA16F),X===s.UNSIGNED_BYTE&&($=we===nt?s.SRGB8_ALPHA8:s.RGBA8),X===s.UNSIGNED_SHORT_4_4_4_4&&($=s.RGBA4),X===s.UNSIGNED_SHORT_5_5_5_1&&($=s.RGB5_A1)}return($===s.R16F||$===s.R32F||$===s.RG16F||$===s.RG32F||$===s.RGBA16F||$===s.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function v(T,_){let X;return T?_===null||_===zi||_===xs?X=s.DEPTH24_STENCIL8:_===Mn?X=s.DEPTH32F_STENCIL8:_===sr&&(X=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===zi||_===xs?X=s.DEPTH_COMPONENT24:_===Mn?X=s.DEPTH_COMPONENT32F:_===sr&&(X=s.DEPTH_COMPONENT16),X}function P(T,_){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==Pt&&T.minFilter!==Xt?Math.log2(Math.max(_.width,_.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?_.mipmaps.length:1}function w(T){let _=T.target;_.removeEventListener("dispose",w),D(_),_.isVideoTexture&&h.delete(_)}function R(T){let _=T.target;_.removeEventListener("dispose",R),y(_)}function D(T){let _=n.get(T);if(_.__webglInit===void 0)return;let X=T.source,te=f.get(X);if(te){let re=te[_.__cacheKey];re.usedTimes--,re.usedTimes===0&&b(T),Object.keys(te).length===0&&f.delete(X)}n.remove(T)}function b(T){let _=n.get(T);s.deleteTexture(_.__webglTexture);let X=T.source,te=f.get(X);delete te[_.__cacheKey],o.memory.textures--}function y(T){let _=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let te=0;te<6;te++){if(Array.isArray(_.__webglFramebuffer[te]))for(let re=0;re<_.__webglFramebuffer[te].length;re++)s.deleteFramebuffer(_.__webglFramebuffer[te][re]);else s.deleteFramebuffer(_.__webglFramebuffer[te]);_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer[te])}else{if(Array.isArray(_.__webglFramebuffer))for(let te=0;te<_.__webglFramebuffer.length;te++)s.deleteFramebuffer(_.__webglFramebuffer[te]);else s.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&s.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let te=0;te<_.__webglColorRenderbuffer.length;te++)_.__webglColorRenderbuffer[te]&&s.deleteRenderbuffer(_.__webglColorRenderbuffer[te]);_.__webglDepthRenderbuffer&&s.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let X=T.textures;for(let te=0,re=X.length;te<re;te++){let $=n.get(X[te]);$.__webglTexture&&(s.deleteTexture($.__webglTexture),o.memory.textures--),n.remove(X[te])}n.remove(T)}let M=0;function C(){M=0}function L(){let T=M;return T>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+i.maxTextures),M+=1,T}function U(T){let _=[];return _.push(T.wrapS),_.push(T.wrapT),_.push(T.wrapR||0),_.push(T.magFilter),_.push(T.minFilter),_.push(T.anisotropy),_.push(T.internalFormat),_.push(T.format),_.push(T.type),_.push(T.generateMipmaps),_.push(T.premultiplyAlpha),_.push(T.flipY),_.push(T.unpackAlignment),_.push(T.colorSpace),_.join()}function F(T,_){let X=n.get(T);if(T.isVideoTexture&&Ee(T),T.isRenderTargetTexture===!1&&T.version>0&&X.__version!==T.version){let te=T.image;if(te===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(te.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{O(X,T,_);return}}t.bindTexture(s.TEXTURE_2D,X.__webglTexture,s.TEXTURE0+_)}function W(T,_){let X=n.get(T);if(T.version>0&&X.__version!==T.version){O(X,T,_);return}t.bindTexture(s.TEXTURE_2D_ARRAY,X.__webglTexture,s.TEXTURE0+_)}function J(T,_){let X=n.get(T);if(T.version>0&&X.__version!==T.version){O(X,T,_);return}t.bindTexture(s.TEXTURE_3D,X.__webglTexture,s.TEXTURE0+_)}function I(T,_){let X=n.get(T);if(T.version>0&&X.__version!==T.version){G(X,T,_);return}t.bindTexture(s.TEXTURE_CUBE_MAP,X.__webglTexture,s.TEXTURE0+_)}let Y={[Fi]:s.REPEAT,[Xn]:s.CLAMP_TO_EDGE,[ir]:s.MIRRORED_REPEAT},se={[Pt]:s.NEAREST,[nc]:s.NEAREST_MIPMAP_NEAREST,[os]:s.NEAREST_MIPMAP_LINEAR,[Xt]:s.LINEAR,[$s]:s.LINEAR_MIPMAP_NEAREST,[In]:s.LINEAR_MIPMAP_LINEAR},le={[ed]:s.NEVER,[od]:s.ALWAYS,[td]:s.LESS,[Fu]:s.LEQUAL,[nd]:s.EQUAL,[rd]:s.GEQUAL,[id]:s.GREATER,[sd]:s.NOTEQUAL};function V(T,_){if(_.type===Mn&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===Xt||_.magFilter===$s||_.magFilter===os||_.magFilter===In||_.minFilter===Xt||_.minFilter===$s||_.minFilter===os||_.minFilter===In)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(T,s.TEXTURE_WRAP_S,Y[_.wrapS]),s.texParameteri(T,s.TEXTURE_WRAP_T,Y[_.wrapT]),(T===s.TEXTURE_3D||T===s.TEXTURE_2D_ARRAY)&&s.texParameteri(T,s.TEXTURE_WRAP_R,Y[_.wrapR]),s.texParameteri(T,s.TEXTURE_MAG_FILTER,se[_.magFilter]),s.texParameteri(T,s.TEXTURE_MIN_FILTER,se[_.minFilter]),_.compareFunction&&(s.texParameteri(T,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(T,s.TEXTURE_COMPARE_FUNC,le[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Pt||_.minFilter!==os&&_.minFilter!==In||_.type===Mn&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){let X=e.get("EXT_texture_filter_anisotropic");s.texParameterf(T,X.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,i.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function Z(T,_){let X=!1;T.__webglInit===void 0&&(T.__webglInit=!0,_.addEventListener("dispose",w));let te=_.source,re=f.get(te);re===void 0&&(re={},f.set(te,re));let $=U(_);if($!==T.__cacheKey){re[$]===void 0&&(re[$]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,X=!0),re[$].usedTimes++;let we=re[T.__cacheKey];we!==void 0&&(re[T.__cacheKey].usedTimes--,we.usedTimes===0&&b(_)),T.__cacheKey=$,T.__webglTexture=re[$].texture}return X}function O(T,_,X){let te=s.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(te=s.TEXTURE_2D_ARRAY),_.isData3DTexture&&(te=s.TEXTURE_3D);let re=Z(T,_),$=_.source;t.bindTexture(te,T.__webglTexture,s.TEXTURE0+X);let we=n.get($);if($.version!==we.__version||re===!0){t.activeTexture(s.TEXTURE0+X);let de=Ge.getPrimaries(Ge.workingColorSpace),ve=_.colorSpace===fi?null:Ge.getPrimaries(_.colorSpace),Je=_.colorSpace===fi||de===ve?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Je);let oe=x(_.image,!1,i.maxTextureSize);oe=at(_,oe);let ye=r.convert(_.format,_.colorSpace),Ie=r.convert(_.type),Le=E(_.internalFormat,ye,Ie,_.colorSpace,_.isVideoTexture);V(te,_);let Me,Ye=_.mipmaps,He=_.isVideoTexture!==!0,ut=we.__version===void 0||re===!0,k=$.dataReady,fe=P(_,oe);if(_.isDepthTexture)Le=v(_.format===vs,_.type),ut&&(He?t.texStorage2D(s.TEXTURE_2D,1,Le,oe.width,oe.height):t.texImage2D(s.TEXTURE_2D,0,Le,oe.width,oe.height,0,ye,Ie,null));else if(_.isDataTexture)if(Ye.length>0){He&&ut&&t.texStorage2D(s.TEXTURE_2D,fe,Le,Ye[0].width,Ye[0].height);for(let K=0,ne=Ye.length;K<ne;K++)Me=Ye[K],He?k&&t.texSubImage2D(s.TEXTURE_2D,K,0,0,Me.width,Me.height,ye,Ie,Me.data):t.texImage2D(s.TEXTURE_2D,K,Le,Me.width,Me.height,0,ye,Ie,Me.data);_.generateMipmaps=!1}else He?(ut&&t.texStorage2D(s.TEXTURE_2D,fe,Le,oe.width,oe.height),k&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,oe.width,oe.height,ye,Ie,oe.data)):t.texImage2D(s.TEXTURE_2D,0,Le,oe.width,oe.height,0,ye,Ie,oe.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){He&&ut&&t.texStorage3D(s.TEXTURE_2D_ARRAY,fe,Le,Ye[0].width,Ye[0].height,oe.depth);for(let K=0,ne=Ye.length;K<ne;K++)if(Me=Ye[K],_.format!==rn)if(ye!==null)if(He){if(k)if(_.layerUpdates.size>0){let ge=ru(Me.width,Me.height,_.format,_.type);for(let pe of _.layerUpdates){let ke=Me.data.subarray(pe*ge/Me.data.BYTES_PER_ELEMENT,(pe+1)*ge/Me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,K,0,0,pe,Me.width,Me.height,1,ye,ke)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,K,0,0,0,Me.width,Me.height,oe.depth,ye,Me.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,K,Le,Me.width,Me.height,oe.depth,0,Me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else He?k&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,K,0,0,0,Me.width,Me.height,oe.depth,ye,Ie,Me.data):t.texImage3D(s.TEXTURE_2D_ARRAY,K,Le,Me.width,Me.height,oe.depth,0,ye,Ie,Me.data)}else{He&&ut&&t.texStorage2D(s.TEXTURE_2D,fe,Le,Ye[0].width,Ye[0].height);for(let K=0,ne=Ye.length;K<ne;K++)Me=Ye[K],_.format!==rn?ye!==null?He?k&&t.compressedTexSubImage2D(s.TEXTURE_2D,K,0,0,Me.width,Me.height,ye,Me.data):t.compressedTexImage2D(s.TEXTURE_2D,K,Le,Me.width,Me.height,0,Me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):He?k&&t.texSubImage2D(s.TEXTURE_2D,K,0,0,Me.width,Me.height,ye,Ie,Me.data):t.texImage2D(s.TEXTURE_2D,K,Le,Me.width,Me.height,0,ye,Ie,Me.data)}else if(_.isDataArrayTexture)if(He){if(ut&&t.texStorage3D(s.TEXTURE_2D_ARRAY,fe,Le,oe.width,oe.height,oe.depth),k)if(_.layerUpdates.size>0){let K=ru(oe.width,oe.height,_.format,_.type);for(let ne of _.layerUpdates){let ge=oe.data.subarray(ne*K/oe.data.BYTES_PER_ELEMENT,(ne+1)*K/oe.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,ne,oe.width,oe.height,1,ye,Ie,ge)}_.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,oe.width,oe.height,oe.depth,ye,Ie,oe.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,Le,oe.width,oe.height,oe.depth,0,ye,Ie,oe.data);else if(_.isData3DTexture)He?(ut&&t.texStorage3D(s.TEXTURE_3D,fe,Le,oe.width,oe.height,oe.depth),k&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,oe.width,oe.height,oe.depth,ye,Ie,oe.data)):t.texImage3D(s.TEXTURE_3D,0,Le,oe.width,oe.height,oe.depth,0,ye,Ie,oe.data);else if(_.isFramebufferTexture){if(ut)if(He)t.texStorage2D(s.TEXTURE_2D,fe,Le,oe.width,oe.height);else{let K=oe.width,ne=oe.height;for(let ge=0;ge<fe;ge++)t.texImage2D(s.TEXTURE_2D,ge,Le,K,ne,0,ye,Ie,null),K>>=1,ne>>=1}}else if(Ye.length>0){if(He&&ut){let K=Re(Ye[0]);t.texStorage2D(s.TEXTURE_2D,fe,Le,K.width,K.height)}for(let K=0,ne=Ye.length;K<ne;K++)Me=Ye[K],He?k&&t.texSubImage2D(s.TEXTURE_2D,K,0,0,ye,Ie,Me):t.texImage2D(s.TEXTURE_2D,K,Le,ye,Ie,Me);_.generateMipmaps=!1}else if(He){if(ut){let K=Re(oe);t.texStorage2D(s.TEXTURE_2D,fe,Le,K.width,K.height)}k&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,ye,Ie,oe)}else t.texImage2D(s.TEXTURE_2D,0,Le,ye,Ie,oe);m(_)&&p(te),we.__version=$.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function G(T,_,X){if(_.image.length!==6)return;let te=Z(T,_),re=_.source;t.bindTexture(s.TEXTURE_CUBE_MAP,T.__webglTexture,s.TEXTURE0+X);let $=n.get(re);if(re.version!==$.__version||te===!0){t.activeTexture(s.TEXTURE0+X);let we=Ge.getPrimaries(Ge.workingColorSpace),de=_.colorSpace===fi?null:Ge.getPrimaries(_.colorSpace),ve=_.colorSpace===fi||we===de?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve);let Je=_.isCompressedTexture||_.image[0].isCompressedTexture,oe=_.image[0]&&_.image[0].isDataTexture,ye=[];for(let ne=0;ne<6;ne++)!Je&&!oe?ye[ne]=x(_.image[ne],!0,i.maxCubemapSize):ye[ne]=oe?_.image[ne].image:_.image[ne],ye[ne]=at(_,ye[ne]);let Ie=ye[0],Le=r.convert(_.format,_.colorSpace),Me=r.convert(_.type),Ye=E(_.internalFormat,Le,Me,_.colorSpace),He=_.isVideoTexture!==!0,ut=$.__version===void 0||te===!0,k=re.dataReady,fe=P(_,Ie);V(s.TEXTURE_CUBE_MAP,_);let K;if(Je){He&&ut&&t.texStorage2D(s.TEXTURE_CUBE_MAP,fe,Ye,Ie.width,Ie.height);for(let ne=0;ne<6;ne++){K=ye[ne].mipmaps;for(let ge=0;ge<K.length;ge++){let pe=K[ge];_.format!==rn?Le!==null?He?k&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ge,0,0,pe.width,pe.height,Le,pe.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ge,Ye,pe.width,pe.height,0,pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):He?k&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ge,0,0,pe.width,pe.height,Le,Me,pe.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ge,Ye,pe.width,pe.height,0,Le,Me,pe.data)}}}else{if(K=_.mipmaps,He&&ut){K.length>0&&fe++;let ne=Re(ye[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,fe,Ye,ne.width,ne.height)}for(let ne=0;ne<6;ne++)if(oe){He?k&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,0,0,ye[ne].width,ye[ne].height,Le,Me,ye[ne].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,Ye,ye[ne].width,ye[ne].height,0,Le,Me,ye[ne].data);for(let ge=0;ge<K.length;ge++){let ke=K[ge].image[ne].image;He?k&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ge+1,0,0,ke.width,ke.height,Le,Me,ke.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ge+1,Ye,ke.width,ke.height,0,Le,Me,ke.data)}}else{He?k&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,0,0,Le,Me,ye[ne]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,Ye,Le,Me,ye[ne]);for(let ge=0;ge<K.length;ge++){let pe=K[ge];He?k&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ge+1,0,0,Le,Me,pe.image[ne]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ge+1,Ye,Le,Me,pe.image[ne])}}}m(_)&&p(s.TEXTURE_CUBE_MAP),$.__version=re.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function ee(T,_,X,te,re,$){let we=r.convert(X.format,X.colorSpace),de=r.convert(X.type),ve=E(X.internalFormat,we,de,X.colorSpace),Je=n.get(_),oe=n.get(X);if(oe.__renderTarget=_,!Je.__hasExternalTextures){let ye=Math.max(1,_.width>>$),Ie=Math.max(1,_.height>>$);re===s.TEXTURE_3D||re===s.TEXTURE_2D_ARRAY?t.texImage3D(re,$,ve,ye,Ie,_.depth,0,we,de,null):t.texImage2D(re,$,ve,ye,Ie,0,we,de,null)}t.bindFramebuffer(s.FRAMEBUFFER,T),Be(_)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,te,re,oe.__webglTexture,0,Ue(_)):(re===s.TEXTURE_2D||re>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&re<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,te,re,oe.__webglTexture,$),t.bindFramebuffer(s.FRAMEBUFFER,null)}function ie(T,_,X){if(s.bindRenderbuffer(s.RENDERBUFFER,T),_.depthBuffer){let te=_.depthTexture,re=te&&te.isDepthTexture?te.type:null,$=v(_.stencilBuffer,re),we=_.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,de=Ue(_);Be(_)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,de,$,_.width,_.height):X?s.renderbufferStorageMultisample(s.RENDERBUFFER,de,$,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,$,_.width,_.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,we,s.RENDERBUFFER,T)}else{let te=_.textures;for(let re=0;re<te.length;re++){let $=te[re],we=r.convert($.format,$.colorSpace),de=r.convert($.type),ve=E($.internalFormat,we,de,$.colorSpace),Je=Ue(_);X&&Be(_)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Je,ve,_.width,_.height):Be(_)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Je,ve,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,ve,_.width,_.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function ce(T,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,T),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let te=n.get(_.depthTexture);te.__renderTarget=_,(!te.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),F(_.depthTexture,0);let re=te.__webglTexture,$=Ue(_);if(_.depthTexture.format===us)Be(_)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,re,0,$):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,re,0);else if(_.depthTexture.format===vs)Be(_)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,re,0,$):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,re,0);else throw new Error("Unknown depthTexture format")}function xe(T){let _=n.get(T),X=T.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==T.depthTexture){let te=T.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),te){let re=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,te.removeEventListener("dispose",re)};te.addEventListener("dispose",re),_.__depthDisposeCallback=re}_.__boundDepthTexture=te}if(T.depthTexture&&!_.__autoAllocateDepthBuffer){if(X)throw new Error("target.depthTexture not supported in Cube render targets");ce(_.__webglFramebuffer,T)}else if(X){_.__webglDepthbuffer=[];for(let te=0;te<6;te++)if(t.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer[te]),_.__webglDepthbuffer[te]===void 0)_.__webglDepthbuffer[te]=s.createRenderbuffer(),ie(_.__webglDepthbuffer[te],T,!1);else{let re=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,$=_.__webglDepthbuffer[te];s.bindRenderbuffer(s.RENDERBUFFER,$),s.framebufferRenderbuffer(s.FRAMEBUFFER,re,s.RENDERBUFFER,$)}}else if(t.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=s.createRenderbuffer(),ie(_.__webglDepthbuffer,T,!1);else{let te=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,re=_.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,re),s.framebufferRenderbuffer(s.FRAMEBUFFER,te,s.RENDERBUFFER,re)}t.bindFramebuffer(s.FRAMEBUFFER,null)}function _e(T,_,X){let te=n.get(T);_!==void 0&&ee(te.__webglFramebuffer,T,T.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),X!==void 0&&xe(T)}function Xe(T){let _=T.texture,X=n.get(T),te=n.get(_);T.addEventListener("dispose",R);let re=T.textures,$=T.isWebGLCubeRenderTarget===!0,we=re.length>1;if(we||(te.__webglTexture===void 0&&(te.__webglTexture=s.createTexture()),te.__version=_.version,o.memory.textures++),$){X.__webglFramebuffer=[];for(let de=0;de<6;de++)if(_.mipmaps&&_.mipmaps.length>0){X.__webglFramebuffer[de]=[];for(let ve=0;ve<_.mipmaps.length;ve++)X.__webglFramebuffer[de][ve]=s.createFramebuffer()}else X.__webglFramebuffer[de]=s.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){X.__webglFramebuffer=[];for(let de=0;de<_.mipmaps.length;de++)X.__webglFramebuffer[de]=s.createFramebuffer()}else X.__webglFramebuffer=s.createFramebuffer();if(we)for(let de=0,ve=re.length;de<ve;de++){let Je=n.get(re[de]);Je.__webglTexture===void 0&&(Je.__webglTexture=s.createTexture(),o.memory.textures++)}if(T.samples>0&&Be(T)===!1){X.__webglMultisampledFramebuffer=s.createFramebuffer(),X.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let de=0;de<re.length;de++){let ve=re[de];X.__webglColorRenderbuffer[de]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,X.__webglColorRenderbuffer[de]);let Je=r.convert(ve.format,ve.colorSpace),oe=r.convert(ve.type),ye=E(ve.internalFormat,Je,oe,ve.colorSpace,T.isXRRenderTarget===!0),Ie=Ue(T);s.renderbufferStorageMultisample(s.RENDERBUFFER,Ie,ye,T.width,T.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+de,s.RENDERBUFFER,X.__webglColorRenderbuffer[de])}s.bindRenderbuffer(s.RENDERBUFFER,null),T.depthBuffer&&(X.__webglDepthRenderbuffer=s.createRenderbuffer(),ie(X.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if($){t.bindTexture(s.TEXTURE_CUBE_MAP,te.__webglTexture),V(s.TEXTURE_CUBE_MAP,_);for(let de=0;de<6;de++)if(_.mipmaps&&_.mipmaps.length>0)for(let ve=0;ve<_.mipmaps.length;ve++)ee(X.__webglFramebuffer[de][ve],T,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+de,ve);else ee(X.__webglFramebuffer[de],T,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);m(_)&&p(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(we){for(let de=0,ve=re.length;de<ve;de++){let Je=re[de],oe=n.get(Je);t.bindTexture(s.TEXTURE_2D,oe.__webglTexture),V(s.TEXTURE_2D,Je),ee(X.__webglFramebuffer,T,Je,s.COLOR_ATTACHMENT0+de,s.TEXTURE_2D,0),m(Je)&&p(s.TEXTURE_2D)}t.unbindTexture()}else{let de=s.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(de=T.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(de,te.__webglTexture),V(de,_),_.mipmaps&&_.mipmaps.length>0)for(let ve=0;ve<_.mipmaps.length;ve++)ee(X.__webglFramebuffer[ve],T,_,s.COLOR_ATTACHMENT0,de,ve);else ee(X.__webglFramebuffer,T,_,s.COLOR_ATTACHMENT0,de,0);m(_)&&p(de),t.unbindTexture()}T.depthBuffer&&xe(T)}function Ne(T){let _=T.textures;for(let X=0,te=_.length;X<te;X++){let re=_[X];if(m(re)){let $=A(T),we=n.get(re).__webglTexture;t.bindTexture($,we),p($),t.unbindTexture()}}}let je=[],B=[];function Ze(T){if(T.samples>0){if(Be(T)===!1){let _=T.textures,X=T.width,te=T.height,re=s.COLOR_BUFFER_BIT,$=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,we=n.get(T),de=_.length>1;if(de)for(let ve=0;ve<_.length;ve++)t.bindFramebuffer(s.FRAMEBUFFER,we.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ve,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,we.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ve,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,we.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,we.__webglFramebuffer);for(let ve=0;ve<_.length;ve++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(re|=s.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(re|=s.STENCIL_BUFFER_BIT)),de){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,we.__webglColorRenderbuffer[ve]);let Je=n.get(_[ve]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Je,0)}s.blitFramebuffer(0,0,X,te,0,0,X,te,re,s.NEAREST),l===!0&&(je.length=0,B.length=0,je.push(s.COLOR_ATTACHMENT0+ve),T.depthBuffer&&T.resolveDepthBuffer===!1&&(je.push($),B.push($),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,B)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,je))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),de)for(let ve=0;ve<_.length;ve++){t.bindFramebuffer(s.FRAMEBUFFER,we.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ve,s.RENDERBUFFER,we.__webglColorRenderbuffer[ve]);let Je=n.get(_[ve]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,we.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ve,s.TEXTURE_2D,Je,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,we.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){let _=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[_])}}}function Ue(T){return Math.min(i.maxSamples,T.samples)}function Be(T){let _=n.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function Ee(T){let _=o.render.frame;h.get(T)!==_&&(h.set(T,_),T.update())}function at(T,_){let X=T.colorSpace,te=T.format,re=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||X!==Ft&&X!==fi&&(Ge.getTransfer(X)===nt?(te!==rn||re!==Yn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",X)),_}function Re(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=L,this.resetTextureUnits=C,this.setTexture2D=F,this.setTexture2DArray=W,this.setTexture3D=J,this.setTextureCube=I,this.rebindTextures=_e,this.setupRenderTarget=Xe,this.updateRenderTargetMipmap=Ne,this.updateMultisampleRenderTarget=Ze,this.setupDepthRenderbuffer=xe,this.setupFrameBufferTexture=ee,this.useMultisampledRTT=Be}function fx(s,e){function t(n,i=fi){let r,o=Ge.getTransfer(i);if(n===Yn)return s.UNSIGNED_BYTE;if(n===sc)return s.UNSIGNED_SHORT_4_4_4_4;if(n===rc)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Iu)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Ru)return s.BYTE;if(n===Cu)return s.SHORT;if(n===sr)return s.UNSIGNED_SHORT;if(n===ic)return s.INT;if(n===zi)return s.UNSIGNED_INT;if(n===Mn)return s.FLOAT;if(n===An)return s.HALF_FLOAT;if(n===Pu)return s.ALPHA;if(n===Lu)return s.RGB;if(n===rn)return s.RGBA;if(n===Du)return s.LUMINANCE;if(n===Nu)return s.LUMINANCE_ALPHA;if(n===us)return s.DEPTH_COMPONENT;if(n===vs)return s.DEPTH_STENCIL;if(n===gr)return s.RED;if(n===oc)return s.RED_INTEGER;if(n===Uu)return s.RG;if(n===ac)return s.RG_INTEGER;if(n===lc)return s.RGBA_INTEGER;if(n===io||n===so||n===ro||n===oo)if(o===nt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===io)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===so)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ro)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===oo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===io)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===so)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ro)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===oo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ka||n===Ja||n===Za||n===Qa)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ka)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ja)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Za)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Qa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===$a||n===el||n===tl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===$a||n===el)return o===nt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===tl)return o===nt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===nl||n===il||n===sl||n===rl||n===ol||n===al||n===ll||n===cl||n===hl||n===ul||n===fl||n===dl||n===pl||n===ml)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===nl)return o===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===il)return o===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===sl)return o===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===rl)return o===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ol)return o===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===al)return o===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ll)return o===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===cl)return o===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===hl)return o===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ul)return o===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===fl)return o===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===dl)return o===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===pl)return o===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ml)return o===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ao||n===gl||n===xl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===ao)return o===nt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===gl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===xl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ou||n===vl||n===yl||n===Ml)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===ao)return r.COMPRESSED_RED_RGTC1_EXT;if(n===vl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===yl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ml)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===xs?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}var Ul=class extends wt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},lt=class extends xt{constructor(){super(),this.isGroup=!0,this.type="Group"}},dx={type:"move"},nr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new lt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new lt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new lt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let x of e.hand.values()){let m=t.getJointPose(x,n),p=this._getHandJoint(c,x);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;c.inputState.pinching&&f>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(dx)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new lt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},px=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,mx=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Ol=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){let i=new Lt,r=e.properties.get(i);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new ct({vertexShader:px,fragmentShader:mx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Q(new $t(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Bl=class extends Kn{constructor(e,t){super();let n=this,i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,f=null,d=null,g=null,x=new Ol,m=t.getContextAttributes(),p=null,A=null,E=[],v=[],P=new Ce,w=null,R=new wt;R.viewport=new $e;let D=new wt;D.viewport=new $e;let b=[R,D],y=new Ul,M=null,C=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(O){let G=E[O];return G===void 0&&(G=new nr,E[O]=G),G.getTargetRaySpace()},this.getControllerGrip=function(O){let G=E[O];return G===void 0&&(G=new nr,E[O]=G),G.getGripSpace()},this.getHand=function(O){let G=E[O];return G===void 0&&(G=new nr,E[O]=G),G.getHandSpace()};function L(O){let G=v.indexOf(O.inputSource);if(G===-1)return;let ee=E[G];ee!==void 0&&(ee.update(O.inputSource,O.frame,c||o),ee.dispatchEvent({type:O.type,data:O.inputSource}))}function U(){i.removeEventListener("select",L),i.removeEventListener("selectstart",L),i.removeEventListener("selectend",L),i.removeEventListener("squeeze",L),i.removeEventListener("squeezestart",L),i.removeEventListener("squeezeend",L),i.removeEventListener("end",U),i.removeEventListener("inputsourceschange",F);for(let O=0;O<E.length;O++){let G=v[O];G!==null&&(v[O]=null,E[O].disconnect(G))}M=null,C=null,x.reset(),e.setRenderTarget(p),d=null,f=null,u=null,i=null,A=null,Z.stop(),n.isPresenting=!1,e.setPixelRatio(w),e.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(O){r=O,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(O){a=O,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(O){c=O},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(O){if(i=O,i!==null){if(p=e.getRenderTarget(),i.addEventListener("select",L),i.addEventListener("selectstart",L),i.addEventListener("selectend",L),i.addEventListener("squeeze",L),i.addEventListener("squeezestart",L),i.addEventListener("squeezeend",L),i.addEventListener("end",U),i.addEventListener("inputsourceschange",F),m.xrCompatible!==!0&&await t.makeXRCompatible(),w=e.getPixelRatio(),e.getSize(P),i.renderState.layers===void 0){let G={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(i,t,G),i.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),A=new Gt(d.framebufferWidth,d.framebufferHeight,{format:rn,type:Yn,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let G=null,ee=null,ie=null;m.depth&&(ie=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,G=m.stencil?vs:us,ee=m.stencil?xs:zi);let ce={colorFormat:t.RGBA8,depthFormat:ie,scaleFactor:r};u=new XRWebGLBinding(i,t),f=u.createProjectionLayer(ce),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),A=new Gt(f.textureWidth,f.textureHeight,{format:rn,type:Yn,depthTexture:new vo(f.textureWidth,f.textureHeight,ee,void 0,void 0,void 0,void 0,void 0,void 0,G),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}A.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),Z.setContext(i),Z.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function F(O){for(let G=0;G<O.removed.length;G++){let ee=O.removed[G],ie=v.indexOf(ee);ie>=0&&(v[ie]=null,E[ie].disconnect(ee))}for(let G=0;G<O.added.length;G++){let ee=O.added[G],ie=v.indexOf(ee);if(ie===-1){for(let xe=0;xe<E.length;xe++)if(xe>=v.length){v.push(ee),ie=xe;break}else if(v[xe]===null){v[xe]=ee,ie=xe;break}if(ie===-1)break}let ce=E[ie];ce&&ce.connect(ee)}}let W=new N,J=new N;function I(O,G,ee){W.setFromMatrixPosition(G.matrixWorld),J.setFromMatrixPosition(ee.matrixWorld);let ie=W.distanceTo(J),ce=G.projectionMatrix.elements,xe=ee.projectionMatrix.elements,_e=ce[14]/(ce[10]-1),Xe=ce[14]/(ce[10]+1),Ne=(ce[9]+1)/ce[5],je=(ce[9]-1)/ce[5],B=(ce[8]-1)/ce[0],Ze=(xe[8]+1)/xe[0],Ue=_e*B,Be=_e*Ze,Ee=ie/(-B+Ze),at=Ee*-B;if(G.matrixWorld.decompose(O.position,O.quaternion,O.scale),O.translateX(at),O.translateZ(Ee),O.matrixWorld.compose(O.position,O.quaternion,O.scale),O.matrixWorldInverse.copy(O.matrixWorld).invert(),ce[10]===-1)O.projectionMatrix.copy(G.projectionMatrix),O.projectionMatrixInverse.copy(G.projectionMatrixInverse);else{let Re=_e+Ee,T=Xe+Ee,_=Ue-at,X=Be+(ie-at),te=Ne*Xe/T*Re,re=je*Xe/T*Re;O.projectionMatrix.makePerspective(_,X,te,re,Re,T),O.projectionMatrixInverse.copy(O.projectionMatrix).invert()}}function Y(O,G){G===null?O.matrixWorld.copy(O.matrix):O.matrixWorld.multiplyMatrices(G.matrixWorld,O.matrix),O.matrixWorldInverse.copy(O.matrixWorld).invert()}this.updateCamera=function(O){if(i===null)return;let G=O.near,ee=O.far;x.texture!==null&&(x.depthNear>0&&(G=x.depthNear),x.depthFar>0&&(ee=x.depthFar)),y.near=D.near=R.near=G,y.far=D.far=R.far=ee,(M!==y.near||C!==y.far)&&(i.updateRenderState({depthNear:y.near,depthFar:y.far}),M=y.near,C=y.far),R.layers.mask=O.layers.mask|2,D.layers.mask=O.layers.mask|4,y.layers.mask=R.layers.mask|D.layers.mask;let ie=O.parent,ce=y.cameras;Y(y,ie);for(let xe=0;xe<ce.length;xe++)Y(ce[xe],ie);ce.length===2?I(y,R,D):y.projectionMatrix.copy(R.projectionMatrix),se(O,y,ie)};function se(O,G,ee){ee===null?O.matrix.copy(G.matrixWorld):(O.matrix.copy(ee.matrixWorld),O.matrix.invert(),O.matrix.multiply(G.matrixWorld)),O.matrix.decompose(O.position,O.quaternion,O.scale),O.updateMatrixWorld(!0),O.projectionMatrix.copy(G.projectionMatrix),O.projectionMatrixInverse.copy(G.projectionMatrixInverse),O.isPerspectiveCamera&&(O.fov=_s*2*Math.atan(1/O.projectionMatrix.elements[5]),O.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function(O){l=O,f!==null&&(f.fixedFoveation=O),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=O)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(y)};let le=null;function V(O,G){if(h=G.getViewerPose(c||o),g=G,h!==null){let ee=h.views;d!==null&&(e.setRenderTargetFramebuffer(A,d.framebuffer),e.setRenderTarget(A));let ie=!1;ee.length!==y.cameras.length&&(y.cameras.length=0,ie=!0);for(let xe=0;xe<ee.length;xe++){let _e=ee[xe],Xe=null;if(d!==null)Xe=d.getViewport(_e);else{let je=u.getViewSubImage(f,_e);Xe=je.viewport,xe===0&&(e.setRenderTargetTextures(A,je.colorTexture,f.ignoreDepthValues?void 0:je.depthStencilTexture),e.setRenderTarget(A))}let Ne=b[xe];Ne===void 0&&(Ne=new wt,Ne.layers.enable(xe),Ne.viewport=new $e,b[xe]=Ne),Ne.matrix.fromArray(_e.transform.matrix),Ne.matrix.decompose(Ne.position,Ne.quaternion,Ne.scale),Ne.projectionMatrix.fromArray(_e.projectionMatrix),Ne.projectionMatrixInverse.copy(Ne.projectionMatrix).invert(),Ne.viewport.set(Xe.x,Xe.y,Xe.width,Xe.height),xe===0&&(y.matrix.copy(Ne.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),ie===!0&&y.cameras.push(Ne)}let ce=i.enabledFeatures;if(ce&&ce.includes("depth-sensing")){let xe=u.getDepthInformation(ee[0]);xe&&xe.isValid&&xe.texture&&x.init(e,xe,i.renderState)}}for(let ee=0;ee<E.length;ee++){let ie=v[ee],ce=E[ee];ie!==null&&ce!==void 0&&ce.update(ie,G,c||o)}le&&le(O,G),G.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:G}),g=null}let Z=new Wu;Z.setAnimationLoop(V),this.setAnimationLoop=function(O){le=O},this.dispose=function(){}}},Ni=new on,gx=new De;function xx(s,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Gu(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,A,E,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,v)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),x(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,A,E):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===kt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===kt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let A=e.get(p),E=A.envMap,v=A.envMapRotation;E&&(m.envMap.value=E,Ni.copy(v),Ni.x*=-1,Ni.y*=-1,Ni.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Ni.y*=-1,Ni.z*=-1),m.envMapRotation.value.setFromMatrix4(gx.makeRotationFromEuler(Ni)),m.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,A,E){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*A,m.scale.value=E*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,A){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===kt&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=A.texture,m.transmissionSamplerSize.value.set(A.width,A.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function x(m,p){let A=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(A.matrixWorld),m.nearDistance.value=A.shadow.camera.near,m.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function vx(s,e,t,n){let i={},r={},o=[],a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(A,E){let v=E.program;n.uniformBlockBinding(A,v)}function c(A,E){let v=i[A.id];v===void 0&&(g(A),v=h(A),i[A.id]=v,A.addEventListener("dispose",m));let P=E.program;n.updateUBOMapping(A,P);let w=e.render.frame;r[A.id]!==w&&(f(A),r[A.id]=w)}function h(A){let E=u();A.__bindingPointIndex=E;let v=s.createBuffer(),P=A.__size,w=A.usage;return s.bindBuffer(s.UNIFORM_BUFFER,v),s.bufferData(s.UNIFORM_BUFFER,P,w),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,E,v),v}function u(){for(let A=0;A<a;A++)if(o.indexOf(A)===-1)return o.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(A){let E=i[A.id],v=A.uniforms,P=A.__cache;s.bindBuffer(s.UNIFORM_BUFFER,E);for(let w=0,R=v.length;w<R;w++){let D=Array.isArray(v[w])?v[w]:[v[w]];for(let b=0,y=D.length;b<y;b++){let M=D[b];if(d(M,w,b,P)===!0){let C=M.__offset,L=Array.isArray(M.value)?M.value:[M.value],U=0;for(let F=0;F<L.length;F++){let W=L[F],J=x(W);typeof W=="number"||typeof W=="boolean"?(M.__data[0]=W,s.bufferSubData(s.UNIFORM_BUFFER,C+U,M.__data)):W.isMatrix3?(M.__data[0]=W.elements[0],M.__data[1]=W.elements[1],M.__data[2]=W.elements[2],M.__data[3]=0,M.__data[4]=W.elements[3],M.__data[5]=W.elements[4],M.__data[6]=W.elements[5],M.__data[7]=0,M.__data[8]=W.elements[6],M.__data[9]=W.elements[7],M.__data[10]=W.elements[8],M.__data[11]=0):(W.toArray(M.__data,U),U+=J.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,C,M.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function d(A,E,v,P){let w=A.value,R=E+"_"+v;if(P[R]===void 0)return typeof w=="number"||typeof w=="boolean"?P[R]=w:P[R]=w.clone(),!0;{let D=P[R];if(typeof w=="number"||typeof w=="boolean"){if(D!==w)return P[R]=w,!0}else if(D.equals(w)===!1)return D.copy(w),!0}return!1}function g(A){let E=A.uniforms,v=0,P=16;for(let R=0,D=E.length;R<D;R++){let b=Array.isArray(E[R])?E[R]:[E[R]];for(let y=0,M=b.length;y<M;y++){let C=b[y],L=Array.isArray(C.value)?C.value:[C.value];for(let U=0,F=L.length;U<F;U++){let W=L[U],J=x(W),I=v%P,Y=I%J.boundary,se=I+Y;v+=Y,se!==0&&P-se<J.storage&&(v+=P-se),C.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),C.__offset=v,v+=J.storage}}}let w=v%P;return w>0&&(v+=P-w),A.__size=v,A.__cache={},this}function x(A){let E={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(E.boundary=4,E.storage=4):A.isVector2?(E.boundary=8,E.storage=8):A.isVector3||A.isColor?(E.boundary=16,E.storage=12):A.isVector4?(E.boundary=16,E.storage=16):A.isMatrix3?(E.boundary=48,E.storage=48):A.isMatrix4?(E.boundary=64,E.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),E}function m(A){let E=A.target;E.removeEventListener("dispose",m);let v=o.indexOf(E.__bindingPointIndex);o.splice(v,1),s.deleteBuffer(i[E.id]),delete i[E.id],delete r[E.id]}function p(){for(let A in i)s.deleteBuffer(i[A]);o=[],i={},r={}}return{bind:l,update:c,dispose:p}}var yo=class{constructor(e={}){let{canvas:t=bd(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;let g=new Uint32Array(4),x=new Int32Array(4),m=null,p=null,A=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=St,this.toneMapping=pi,this.toneMappingExposure=1;let v=this,P=!1,w=0,R=0,D=null,b=-1,y=null,M=new $e,C=new $e,L=null,U=new he(0),F=0,W=t.width,J=t.height,I=1,Y=null,se=null,le=new $e(0,0,W,J),V=new $e(0,0,W,J),Z=!1,O=new or,G=!1,ee=!1,ie=new De,ce=new De,xe=new N,_e=new $e,Xe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ne=!1;function je(){return D===null?I:1}let B=n;function Ze(S,z){return t.getContext(S,z)}try{let S={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r170"),t.addEventListener("webglcontextlost",ne,!1),t.addEventListener("webglcontextrestored",ge,!1),t.addEventListener("webglcontextcreationerror",pe,!1),B===null){let z="webgl2";if(B=Ze(z,S),B===null)throw Ze(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let Ue,Be,Ee,at,Re,T,_,X,te,re,$,we,de,ve,Je,oe,ye,Ie,Le,Me,Ye,He,ut,k;function fe(){Ue=new Ng(B),Ue.init(),He=new fx(B,Ue),Be=new Rg(B,Ue,e,He),Ee=new cx(B,Ue),Be.reverseDepthBuffer&&f&&Ee.buffers.depth.setReversed(!0),at=new Bg(B),Re=new J0,T=new ux(B,Ue,Ee,Re,Be,He,at),_=new Ig(v),X=new Dg(v),te=new Wd(B),ut=new wg(B,te),re=new Ug(B,te,at,ut),$=new Fg(B,re,te,at),Le=new kg(B,Be,T),oe=new Cg(Re),we=new K0(v,_,X,Ue,Be,ut,oe),de=new xx(v,Re),ve=new Q0,Je=new sx(Ue),Ie=new Ag(v,_,X,Ee,$,d,l),ye=new ax(v,$,Be),k=new vx(B,at,Be,Ee),Me=new Tg(B,Ue,at),Ye=new Og(B,Ue,at),at.programs=we.programs,v.capabilities=Be,v.extensions=Ue,v.properties=Re,v.renderLists=ve,v.shadowMap=ye,v.state=Ee,v.info=at}fe();let K=new Bl(v,B);this.xr=K,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){let S=Ue.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){let S=Ue.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return I},this.setPixelRatio=function(S){S!==void 0&&(I=S,this.setSize(W,J,!1))},this.getSize=function(S){return S.set(W,J)},this.setSize=function(S,z,q=!0){if(K.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=S,J=z,t.width=Math.floor(S*I),t.height=Math.floor(z*I),q===!0&&(t.style.width=S+"px",t.style.height=z+"px"),this.setViewport(0,0,S,z)},this.getDrawingBufferSize=function(S){return S.set(W*I,J*I).floor()},this.setDrawingBufferSize=function(S,z,q){W=S,J=z,I=q,t.width=Math.floor(S*q),t.height=Math.floor(z*q),this.setViewport(0,0,S,z)},this.getCurrentViewport=function(S){return S.copy(M)},this.getViewport=function(S){return S.copy(le)},this.setViewport=function(S,z,q,j){S.isVector4?le.set(S.x,S.y,S.z,S.w):le.set(S,z,q,j),Ee.viewport(M.copy(le).multiplyScalar(I).round())},this.getScissor=function(S){return S.copy(V)},this.setScissor=function(S,z,q,j){S.isVector4?V.set(S.x,S.y,S.z,S.w):V.set(S,z,q,j),Ee.scissor(C.copy(V).multiplyScalar(I).round())},this.getScissorTest=function(){return Z},this.setScissorTest=function(S){Ee.setScissorTest(Z=S)},this.setOpaqueSort=function(S){Y=S},this.setTransparentSort=function(S){se=S},this.getClearColor=function(S){return S.copy(Ie.getClearColor())},this.setClearColor=function(){Ie.setClearColor.apply(Ie,arguments)},this.getClearAlpha=function(){return Ie.getClearAlpha()},this.setClearAlpha=function(){Ie.setClearAlpha.apply(Ie,arguments)},this.clear=function(S=!0,z=!0,q=!0){let j=0;if(S){let H=!1;if(D!==null){let ae=D.texture.format;H=ae===lc||ae===ac||ae===oc}if(H){let ae=D.texture.type,me=ae===Yn||ae===zi||ae===sr||ae===xs||ae===sc||ae===rc,be=Ie.getClearColor(),Se=Ie.getClearAlpha(),Oe=be.r,Fe=be.g,Ae=be.b;me?(g[0]=Oe,g[1]=Fe,g[2]=Ae,g[3]=Se,B.clearBufferuiv(B.COLOR,0,g)):(x[0]=Oe,x[1]=Fe,x[2]=Ae,x[3]=Se,B.clearBufferiv(B.COLOR,0,x))}else j|=B.COLOR_BUFFER_BIT}z&&(j|=B.DEPTH_BUFFER_BIT),q&&(j|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(j)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ne,!1),t.removeEventListener("webglcontextrestored",ge,!1),t.removeEventListener("webglcontextcreationerror",pe,!1),ve.dispose(),Je.dispose(),Re.dispose(),_.dispose(),X.dispose(),$.dispose(),ut.dispose(),k.dispose(),we.dispose(),K.dispose(),K.removeEventListener("sessionstart",th),K.removeEventListener("sessionend",nh),Ri.stop()};function ne(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function ge(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;let S=at.autoReset,z=ye.enabled,q=ye.autoUpdate,j=ye.needsUpdate,H=ye.type;fe(),at.autoReset=S,ye.enabled=z,ye.autoUpdate=q,ye.needsUpdate=j,ye.type=H}function pe(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function ke(S){let z=S.target;z.removeEventListener("dispose",ke),yt(z)}function yt(S){Dt(S),Re.remove(S)}function Dt(S){let z=Re.get(S).programs;z!==void 0&&(z.forEach(function(q){we.releaseProgram(q)}),S.isShaderMaterial&&we.releaseShaderCache(S))}this.renderBufferDirect=function(S,z,q,j,H,ae){z===null&&(z=Xe);let me=H.isMesh&&H.matrixWorld.determinant()<0,be=yf(S,z,q,j,H);Ee.setMaterial(j,me);let Se=q.index,Oe=1;if(j.wireframe===!0){if(Se=re.getWireframeAttribute(q),Se===void 0)return;Oe=2}let Fe=q.drawRange,Ae=q.attributes.position,Qe=Fe.start*Oe,ft=(Fe.start+Fe.count)*Oe;ae!==null&&(Qe=Math.max(Qe,ae.start*Oe),ft=Math.min(ft,(ae.start+ae.count)*Oe)),Se!==null?(Qe=Math.max(Qe,0),ft=Math.min(ft,Se.count)):Ae!=null&&(Qe=Math.max(Qe,0),ft=Math.min(ft,Ae.count));let dt=ft-Qe;if(dt<0||dt===1/0)return;ut.setup(H,j,be,q,Se);let Wt,et=Me;if(Se!==null&&(Wt=te.get(Se),et=Ye,et.setIndex(Wt)),H.isMesh)j.wireframe===!0?(Ee.setLineWidth(j.wireframeLinewidth*je()),et.setMode(B.LINES)):et.setMode(B.TRIANGLES);else if(H.isLine){let Te=j.linewidth;Te===void 0&&(Te=1),Ee.setLineWidth(Te*je()),H.isLineSegments?et.setMode(B.LINES):H.isLineLoop?et.setMode(B.LINE_LOOP):et.setMode(B.LINE_STRIP)}else H.isPoints?et.setMode(B.POINTS):H.isSprite&&et.setMode(B.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)et.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(Ue.get("WEBGL_multi_draw"))et.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{let Te=H._multiDrawStarts,On=H._multiDrawCounts,tt=H._multiDrawCount,mn=Se?te.get(Se).bytesPerElement:1,Wi=Re.get(j).currentProgram.getUniforms();for(let Yt=0;Yt<tt;Yt++)Wi.setValue(B,"_gl_DrawID",Yt),et.render(Te[Yt]/mn,On[Yt])}else if(H.isInstancedMesh)et.renderInstances(Qe,dt,H.count);else if(q.isInstancedBufferGeometry){let Te=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,On=Math.min(q.instanceCount,Te);et.renderInstances(Qe,dt,On)}else et.render(Qe,dt)};function st(S,z,q){S.transparent===!0&&S.side===Bt&&S.forceSinglePass===!1?(S.side=kt,S.needsUpdate=!0,Cr(S,z,q),S.side=Ln,S.needsUpdate=!0,Cr(S,z,q),S.side=Bt):Cr(S,z,q)}this.compile=function(S,z,q=null){q===null&&(q=S),p=Je.get(q),p.init(z),E.push(p),q.traverseVisible(function(H){H.isLight&&H.layers.test(z.layers)&&(p.pushLight(H),H.castShadow&&p.pushShadow(H))}),S!==q&&S.traverseVisible(function(H){H.isLight&&H.layers.test(z.layers)&&(p.pushLight(H),H.castShadow&&p.pushShadow(H))}),p.setupLights();let j=new Set;return S.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;let ae=H.material;if(ae)if(Array.isArray(ae))for(let me=0;me<ae.length;me++){let be=ae[me];st(be,q,H),j.add(be)}else st(ae,q,H),j.add(ae)}),E.pop(),p=null,j},this.compileAsync=function(S,z,q=null){let j=this.compile(S,z,q);return new Promise(H=>{function ae(){if(j.forEach(function(me){Re.get(me).currentProgram.isReady()&&j.delete(me)}),j.size===0){H(S);return}setTimeout(ae,10)}Ue.get("KHR_parallel_shader_compile")!==null?ae():setTimeout(ae,10)})};let pn=null;function Un(S){pn&&pn(S)}function th(){Ri.stop()}function nh(){Ri.start()}let Ri=new Wu;Ri.setAnimationLoop(Un),typeof self<"u"&&Ri.setContext(self),this.setAnimationLoop=function(S){pn=S,K.setAnimationLoop(S),S===null?Ri.stop():Ri.start()},K.addEventListener("sessionstart",th),K.addEventListener("sessionend",nh),this.render=function(S,z){if(z!==void 0&&z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),K.enabled===!0&&K.isPresenting===!0&&(K.cameraAutoUpdate===!0&&K.updateCamera(z),z=K.getCamera()),S.isScene===!0&&S.onBeforeRender(v,S,z,D),p=Je.get(S,E.length),p.init(z),E.push(p),ce.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),O.setFromProjectionMatrix(ce),ee=this.localClippingEnabled,G=oe.init(this.clippingPlanes,ee),m=ve.get(S,A.length),m.init(),A.push(m),K.enabled===!0&&K.isPresenting===!0){let ae=v.xr.getDepthSensingMesh();ae!==null&&ra(ae,z,-1/0,v.sortObjects)}ra(S,z,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(Y,se),Ne=K.enabled===!1||K.isPresenting===!1||K.hasDepthSensing()===!1,Ne&&Ie.addToRenderList(m,S),this.info.render.frame++,G===!0&&oe.beginShadows();let q=p.state.shadowsArray;ye.render(q,S,z),G===!0&&oe.endShadows(),this.info.autoReset===!0&&this.info.reset();let j=m.opaque,H=m.transmissive;if(p.setupLights(),z.isArrayCamera){let ae=z.cameras;if(H.length>0)for(let me=0,be=ae.length;me<be;me++){let Se=ae[me];sh(j,H,S,Se)}Ne&&Ie.render(S);for(let me=0,be=ae.length;me<be;me++){let Se=ae[me];ih(m,S,Se,Se.viewport)}}else H.length>0&&sh(j,H,S,z),Ne&&Ie.render(S),ih(m,S,z);D!==null&&(T.updateMultisampleRenderTarget(D),T.updateRenderTargetMipmap(D)),S.isScene===!0&&S.onAfterRender(v,S,z),ut.resetDefaultState(),b=-1,y=null,E.pop(),E.length>0?(p=E[E.length-1],G===!0&&oe.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,A.pop(),A.length>0?m=A[A.length-1]:m=null};function ra(S,z,q,j){if(S.visible===!1)return;if(S.layers.test(z.layers)){if(S.isGroup)q=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(z);else if(S.isLight)p.pushLight(S),S.castShadow&&p.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||O.intersectsSprite(S)){j&&_e.setFromMatrixPosition(S.matrixWorld).applyMatrix4(ce);let me=$.update(S),be=S.material;be.visible&&m.push(S,me,be,q,_e.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||O.intersectsObject(S))){let me=$.update(S),be=S.material;if(j&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),_e.copy(S.boundingSphere.center)):(me.boundingSphere===null&&me.computeBoundingSphere(),_e.copy(me.boundingSphere.center)),_e.applyMatrix4(S.matrixWorld).applyMatrix4(ce)),Array.isArray(be)){let Se=me.groups;for(let Oe=0,Fe=Se.length;Oe<Fe;Oe++){let Ae=Se[Oe],Qe=be[Ae.materialIndex];Qe&&Qe.visible&&m.push(S,me,Qe,q,_e.z,Ae)}}else be.visible&&m.push(S,me,be,q,_e.z,null)}}let ae=S.children;for(let me=0,be=ae.length;me<be;me++)ra(ae[me],z,q,j)}function ih(S,z,q,j){let H=S.opaque,ae=S.transmissive,me=S.transparent;p.setupLightsView(q),G===!0&&oe.setGlobalState(v.clippingPlanes,q),j&&Ee.viewport(M.copy(j)),H.length>0&&Rr(H,z,q),ae.length>0&&Rr(ae,z,q),me.length>0&&Rr(me,z,q),Ee.buffers.depth.setTest(!0),Ee.buffers.depth.setMask(!0),Ee.buffers.color.setMask(!0),Ee.setPolygonOffset(!1)}function sh(S,z,q,j){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[j.id]===void 0&&(p.state.transmissionRenderTarget[j.id]=new Gt(1,1,{generateMipmaps:!0,type:Ue.has("EXT_color_buffer_half_float")||Ue.has("EXT_color_buffer_float")?An:Yn,minFilter:In,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ge.workingColorSpace}));let ae=p.state.transmissionRenderTarget[j.id],me=j.viewport||M;ae.setSize(me.z,me.w);let be=v.getRenderTarget();v.setRenderTarget(ae),v.getClearColor(U),F=v.getClearAlpha(),F<1&&v.setClearColor(16777215,.5),v.clear(),Ne&&Ie.render(q);let Se=v.toneMapping;v.toneMapping=pi;let Oe=j.viewport;if(j.viewport!==void 0&&(j.viewport=void 0),p.setupLightsView(j),G===!0&&oe.setGlobalState(v.clippingPlanes,j),Rr(S,q,j),T.updateMultisampleRenderTarget(ae),T.updateRenderTargetMipmap(ae),Ue.has("WEBGL_multisampled_render_to_texture")===!1){let Fe=!1;for(let Ae=0,Qe=z.length;Ae<Qe;Ae++){let ft=z[Ae],dt=ft.object,Wt=ft.geometry,et=ft.material,Te=ft.group;if(et.side===Bt&&dt.layers.test(j.layers)){let On=et.side;et.side=kt,et.needsUpdate=!0,rh(dt,q,j,Wt,et,Te),et.side=On,et.needsUpdate=!0,Fe=!0}}Fe===!0&&(T.updateMultisampleRenderTarget(ae),T.updateRenderTargetMipmap(ae))}v.setRenderTarget(be),v.setClearColor(U,F),Oe!==void 0&&(j.viewport=Oe),v.toneMapping=Se}function Rr(S,z,q){let j=z.isScene===!0?z.overrideMaterial:null;for(let H=0,ae=S.length;H<ae;H++){let me=S[H],be=me.object,Se=me.geometry,Oe=j===null?me.material:j,Fe=me.group;be.layers.test(q.layers)&&rh(be,z,q,Se,Oe,Fe)}}function rh(S,z,q,j,H,ae){S.onBeforeRender(v,z,q,j,H,ae),S.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),H.onBeforeRender(v,z,q,j,S,ae),H.transparent===!0&&H.side===Bt&&H.forceSinglePass===!1?(H.side=kt,H.needsUpdate=!0,v.renderBufferDirect(q,z,j,H,S,ae),H.side=Ln,H.needsUpdate=!0,v.renderBufferDirect(q,z,j,H,S,ae),H.side=Bt):v.renderBufferDirect(q,z,j,H,S,ae),S.onAfterRender(v,z,q,j,H,ae)}function Cr(S,z,q){z.isScene!==!0&&(z=Xe);let j=Re.get(S),H=p.state.lights,ae=p.state.shadowsArray,me=H.state.version,be=we.getParameters(S,H.state,ae,z,q),Se=we.getProgramCacheKey(be),Oe=j.programs;j.environment=S.isMeshStandardMaterial?z.environment:null,j.fog=z.fog,j.envMap=(S.isMeshStandardMaterial?X:_).get(S.envMap||j.environment),j.envMapRotation=j.environment!==null&&S.envMap===null?z.environmentRotation:S.envMapRotation,Oe===void 0&&(S.addEventListener("dispose",ke),Oe=new Map,j.programs=Oe);let Fe=Oe.get(Se);if(Fe!==void 0){if(j.currentProgram===Fe&&j.lightsStateVersion===me)return ah(S,be),Fe}else be.uniforms=we.getUniforms(S),S.onBeforeCompile(be,v),Fe=we.acquireProgram(be,Se),Oe.set(Se,Fe),j.uniforms=be.uniforms;let Ae=j.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Ae.clippingPlanes=oe.uniform),ah(S,be),j.needsLights=_f(S),j.lightsStateVersion=me,j.needsLights&&(Ae.ambientLightColor.value=H.state.ambient,Ae.lightProbe.value=H.state.probe,Ae.directionalLights.value=H.state.directional,Ae.directionalLightShadows.value=H.state.directionalShadow,Ae.spotLights.value=H.state.spot,Ae.spotLightShadows.value=H.state.spotShadow,Ae.rectAreaLights.value=H.state.rectArea,Ae.ltc_1.value=H.state.rectAreaLTC1,Ae.ltc_2.value=H.state.rectAreaLTC2,Ae.pointLights.value=H.state.point,Ae.pointLightShadows.value=H.state.pointShadow,Ae.hemisphereLights.value=H.state.hemi,Ae.directionalShadowMap.value=H.state.directionalShadowMap,Ae.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Ae.spotShadowMap.value=H.state.spotShadowMap,Ae.spotLightMatrix.value=H.state.spotLightMatrix,Ae.spotLightMap.value=H.state.spotLightMap,Ae.pointShadowMap.value=H.state.pointShadowMap,Ae.pointShadowMatrix.value=H.state.pointShadowMatrix),j.currentProgram=Fe,j.uniformsList=null,Fe}function oh(S){if(S.uniformsList===null){let z=S.currentProgram.getUniforms();S.uniformsList=ds.seqWithValue(z.seq,S.uniforms)}return S.uniformsList}function ah(S,z){let q=Re.get(S);q.outputColorSpace=z.outputColorSpace,q.batching=z.batching,q.batchingColor=z.batchingColor,q.instancing=z.instancing,q.instancingColor=z.instancingColor,q.instancingMorph=z.instancingMorph,q.skinning=z.skinning,q.morphTargets=z.morphTargets,q.morphNormals=z.morphNormals,q.morphColors=z.morphColors,q.morphTargetsCount=z.morphTargetsCount,q.numClippingPlanes=z.numClippingPlanes,q.numIntersection=z.numClipIntersection,q.vertexAlphas=z.vertexAlphas,q.vertexTangents=z.vertexTangents,q.toneMapping=z.toneMapping}function yf(S,z,q,j,H){z.isScene!==!0&&(z=Xe),T.resetTextureUnits();let ae=z.fog,me=j.isMeshStandardMaterial?z.environment:null,be=D===null?v.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:Ft,Se=(j.isMeshStandardMaterial?X:_).get(j.envMap||me),Oe=j.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Fe=!!q.attributes.tangent&&(!!j.normalMap||j.anisotropy>0),Ae=!!q.morphAttributes.position,Qe=!!q.morphAttributes.normal,ft=!!q.morphAttributes.color,dt=pi;j.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(dt=v.toneMapping);let Wt=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,et=Wt!==void 0?Wt.length:0,Te=Re.get(j),On=p.state.lights;if(G===!0&&(ee===!0||S!==y)){let nn=S===y&&j.id===b;oe.setState(j,S,nn)}let tt=!1;j.version===Te.__version?(Te.needsLights&&Te.lightsStateVersion!==On.state.version||Te.outputColorSpace!==be||H.isBatchedMesh&&Te.batching===!1||!H.isBatchedMesh&&Te.batching===!0||H.isBatchedMesh&&Te.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Te.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Te.instancing===!1||!H.isInstancedMesh&&Te.instancing===!0||H.isSkinnedMesh&&Te.skinning===!1||!H.isSkinnedMesh&&Te.skinning===!0||H.isInstancedMesh&&Te.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Te.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Te.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Te.instancingMorph===!1&&H.morphTexture!==null||Te.envMap!==Se||j.fog===!0&&Te.fog!==ae||Te.numClippingPlanes!==void 0&&(Te.numClippingPlanes!==oe.numPlanes||Te.numIntersection!==oe.numIntersection)||Te.vertexAlphas!==Oe||Te.vertexTangents!==Fe||Te.morphTargets!==Ae||Te.morphNormals!==Qe||Te.morphColors!==ft||Te.toneMapping!==dt||Te.morphTargetsCount!==et)&&(tt=!0):(tt=!0,Te.__version=j.version);let mn=Te.currentProgram;tt===!0&&(mn=Cr(j,z,H));let Wi=!1,Yt=!1,Hs=!1,pt=mn.getUniforms(),Rn=Te.uniforms;if(Ee.useProgram(mn.program)&&(Wi=!0,Yt=!0,Hs=!0),j.id!==b&&(b=j.id,Yt=!0),Wi||y!==S){Ee.buffers.depth.getReversed()?(ie.copy(S.projectionMatrix),Ad(ie),wd(ie),pt.setValue(B,"projectionMatrix",ie)):pt.setValue(B,"projectionMatrix",S.projectionMatrix),pt.setValue(B,"viewMatrix",S.matrixWorldInverse);let si=pt.map.cameraPosition;si!==void 0&&si.setValue(B,xe.setFromMatrixPosition(S.matrixWorld)),Be.logarithmicDepthBuffer&&pt.setValue(B,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(j.isMeshPhongMaterial||j.isMeshToonMaterial||j.isMeshLambertMaterial||j.isMeshBasicMaterial||j.isMeshStandardMaterial||j.isShaderMaterial)&&pt.setValue(B,"isOrthographic",S.isOrthographicCamera===!0),y!==S&&(y=S,Yt=!0,Hs=!0)}if(H.isSkinnedMesh){pt.setOptional(B,H,"bindMatrix"),pt.setOptional(B,H,"bindMatrixInverse");let nn=H.skeleton;nn&&(nn.boneTexture===null&&nn.computeBoneTexture(),pt.setValue(B,"boneTexture",nn.boneTexture,T))}H.isBatchedMesh&&(pt.setOptional(B,H,"batchingTexture"),pt.setValue(B,"batchingTexture",H._matricesTexture,T),pt.setOptional(B,H,"batchingIdTexture"),pt.setValue(B,"batchingIdTexture",H._indirectTexture,T),pt.setOptional(B,H,"batchingColorTexture"),H._colorsTexture!==null&&pt.setValue(B,"batchingColorTexture",H._colorsTexture,T));let Vs=q.morphAttributes;if((Vs.position!==void 0||Vs.normal!==void 0||Vs.color!==void 0)&&Le.update(H,q,mn),(Yt||Te.receiveShadow!==H.receiveShadow)&&(Te.receiveShadow=H.receiveShadow,pt.setValue(B,"receiveShadow",H.receiveShadow)),j.isMeshGouraudMaterial&&j.envMap!==null&&(Rn.envMap.value=Se,Rn.flipEnvMap.value=Se.isCubeTexture&&Se.isRenderTargetTexture===!1?-1:1),j.isMeshStandardMaterial&&j.envMap===null&&z.environment!==null&&(Rn.envMapIntensity.value=z.environmentIntensity),Yt&&(pt.setValue(B,"toneMappingExposure",v.toneMappingExposure),Te.needsLights&&Mf(Rn,Hs),ae&&j.fog===!0&&de.refreshFogUniforms(Rn,ae),de.refreshMaterialUniforms(Rn,j,I,J,p.state.transmissionRenderTarget[S.id]),ds.upload(B,oh(Te),Rn,T)),j.isShaderMaterial&&j.uniformsNeedUpdate===!0&&(ds.upload(B,oh(Te),Rn,T),j.uniformsNeedUpdate=!1),j.isSpriteMaterial&&pt.setValue(B,"center",H.center),pt.setValue(B,"modelViewMatrix",H.modelViewMatrix),pt.setValue(B,"normalMatrix",H.normalMatrix),pt.setValue(B,"modelMatrix",H.matrixWorld),j.isShaderMaterial||j.isRawShaderMaterial){let nn=j.uniformsGroups;for(let si=0,ri=nn.length;si<ri;si++){let lh=nn[si];k.update(lh,mn),k.bind(lh,mn)}}return mn}function Mf(S,z){S.ambientLightColor.needsUpdate=z,S.lightProbe.needsUpdate=z,S.directionalLights.needsUpdate=z,S.directionalLightShadows.needsUpdate=z,S.pointLights.needsUpdate=z,S.pointLightShadows.needsUpdate=z,S.spotLights.needsUpdate=z,S.spotLightShadows.needsUpdate=z,S.rectAreaLights.needsUpdate=z,S.hemisphereLights.needsUpdate=z}function _f(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(S,z,q){Re.get(S.texture).__webglTexture=z,Re.get(S.depthTexture).__webglTexture=q;let j=Re.get(S);j.__hasExternalTextures=!0,j.__autoAllocateDepthBuffer=q===void 0,j.__autoAllocateDepthBuffer||Ue.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),j.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(S,z){let q=Re.get(S);q.__webglFramebuffer=z,q.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(S,z=0,q=0){D=S,w=z,R=q;let j=!0,H=null,ae=!1,me=!1;if(S){let Se=Re.get(S);if(Se.__useDefaultFramebuffer!==void 0)Ee.bindFramebuffer(B.FRAMEBUFFER,null),j=!1;else if(Se.__webglFramebuffer===void 0)T.setupRenderTarget(S);else if(Se.__hasExternalTextures)T.rebindTextures(S,Re.get(S.texture).__webglTexture,Re.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){let Ae=S.depthTexture;if(Se.__boundDepthTexture!==Ae){if(Ae!==null&&Re.has(Ae)&&(S.width!==Ae.image.width||S.height!==Ae.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");T.setupDepthRenderbuffer(S)}}let Oe=S.texture;(Oe.isData3DTexture||Oe.isDataArrayTexture||Oe.isCompressedArrayTexture)&&(me=!0);let Fe=Re.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Fe[z])?H=Fe[z][q]:H=Fe[z],ae=!0):S.samples>0&&T.useMultisampledRTT(S)===!1?H=Re.get(S).__webglMultisampledFramebuffer:Array.isArray(Fe)?H=Fe[q]:H=Fe,M.copy(S.viewport),C.copy(S.scissor),L=S.scissorTest}else M.copy(le).multiplyScalar(I).floor(),C.copy(V).multiplyScalar(I).floor(),L=Z;if(Ee.bindFramebuffer(B.FRAMEBUFFER,H)&&j&&Ee.drawBuffers(S,H),Ee.viewport(M),Ee.scissor(C),Ee.setScissorTest(L),ae){let Se=Re.get(S.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+z,Se.__webglTexture,q)}else if(me){let Se=Re.get(S.texture),Oe=z||0;B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,Se.__webglTexture,q||0,Oe)}b=-1},this.readRenderTargetPixels=function(S,z,q,j,H,ae,me){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let be=Re.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&me!==void 0&&(be=be[me]),be){Ee.bindFramebuffer(B.FRAMEBUFFER,be);try{let Se=S.texture,Oe=Se.format,Fe=Se.type;if(!Be.textureFormatReadable(Oe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Be.textureTypeReadable(Fe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=S.width-j&&q>=0&&q<=S.height-H&&B.readPixels(z,q,j,H,He.convert(Oe),He.convert(Fe),ae)}finally{let Se=D!==null?Re.get(D).__webglFramebuffer:null;Ee.bindFramebuffer(B.FRAMEBUFFER,Se)}}},this.readRenderTargetPixelsAsync=async function(S,z,q,j,H,ae,me){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let be=Re.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&me!==void 0&&(be=be[me]),be){let Se=S.texture,Oe=Se.format,Fe=Se.type;if(!Be.textureFormatReadable(Oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Be.textureTypeReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(z>=0&&z<=S.width-j&&q>=0&&q<=S.height-H){Ee.bindFramebuffer(B.FRAMEBUFFER,be);let Ae=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,Ae),B.bufferData(B.PIXEL_PACK_BUFFER,ae.byteLength,B.STREAM_READ),B.readPixels(z,q,j,H,He.convert(Oe),He.convert(Fe),0);let Qe=D!==null?Re.get(D).__webglFramebuffer:null;Ee.bindFramebuffer(B.FRAMEBUFFER,Qe);let ft=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await Sd(B,ft,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,Ae),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,ae),B.deleteBuffer(Ae),B.deleteSync(ft),ae}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(S,z=null,q=0){S.isTexture!==!0&&(Zs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),z=arguments[0]||null,S=arguments[1]);let j=Math.pow(2,-q),H=Math.floor(S.image.width*j),ae=Math.floor(S.image.height*j),me=z!==null?z.x:0,be=z!==null?z.y:0;T.setTexture2D(S,0),B.copyTexSubImage2D(B.TEXTURE_2D,q,0,0,me,be,H,ae),Ee.unbindTexture()},this.copyTextureToTexture=function(S,z,q=null,j=null,H=0){S.isTexture!==!0&&(Zs("WebGLRenderer: copyTextureToTexture function signature has changed."),j=arguments[0]||null,S=arguments[1],z=arguments[2],H=arguments[3]||0,q=null);let ae,me,be,Se,Oe,Fe,Ae,Qe,ft,dt=S.isCompressedTexture?S.mipmaps[H]:S.image;q!==null?(ae=q.max.x-q.min.x,me=q.max.y-q.min.y,be=q.isBox3?q.max.z-q.min.z:1,Se=q.min.x,Oe=q.min.y,Fe=q.isBox3?q.min.z:0):(ae=dt.width,me=dt.height,be=dt.depth||1,Se=0,Oe=0,Fe=0),j!==null?(Ae=j.x,Qe=j.y,ft=j.z):(Ae=0,Qe=0,ft=0);let Wt=He.convert(z.format),et=He.convert(z.type),Te;z.isData3DTexture?(T.setTexture3D(z,0),Te=B.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(T.setTexture2DArray(z,0),Te=B.TEXTURE_2D_ARRAY):(T.setTexture2D(z,0),Te=B.TEXTURE_2D),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,z.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,z.unpackAlignment);let On=B.getParameter(B.UNPACK_ROW_LENGTH),tt=B.getParameter(B.UNPACK_IMAGE_HEIGHT),mn=B.getParameter(B.UNPACK_SKIP_PIXELS),Wi=B.getParameter(B.UNPACK_SKIP_ROWS),Yt=B.getParameter(B.UNPACK_SKIP_IMAGES);B.pixelStorei(B.UNPACK_ROW_LENGTH,dt.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,dt.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,Se),B.pixelStorei(B.UNPACK_SKIP_ROWS,Oe),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Fe);let Hs=S.isDataArrayTexture||S.isData3DTexture,pt=z.isDataArrayTexture||z.isData3DTexture;if(S.isRenderTargetTexture||S.isDepthTexture){let Rn=Re.get(S),Vs=Re.get(z),nn=Re.get(Rn.__renderTarget),si=Re.get(Vs.__renderTarget);Ee.bindFramebuffer(B.READ_FRAMEBUFFER,nn.__webglFramebuffer),Ee.bindFramebuffer(B.DRAW_FRAMEBUFFER,si.__webglFramebuffer);for(let ri=0;ri<be;ri++)Hs&&B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Re.get(S).__webglTexture,H,Fe+ri),S.isDepthTexture?(pt&&B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Re.get(z).__webglTexture,H,ft+ri),B.blitFramebuffer(Se,Oe,ae,me,Ae,Qe,ae,me,B.DEPTH_BUFFER_BIT,B.NEAREST)):pt?B.copyTexSubImage3D(Te,H,Ae,Qe,ft+ri,Se,Oe,ae,me):B.copyTexSubImage2D(Te,H,Ae,Qe,ft+ri,Se,Oe,ae,me);Ee.bindFramebuffer(B.READ_FRAMEBUFFER,null),Ee.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else pt?S.isDataTexture||S.isData3DTexture?B.texSubImage3D(Te,H,Ae,Qe,ft,ae,me,be,Wt,et,dt.data):z.isCompressedArrayTexture?B.compressedTexSubImage3D(Te,H,Ae,Qe,ft,ae,me,be,Wt,dt.data):B.texSubImage3D(Te,H,Ae,Qe,ft,ae,me,be,Wt,et,dt):S.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,H,Ae,Qe,ae,me,Wt,et,dt.data):S.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,H,Ae,Qe,dt.width,dt.height,Wt,dt.data):B.texSubImage2D(B.TEXTURE_2D,H,Ae,Qe,ae,me,Wt,et,dt);B.pixelStorei(B.UNPACK_ROW_LENGTH,On),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,tt),B.pixelStorei(B.UNPACK_SKIP_PIXELS,mn),B.pixelStorei(B.UNPACK_SKIP_ROWS,Wi),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Yt),H===0&&z.generateMipmaps&&B.generateMipmap(Te),Ee.unbindTexture()},this.copyTextureToTexture3D=function(S,z,q=null,j=null,H=0){return S.isTexture!==!0&&(Zs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),q=arguments[0]||null,j=arguments[1]||null,S=arguments[2],z=arguments[3],H=arguments[4]||0),Zs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(S,z,q,j,H)},this.initRenderTarget=function(S){Re.get(S).__webglFramebuffer===void 0&&T.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?T.setTextureCube(S,0):S.isData3DTexture?T.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?T.setTexture2DArray(S,0):T.setTexture2D(S,0),Ee.unbindTexture()},this.resetState=function(){w=0,R=0,D=null,Ee.reset(),ut.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return qn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=Ge._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ge._getUnpackColorSpace()}},Mo=class s{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new he(e),this.density=t}clone(){return new s(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var As=class extends xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new on,this.environmentIntensity=1,this.environmentRotation=new on,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},ar=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=_l,this.updateRanges=[],this.version=0,this.uuid=_n()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=_n()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=_n()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Ht=new N,lr=class s{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ht.fromBufferAttribute(this,t),Ht.applyMatrix4(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ht.fromBufferAttribute(this,t),Ht.applyNormalMatrix(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ht.fromBufferAttribute(this,t),Ht.transformDirection(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=yn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=rt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=yn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=yn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=yn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=yn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array),i=rt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array),i=rt(i,this.array),r=rt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new gt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new s(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}};var ou=new N,au=new $e,lu=new $e,yx=new N,cu=new De,Jr=new N,Da=new Zt,hu=new De,Na=new Es,_o=class extends Q{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=fh,this.bindMatrix=new De,this.bindMatrixInverse=new De,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new jt),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Jr),this.boundingBox.expandByPoint(Jr)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Zt),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Jr),this.boundingSphere.expandByPoint(Jr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Da.copy(this.boundingSphere),Da.applyMatrix4(i),e.ray.intersectsSphere(Da)!==!1&&(hu.copy(i).invert(),Na.copy(e.ray).applyMatrix4(hu),!(this.boundingBox!==null&&Na.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Na)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new $e,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===fh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===qf?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,i=this.geometry;au.fromBufferAttribute(i.attributes.skinIndex,e),lu.fromBufferAttribute(i.attributes.skinWeight,e),ou.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){let o=lu.getComponent(r);if(o!==0){let a=au.getComponent(r);cu.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(yx.copy(ou).applyMatrix4(cu),o)}}return t.applyMatrix4(this.bindMatrixInverse)}},cr=class extends xt{constructor(){super(),this.isBone=!0,this.type="Bone"}},ws=class extends Lt{constructor(e=null,t=1,n=1,i,r,o,a,l,c=Pt,h=Pt,u,f){super(null,o,a,l,c,h,i,r,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},uu=new De,Mx=new De,Eo=class s{constructor(e=[],t=[]){this.uuid=_n(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new De)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new De;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,o=e.length;r<o;r++){let a=e[r]?e[r].matrixWorld:Mx;uu.multiplyMatrices(a,t[r]),uu.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new s(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new ws(t,e,e,rn,Mn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){let r=e.bones[n],o=t[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new cr),this.bones.push(o),this.boneInverses.push(new De().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){let o=t[i];e.bones.push(o.uuid);let a=n[i];e.boneInverses.push(a.toArray())}return e}},an=class extends gt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},rs=new De,fu=new De,Zr=[],du=new jt,_x=new De,js=new Q,Ys=new Zt,En=class extends Q{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new an(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,_x)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new jt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,rs),du.copy(e.boundingBox).applyMatrix4(rs),this.boundingBox.union(du)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Zt),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,rs),Ys.copy(e.boundingSphere).applyMatrix4(rs),this.boundingSphere.union(Ys)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(e,t){let n=this.matrixWorld,i=this.count;if(js.geometry=this.geometry,js.material=this.material,js.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ys.copy(this.boundingSphere),Ys.applyMatrix4(n),e.ray.intersectsSphere(Ys)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,rs),fu.multiplyMatrices(n,rs),js.matrixWorld=fu,js.raycast(e,Zr);for(let o=0,a=Zr.length;o<a;o++){let l=Zr[o];l.instanceId=r,l.object=this,t.push(l)}Zr.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new an(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new ws(new Float32Array(i*this.count),i,this.count,gr,Mn));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=i*e;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}};var hr=class extends Qt{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new he(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},bo=new N,So=new N,pu=new De,Ks=new Es,Qr=new Zt,Ua=new N,mu=new N,Ts=class extends xt{constructor(e=new Mt,t=new hr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)bo.fromBufferAttribute(t,i-1),So.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=bo.distanceTo(So);e.setAttribute("lineDistance",new it(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Qr.copy(n.boundingSphere),Qr.applyMatrix4(i),Qr.radius+=r,e.ray.intersectsSphere(Qr)===!1)return;pu.copy(i).invert(),Ks.copy(e.ray).applyMatrix4(pu);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){let d=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let x=d,m=g-1;x<m;x+=c){let p=h.getX(x),A=h.getX(x+1),E=$r(this,e,Ks,l,p,A);E&&t.push(E)}if(this.isLineLoop){let x=h.getX(g-1),m=h.getX(d),p=$r(this,e,Ks,l,x,m);p&&t.push(p)}}else{let d=Math.max(0,o.start),g=Math.min(f.count,o.start+o.count);for(let x=d,m=g-1;x<m;x+=c){let p=$r(this,e,Ks,l,x,x+1);p&&t.push(p)}if(this.isLineLoop){let x=$r(this,e,Ks,l,g-1,d);x&&t.push(x)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function $r(s,e,t,n,i,r){let o=s.geometry.attributes.position;if(bo.fromBufferAttribute(o,i),So.fromBufferAttribute(o,r),t.distanceSqToSegment(bo,So,Ua,mu)>n)return;Ua.applyMatrix4(s.matrixWorld);let l=e.ray.origin.distanceTo(Ua);if(!(l<e.near||l>e.far))return{distance:l,point:mu.clone().applyMatrix4(s.matrixWorld),index:i,face:null,faceIndex:null,barycoord:null,object:s}}var gu=new N,xu=new N,Ao=class extends Ts{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)gu.fromBufferAttribute(t,i),xu.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+gu.distanceTo(xu);e.setAttribute("lineDistance",new it(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},wo=class extends Ts{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},ur=class extends Qt{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new he(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},vu=new De,kl=new Es,eo=new Zt,to=new N,Rs=class extends xt{constructor(e=new Mt,t=new ur){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),eo.copy(n.boundingSphere),eo.applyMatrix4(i),eo.radius+=r,e.ray.intersectsSphere(eo)===!1)return;vu.copy(i).invert(),kl.copy(e.ray).applyMatrix4(vu);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){let f=Math.max(0,o.start),d=Math.min(c.count,o.start+o.count);for(let g=f,x=d;g<x;g++){let m=c.getX(g);to.fromBufferAttribute(u,m),yu(to,m,l,i,e,t,this)}}else{let f=Math.max(0,o.start),d=Math.min(u.count,o.start+o.count);for(let g=f,x=d;g<x;g++)to.fromBufferAttribute(u,g),yu(to,g,l,i,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function yu(s,e,t,n,i,r,o){let a=kl.distanceSqToPoint(s);if(a<t){let l=new N;kl.closestPointToPoint(s,l),l.applyMatrix4(n);let c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var To=class extends Lt{constructor(e,t,n,i,r,o,a,l,c){super(e,t,n,i,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var ln=class s extends Mt{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);let r=[],o=[],a=[],l=[],c=new N,h=new Ce;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,f=3;u<=t;u++,f+=3){let d=n+u/t*i;c.x=e*Math.cos(d),c.y=e*Math.sin(d),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[f]/e+1)/2,h.y=(o[f+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new it(o,3)),this.setAttribute("normal",new it(a,3)),this.setAttribute("uv",new it(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radius,e.segments,e.thetaStart,e.thetaLength)}},vt=class s extends Mt{constructor(e=1,t=1,n=1,i=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;i=Math.floor(i),r=Math.floor(r);let h=[],u=[],f=[],d=[],g=0,x=[],m=n/2,p=0;A(),o===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(h),this.setAttribute("position",new it(u,3)),this.setAttribute("normal",new it(f,3)),this.setAttribute("uv",new it(d,2));function A(){let v=new N,P=new N,w=0,R=(t-e)/n;for(let D=0;D<=r;D++){let b=[],y=D/r,M=y*(t-e)+e;for(let C=0;C<=i;C++){let L=C/i,U=L*l+a,F=Math.sin(U),W=Math.cos(U);P.x=M*F,P.y=-y*n+m,P.z=M*W,u.push(P.x,P.y,P.z),v.set(F,R,W).normalize(),f.push(v.x,v.y,v.z),d.push(L,1-y),b.push(g++)}x.push(b)}for(let D=0;D<i;D++)for(let b=0;b<r;b++){let y=x[b][D],M=x[b+1][D],C=x[b+1][D+1],L=x[b][D+1];(e>0||b!==0)&&(h.push(y,M,L),w+=3),(t>0||b!==r-1)&&(h.push(M,C,L),w+=3)}c.addGroup(p,w,0),p+=w}function E(v){let P=g,w=new Ce,R=new N,D=0,b=v===!0?e:t,y=v===!0?1:-1;for(let C=1;C<=i;C++)u.push(0,m*y,0),f.push(0,y,0),d.push(.5,.5),g++;let M=g;for(let C=0;C<=i;C++){let U=C/i*l+a,F=Math.cos(U),W=Math.sin(U);R.x=b*W,R.y=m*y,R.z=b*F,u.push(R.x,R.y,R.z),f.push(0,y,0),w.x=F*.5+.5,w.y=W*.5*y+.5,d.push(w.x,w.y),g++}for(let C=0;C<i;C++){let L=P+C,U=M+C;v===!0?h.push(U,U+1,L):h.push(U+1,U,L),D+=3}c.addGroup(p,D,v===!0?1:2),p+=D}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},fr=class s extends vt{constructor(e=1,t=1,n=32,i=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,i,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new s(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var Jn=class s extends Mt{constructor(e=.5,t=1,n=32,i=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:o},n=Math.max(3,n),i=Math.max(1,i);let a=[],l=[],c=[],h=[],u=e,f=(t-e)/i,d=new N,g=new Ce;for(let x=0;x<=i;x++){for(let m=0;m<=n;m++){let p=r+m/n*o;d.x=u*Math.cos(p),d.y=u*Math.sin(p),l.push(d.x,d.y,d.z),c.push(0,0,1),g.x=(d.x/t+1)/2,g.y=(d.y/t+1)/2,h.push(g.x,g.y)}u+=f}for(let x=0;x<i;x++){let m=x*(n+1);for(let p=0;p<n;p++){let A=p+m,E=A,v=A+n+1,P=A+n+2,w=A+1;a.push(E,v,w),a.push(v,P,w)}}this.setIndex(a),this.setAttribute("position",new it(l,3)),this.setAttribute("normal",new it(c,3)),this.setAttribute("uv",new it(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var Zn=class s extends Mt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new N,f=new N,d=[],g=[],x=[],m=[];for(let p=0;p<=n;p++){let A=[],E=p/n,v=0;p===0&&o===0?v=.5/t:p===n&&l===Math.PI&&(v=-.5/t);for(let P=0;P<=t;P++){let w=P/t;u.x=-e*Math.cos(i+w*r)*Math.sin(o+E*a),u.y=e*Math.cos(o+E*a),u.z=e*Math.sin(i+w*r)*Math.sin(o+E*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),x.push(f.x,f.y,f.z),m.push(w+v,1-E),A.push(c++)}h.push(A)}for(let p=0;p<n;p++)for(let A=0;A<t;A++){let E=h[p][A+1],v=h[p][A],P=h[p+1][A],w=h[p+1][A+1];(p!==0||o>0)&&d.push(E,v,w),(p!==n-1||l<Math.PI)&&d.push(v,P,w)}this.setIndex(d),this.setAttribute("position",new it(g,3)),this.setAttribute("normal",new it(x,3)),this.setAttribute("uv",new it(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var gi=class s extends Mt{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);let o=[],a=[],l=[],c=[],h=new N,u=new N,f=new N;for(let d=0;d<=n;d++)for(let g=0;g<=i;g++){let x=g/i*r,m=d/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(x),u.y=(e+t*Math.cos(m))*Math.sin(x),u.z=t*Math.sin(m),a.push(u.x,u.y,u.z),h.x=e*Math.cos(x),h.y=e*Math.sin(x),f.subVectors(u,h).normalize(),l.push(f.x,f.y,f.z),c.push(g/i),c.push(d/n)}for(let d=1;d<=n;d++)for(let g=1;g<=i;g++){let x=(i+1)*d+g-1,m=(i+1)*(d-1)+g-1,p=(i+1)*(d-1)+g,A=(i+1)*d+g;o.push(x,m,A),o.push(m,p,A)}this.setIndex(o),this.setAttribute("position",new it(a,3)),this.setAttribute("normal",new it(l,3)),this.setAttribute("uv",new it(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Ro=class extends ct{static get type(){return"RawShaderMaterial"}constructor(e){super(e),this.isRawShaderMaterial=!0}},ot=class extends Qt{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new he(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new he(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ku,this.normalScale=new Ce(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},en=class extends ot{static get type(){return"MeshPhysicalMaterial"}constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ce(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ot(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new he(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new he(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new he(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};function no(s,e,t){return!s||!t&&s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function Ex(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function bx(s){function e(i,r){return s[i]-s[r]}let t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Mu(s,e,t){let n=s.length,i=new s.constructor(n);for(let r=0,o=0;o!==n;++r){let a=t[r]*e;for(let l=0;l!==e;++l)i[o++]=s[a+l]}return i}function Ku(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push.apply(t,o)),r=s[i++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=s[i++];while(r!==void 0)}var xi=class{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],r=t[n-1];e:{t:{let o;n:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=t[++n],e<i)break t}o=t.length;break n}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=t[--n-1],e>=r)break t}o=n,n=0;break n}break e}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let o=0;o!==i;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Fl=class extends xi{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:as,endingEnd:as}}intervalChanged_(e,t,n){let i=this.parameterPositions,r=e-2,o=e+1,a=i[r],l=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case ls:r=e,a=2*t-n;break;case lo:r=i.length-2,a=t+i[r]-i[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case ls:o=e,l=2*n-t;break;case lo:o=1,l=n+i[1]-i[0];break;default:o=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,d=this._weightNext,g=(n-t)/(i-t),x=g*g,m=x*g,p=-f*m+2*f*x-f*g,A=(1+f)*m+(-1.5-2*f)*x+(-.5+f)*g+1,E=(-1-d)*m+(1.5+d)*x+.5*g,v=d*m-d*x;for(let P=0;P!==a;++P)r[P]=p*o[h+P]+A*o[c+P]+E*o[l+P]+v*o[u+P];return r}},Co=class extends xi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(i-t),u=1-h;for(let f=0;f!==a;++f)r[f]=o[c+f]*u+o[l+f]*h;return r}},zl=class extends xi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},cn=class{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=no(t,this.TimeBufferType),this.values=no(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:no(e.times,Array),values:no(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new zl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Co(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Fl(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case ys:t=this.InterpolantFactoryMethodDiscrete;break;case Ms:t=this.InterpolantFactoryMethodLinear;break;case oa:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ys;case this.InterpolantFactoryMethodLinear:return Ms;case this.InterpolantFactoryMethodSmooth:return oa}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){let n=this.times,i=n.length,r=0,o=i-1;for(;r!==i&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(i!==void 0&&Ex(i))for(let a=0,l=i.length;a!==l;++a){let c=i[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===oa,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(i)l=!0;else{let u=a*n,f=u-n,d=u+n;for(let g=0;g!==n;++g){let x=t[u+g];if(x!==t[f+g]||x!==t[d+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let u=a*n,f=o*n;for(let d=0;d!==n;++d)t[f+d]=t[u+d]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}};cn.prototype.TimeBufferType=Float32Array;cn.prototype.ValueBufferType=Float32Array;cn.prototype.DefaultInterpolation=Ms;var vi=class extends cn{constructor(e,t,n){super(e,t,n)}};vi.prototype.ValueTypeName="bool";vi.prototype.ValueBufferType=Array;vi.prototype.DefaultInterpolation=ys;vi.prototype.InterpolantFactoryMethodLinear=void 0;vi.prototype.InterpolantFactoryMethodSmooth=void 0;var Io=class extends cn{};Io.prototype.ValueTypeName="color";var Qn=class extends cn{};Qn.prototype.ValueTypeName="number";var Hl=class extends xi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(i-t),c=e*a;for(let h=c+a;c!==h;c+=4)Tt.slerpFlat(r,0,o,c-a,o,c,l);return r}},bn=class extends cn{InterpolantFactoryMethodLinear(e){return new Hl(this.times,this.values,this.getValueSize(),e)}};bn.prototype.ValueTypeName="quaternion";bn.prototype.InterpolantFactoryMethodSmooth=void 0;var yi=class extends cn{constructor(e,t,n){super(e,t,n)}};yi.prototype.ValueTypeName="string";yi.prototype.ValueBufferType=Array;yi.prototype.DefaultInterpolation=ys;yi.prototype.InterpolantFactoryMethodLinear=void 0;yi.prototype.InterpolantFactoryMethodSmooth=void 0;var Sn=class extends cn{};Sn.prototype.ValueTypeName="vector";var Mi=class{constructor(e="",t=-1,n=[],i=cc){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=_n(),this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,i=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(Ax(n[o]).scale(i));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r}static toJSON(e){let t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let r=0,o=n.length;r!==o;++r)t.push(cn.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){let r=t.length,o=[];for(let a=0;a<r;a++){let l=[],c=[];l.push((a+r-1)%r,a,(a+1)%r),c.push(0,1,0);let h=bx(l);l=Mu(l,1,h),c=Mu(c,1,h),!i&&l[0]===0&&(l.push(r),c.push(c[0])),o.push(new Qn(".morphTargetInfluences["+t[a].name+"]",l,c).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let i={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,l=e.length;a<l;a++){let c=e[a],h=c.name.match(r);if(h&&h.length>1){let u=h[1],f=i[u];f||(i[u]=f=[]),f.push(c)}}let o=[];for(let a in i)o.push(this.CreateFromMorphTargetSequence(a,i[a],t,n));return o}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;let n=function(u,f,d,g,x){if(d.length!==0){let m=[],p=[];Ku(d,m,p,g),m.length!==0&&x.push(new u(f,m,p))}},i=[],r=e.name||"default",o=e.fps||30,a=e.blendMode,l=e.length||-1,c=e.hierarchy||[];for(let u=0;u<c.length;u++){let f=c[u].keys;if(!(!f||f.length===0))if(f[0].morphTargets){let d={},g;for(g=0;g<f.length;g++)if(f[g].morphTargets)for(let x=0;x<f[g].morphTargets.length;x++)d[f[g].morphTargets[x]]=-1;for(let x in d){let m=[],p=[];for(let A=0;A!==f[g].morphTargets.length;++A){let E=f[g];m.push(E.time),p.push(E.morphTarget===x?1:0)}i.push(new Qn(".morphTargetInfluence["+x+"]",m,p))}l=d.length*o}else{let d=".bones["+t[u].name+"]";n(Sn,d+".position",f,"pos",i),n(bn,d+".quaternion",f,"rot",i),n(Sn,d+".scale",f,"scl",i)}}return i.length===0?null:new this(r,l,i,a)}resetDuration(){let e=this.tracks,t=0;for(let n=0,i=e.length;n!==i;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}};function Sx(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Qn;case"vector":case"vector2":case"vector3":case"vector4":return Sn;case"color":return Io;case"quaternion":return bn;case"bool":case"boolean":return vi;case"string":return yi}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function Ax(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=Sx(s.type);if(s.times===void 0){let t=[],n=[];Ku(s.keys,t,n,"value"),s.times=t,s.values=n}return e.parse!==void 0?e.parse(s):new e(s.name,s.times,s.values,s.interpolation)}var di={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(this.files[s]=e)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}},Vl=class{constructor(e,t,n){let i=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){a++,r===!1&&i.onStart!==void 0&&i.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=c.length;u<f;u+=2){let d=c[u],g=c[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return g}return null}}},wx=new Vl,$n=class{constructor(e){this.manager=e!==void 0?e:wx,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};$n.DEFAULT_MATERIAL_NAME="__DEFAULT";var Vn={},Gl=class extends Error{constructor(e,t){super(e),this.response=t}},dr=class extends $n{constructor(e){super(e)}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=di.get(e);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(Vn[e]!==void 0){Vn[e].push({onLoad:t,onProgress:n,onError:i});return}Vn[e]=[],Vn[e].push({onLoad:t,onProgress:n,onError:i});let o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let h=Vn[e],u=c.body.getReader(),f=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),d=f?parseInt(f):0,g=d!==0,x=0,m=new ReadableStream({start(p){A();function A(){u.read().then(({done:E,value:v})=>{if(E)p.close();else{x+=v.byteLength;let P=new ProgressEvent("progress",{lengthComputable:g,loaded:x,total:d});for(let w=0,R=h.length;w<R;w++){let D=h[w];D.onProgress&&D.onProgress(P)}p.enqueue(v),A()}},E=>{p.error(E)})}}});return new Response(m)}else throw new Gl(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return c.json();default:if(a===void 0)return c.text();{let u=/charset="?([^;"\s]*)"?/i.exec(a),f=u&&u[1]?u[1].toLowerCase():void 0,d=new TextDecoder(f);return c.arrayBuffer().then(g=>d.decode(g))}}}).then(c=>{di.add(e,c);let h=Vn[e];delete Vn[e];for(let u=0,f=h.length;u<f;u++){let d=h[u];d.onLoad&&d.onLoad(c)}}).catch(c=>{let h=Vn[e];if(h===void 0)throw this.manager.itemError(e),c;delete Vn[e];for(let u=0,f=h.length;u<f;u++){let d=h[u];d.onError&&d.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}};var Wl=class extends $n{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=di.get(e);if(o!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o;let a=rr("img");function l(){h(),di.add(e,this),t&&t(this),r.manager.itemEnd(e)}function c(u){h(),i&&i(u),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(e),a.src=e,a}};var Cs=class extends $n{constructor(e){super(e)}load(e,t,n,i){let r=new Lt,o=new Wl(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}},Is=class extends xt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new he(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},Po=class extends Is{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new he(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Oa=new De,_u=new N,Eu=new N,pr=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ce(512,512),this.map=null,this.mapPass=null,this.matrix=new De,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new or,this._frameExtents=new Ce(1,1),this._viewportCount=1,this._viewports=[new $e(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;_u.setFromMatrixPosition(e.matrixWorld),t.position.copy(_u),Eu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Eu),t.updateMatrixWorld(),Oa.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Oa),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Oa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Xl=class extends pr{constructor(){super(new wt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){let t=this.camera,n=_s*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},_i=class extends Is{constructor(e,t,n=0,i=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.target=new xt,this.distance=n,this.angle=i,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new Xl}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},bu=new De,Js=new N,Ba=new N,ql=class extends pr{constructor(){super(new wt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ce(4,2),this._viewportCount=6,this._viewports=[new $e(2,1,1,1),new $e(0,1,1,1),new $e(3,1,1,1),new $e(1,1,1,1),new $e(3,0,1,1),new $e(1,0,1,1)],this._cubeDirections=[new N(1,0,0),new N(-1,0,0),new N(0,0,1),new N(0,0,-1),new N(0,1,0),new N(0,-1,0)],this._cubeUps=[new N(0,1,0),new N(0,1,0),new N(0,1,0),new N(0,1,0),new N(0,0,1),new N(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,i=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Js.setFromMatrixPosition(e.matrixWorld),n.position.copy(Js),Ba.copy(n.position),Ba.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Ba),n.updateMatrixWorld(),i.makeTranslation(-Js.x,-Js.y,-Js.z),bu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(bu)}},Dn=class extends Is{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new ql}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},jl=class extends pr{constructor(){super(new mi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Hi=class extends Is{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.target=new xt,this.shadow=new jl}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var Ei=class{static decodeText(e){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let n=0,i=e.length;n<i;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var Lo=class extends $n{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=di.get(e);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(c=>{t&&t(c),r.manager.itemEnd(e)}).catch(c=>{i&&i(c)});return}return setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader;let l=fetch(e,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){return di.add(e,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){i&&i(c),di.remove(e),r.manager.itemError(e),r.manager.itemEnd(e)});di.add(e,l),r.manager.itemStart(e)}};var Do=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Su(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=Su();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};function Su(){return performance.now()}var Yl=class{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,r,o;switch(t){case"quaternion":i=this._slerp,r=this._slerpAdditive,o=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,r=this._select,o=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,r=this._lerpAdditive,o=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=r,this._setIdentity=o,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){let n=this.buffer,i=this.valueSize,r=e*i+i,o=this.cumulativeWeight;if(o===0){for(let a=0;a!==i;++a)n[r+a]=n[a];o=t}else{o+=t;let a=t/o;this._mixBufferRegion(n,r,0,a,i)}this.cumulativeWeight=o}accumulateAdditive(e){let t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){let t=this.valueSize,n=this.buffer,i=e*t+t,r=this.cumulativeWeight,o=this.cumulativeWeightAdditive,a=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){let l=t*this._origIndex;this._mixBufferRegion(n,i,l,1-r,t)}o>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(n[l]!==n[l+t]){a.setValue(n,i);break}}saveOriginalState(){let e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let r=n,o=i;r!==o;++r)t[r]=t[i+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){let e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,r){if(i>=.5)for(let o=0;o!==r;++o)e[t+o]=e[n+o]}_slerp(e,t,n,i){Tt.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,r){let o=this._workIndex*r;Tt.multiplyQuaternionsFlat(e,o,e,t,e,n),Tt.slerpFlat(e,t,e,t,e,o,i)}_lerp(e,t,n,i,r){let o=1-i;for(let a=0;a!==r;++a){let l=t+a;e[l]=e[l]*o+e[n+a]*i}}_lerpAdditive(e,t,n,i,r){for(let o=0;o!==r;++o){let a=t+o;e[a]=e[a]+e[n+o]*i}}},fc="\\[\\]\\.:\\/",Tx=new RegExp("["+fc+"]","g"),dc="[^"+fc+"]",Rx="[^"+fc.replace("\\.","")+"]",Cx=/((?:WC+[\/:])*)/.source.replace("WC",dc),Ix=/(WCOD+)?/.source.replace("WCOD",Rx),Px=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",dc),Lx=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",dc),Dx=new RegExp("^"+Cx+Ix+Px+Lx+"$"),Nx=["material","materials","bones","map"],Kl=class{constructor(e,t,n){let i=n||ht.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},ht=class s{constructor(e,t,n){this.path=t,this.parsedPath=n||s.parseTrackName(t),this.node=s.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new s.Composite(e,t,n):new s(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Tx,"")}static parseTrackName(e){let t=Dx.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);Nx.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,i=t.propertyName,r=t.propertyIndex;if(e||(e=s.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[i];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ht.Composite=Kl;ht.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ht.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ht.prototype.GetterByBindingType=[ht.prototype._getValue_direct,ht.prototype._getValue_array,ht.prototype._getValue_arrayElement,ht.prototype._getValue_toArray];ht.prototype.SetterByBindingTypeAndVersioning=[[ht.prototype._setValue_direct,ht.prototype._setValue_direct_setNeedsUpdate,ht.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ht.prototype._setValue_array,ht.prototype._setValue_array_setNeedsUpdate,ht.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ht.prototype._setValue_arrayElement,ht.prototype._setValue_arrayElement_setNeedsUpdate,ht.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ht.prototype._setValue_fromArray,ht.prototype._setValue_fromArray_setNeedsUpdate,ht.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Jl=class{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;let r=t.tracks,o=r.length,a=new Array(o),l={endingStart:as,endingEnd:as};for(let c=0;c!==o;++c){let h=r[c].createInterpolant(null);a[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=a,this._propertyBindings=new Array(o),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=Yf,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n){if(e.fadeOut(t),this.fadeIn(t),n){let i=this._clip.duration,r=e._clip.duration,o=r/i,a=i/r;e.warp(1,o,t),this.warp(a,1,t)}return this}crossFadeTo(e,t,n){return e.crossFadeFrom(this,t,n)}stopFading(){let e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){let i=this._mixer,r=i.time,o=this.timeScale,a=this._timeScaleInterpolant;a===null&&(a=i._lendControlInterpolant(),this._timeScaleInterpolant=a);let l=a.parameterPositions,c=a.sampleValues;return l[0]=r,l[1]=r+n,c[0]=e/o,c[1]=t/o,this}stopWarping(){let e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}let r=this._startTime;if(r!==null){let l=(e-r)*n;l<0||n===0?t=0:(this._startTime=null,t=n*l)}t*=this._updateTimeScale(e);let o=this._updateTime(t),a=this._updateWeight(e);if(a>0){let l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case Jf:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(o),c[h].accumulateAdditive(a);break;case cc:default:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(o),c[h].accumulate(i,a)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;let n=this._weightInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t)}}return this._effectiveTimeScale=t,t}_updateTime(e){let t=this._clip.duration,n=this.loop,i=this.time+e,r=this._loopCount,o=n===Kf;if(e===0)return r===-1?i:o&&(r&1)===1?t-i:i;if(n===jf){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,o)):this._setEndings(this.repetitions===0,!0,o)),i>=t||i<0){let a=Math.floor(i/t);i-=t*a,r+=Math.abs(a);let l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){let c=e<0;this._setEndings(c,!c,o)}else this._setEndings(!1,!1,o);this._loopCount=r,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:a})}}else this.time=i;if(o&&(r&1)===1)return t-i}return i}_setEndings(e,t,n){let i=this._interpolantSettings;n?(i.endingStart=ls,i.endingEnd=ls):(e?i.endingStart=this.zeroSlopeAtStart?ls:as:i.endingStart=lo,t?i.endingEnd=this.zeroSlopeAtEnd?ls:as:i.endingEnd=lo)}_scheduleFading(e,t,n){let i=this._mixer,r=i.time,o=this._weightInterpolant;o===null&&(o=i._lendControlInterpolant(),this._weightInterpolant=o);let a=o.parameterPositions,l=o.sampleValues;return a[0]=r,l[0]=t,a[1]=r+e,l[1]=n,this}},Ux=new Float32Array(1),No=class extends Kn{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){let n=e._localRoot||this._root,i=e._clip.tracks,r=i.length,o=e._propertyBindings,a=e._interpolants,l=n.uuid,c=this._bindingsByRootAndName,h=c[l];h===void 0&&(h={},c[l]=h);for(let u=0;u!==r;++u){let f=i[u],d=f.name,g=h[d];if(g!==void 0)++g.referenceCount,o[u]=g;else{if(g=o[u],g!==void 0){g._cacheIndex===null&&(++g.referenceCount,this._addInactiveBinding(g,l,d));continue}let x=t&&t._propertyBindings[u].binding.parsedPath;g=new Yl(ht.create(n,d,x),f.ValueTypeName,f.getValueSize()),++g.referenceCount,this._addInactiveBinding(g,l,d),o[u]=g}a[u].resultBuffer=g.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){let n=(e._localRoot||this._root).uuid,i=e._clip.uuid,r=this._actionsByClip[i];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,i,n)}let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let r=t[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let r=t[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){let t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){let i=this._actions,r=this._actionsByClip,o=r[t];if(o===void 0)o={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=o;else{let a=o.knownActions;e._byClipCacheIndex=a.length,a.push(e)}e._cacheIndex=i.length,i.push(e),o.actionByRoot[n]=e}_removeInactiveAction(e){let t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;let r=e._clip.uuid,o=this._actionsByClip,a=o[r],l=a.knownActions,c=l[l.length-1],h=e._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),e._byClipCacheIndex=null;let u=a.actionByRoot,f=(e._localRoot||this._root).uuid;delete u[f],l.length===0&&delete o[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let r=t[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){let t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackAction(e){let t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_addInactiveBinding(e,t,n){let i=this._bindingsByRootAndName,r=this._bindings,o=i[t];o===void 0&&(o={},i[t]=o),o[n]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){let t=this._bindings,n=e.binding,i=n.rootNode.uuid,r=n.path,o=this._bindingsByRootAndName,a=o[i],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete a[r],Object.keys(a).length===0&&delete o[i]}_lendBinding(e){let t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackBinding(e){let t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_lendControlInterpolant(){let e=this._controlInterpolants,t=this._nActiveControlInterpolants++,n=e[t];return n===void 0&&(n=new Co(new Float32Array(2),new Float32Array(2),1,Ux),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){let t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,r=t[i];e.__cacheIndex=i,t[i]=e,r.__cacheIndex=n,t[n]=r}clipAction(e,t,n){let i=t||this._root,r=i.uuid,o=typeof e=="string"?Mi.findByName(i,e):e,a=o!==null?o.uuid:e,l=this._actionsByClip[a],c=null;if(n===void 0&&(o!==null?n=o.blendMode:n=cc),l!==void 0){let u=l.actionByRoot[r];if(u!==void 0&&u.blendMode===n)return u;c=l.knownActions[0],o===null&&(o=c._clip)}if(o===null)return null;let h=new Jl(this,o,t,n);return this._bindAction(h,c),this._addInactiveAction(h,a,r),h}existingAction(e,t){let n=t||this._root,i=n.uuid,r=typeof e=="string"?Mi.findByName(n,e):e,o=r?r.uuid:e,a=this._actionsByClip[o];return a!==void 0&&a.actionByRoot[i]||null}stopAllAction(){let e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;let t=this._actions,n=this._nActiveActions,i=this.time+=e,r=Math.sign(e),o=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(i,e,r,o);let a=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)a[c].apply(o);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){let t=this._actions,n=e.uuid,i=this._actionsByClip,r=i[n];if(r!==void 0){let o=r.knownActions;for(let a=0,l=o.length;a!==l;++a){let c=o[a];this._deactivateAction(c);let h=c._cacheIndex,u=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,u._cacheIndex=h,t[h]=u,t.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(e){let t=e.uuid,n=this._actionsByClip;for(let o in n){let a=n[o].actionByRoot,l=a[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}let i=this._bindingsByRootAndName,r=i[t];if(r!==void 0)for(let o in r){let a=r[o];a.restoreOriginalState(),this._removeInactiveBinding(a)}}uncacheAction(e,t){let n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"170"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="170");var Fo={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var tn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},Ox=new mi(-1,1,1,-1,0,1),pc=class extends Mt{constructor(){super(),this.setAttribute("position",new it([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new it([0,2,0,0,2,0],2))}},Bx=new pc,Si=class{constructor(e){this._mesh=new Q(Bx,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Ox)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var Ls=class extends tn{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof ct?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=bi.clone(e.uniforms),this.material=new ct({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new Si(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}};var yr=class extends tn{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let i=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}},zo=class extends tn{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var Ho=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new Ce);this._width=n.width,this._height=n.height,t=new Gt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:An}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Ls(Fo),this.copyPass.material.blending=Pn,this.clock=new Do}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let i=0,r=this.passes.length;i<r;i++){let o=this.passes[i];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),o.needsSwap){if(n){let a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}yr!==void 0&&(o instanceof yr?n=!0:o instanceof zo&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new Ce);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var Vo=class extends tn{constructor(e,t,n=null,i=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new he}render(e,t,n){let i=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=i}};var Ju={name:"LuminosityHighPassShader",shaderID:"luminosityHighPass",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new he(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var Ds=class s extends tn{constructor(e,t,n,i){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=i,this.resolution=e!==void 0?new Ce(e.x,e.y):new Ce(256,256),this.clearColor=new he(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new Gt(r,o,{type:An}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){let f=new Gt(r,o,{type:An});f.texture.name="UnrealBloomPass.h"+u,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);let d=new Gt(r,o,{type:An});d.texture.name="UnrealBloomPass.v"+u,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),o=Math.round(o/2)}let a=Ju;this.highPassUniforms=bi.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ct({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new Ce(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new N(1,1,1),new N(1,1,1),new N(1,1,1),new N(1,1,1),new N(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;let h=Fo;this.copyUniforms=bi.clone(h.uniforms),this.blendMaterial=new ct({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:qt,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new he,this.oldClearAlpha=1,this.basic=new We,this.fsQuad=new Si(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),i=Math.round(t/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new Ce(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(e,t,n,i,r){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();let o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=s.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=s.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this.fsQuad.render(e),a=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=o}getSeperableBlurMaterial(e){let t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new ct({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Ce(.5,.5)},direction:{value:new Ce(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new ct({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}};Ds.BlurDirectionX=new Ce(1,0);Ds.BlurDirectionY=new Ce(0,1);var Zu={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var Go=class extends tn{constructor(){super();let e=Zu;this.uniforms=bi.clone(e.uniforms),this.material=new Ro({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new Si(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Ge.getTransfer(this._outputColorSpace)===nt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Zl?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Ql?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===$l?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===mr?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===ec?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===tc&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}};var Wo=class extends As{constructor(){super();let e=new Pe;e.deleteAttribute("uv");let t=new ot({side:kt}),n=new ot,i=new Dn(16777215,900,28,2);i.position.set(.418,16.199,.3),this.add(i);let r=new Q(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let o=new Q(e,n);o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),this.add(o);let a=new Q(e,n);a.position.set(-5.607,-.754,-.758),a.rotation.set(0,.994,0),a.scale.set(1.97,1.534,3.955),this.add(a);let l=new Q(e,n);l.position.set(6.167,.857,7.803),l.rotation.set(0,.561,0),l.scale.set(3.927,6.285,3.687),this.add(l);let c=new Q(e,n);c.position.set(-2.017,.018,6.124),c.rotation.set(0,.333,0),c.scale.set(2.002,4.566,2.064),this.add(c);let h=new Q(e,n);h.position.set(2.291,-.756,-2.621),h.rotation.set(0,-.286,0),h.scale.set(1.546,1.552,1.496),this.add(h);let u=new Q(e,n);u.position.set(-2.193,-.369,-5.547),u.rotation.set(0,.516,0),u.scale.set(3.875,3.487,2.986),this.add(u);let f=new Q(e,Ns(50));f.position.set(-16.116,14.37,8.208),f.scale.set(.1,2.428,2.739),this.add(f);let d=new Q(e,Ns(50));d.position.set(-16.109,18.021,-8.207),d.scale.set(.1,2.425,2.751),this.add(d);let g=new Q(e,Ns(17));g.position.set(14.904,12.198,-1.832),g.scale.set(.15,4.265,6.331),this.add(g);let x=new Q(e,Ns(43));x.position.set(-.462,8.89,14.52),x.scale.set(4.38,5.441,.088),this.add(x);let m=new Q(e,Ns(20));m.position.set(3.235,11.486,-12.541),m.scale.set(2.5,2,.1),this.add(m);let p=new Q(e,Ns(100));p.position.set(0,20,0),p.scale.set(1,.1,1),this.add(p)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function Ns(s){let e=new We;return e.color.setScalar(s),e}function $u(s,e=!1){let t=s[0].index!==null,n=new Set(Object.keys(s[0].attributes)),i=new Set(Object.keys(s[0].morphAttributes)),r={},o={},a=s[0].morphTargetsRelative,l=new Mt,c=0;for(let h=0;h<s.length;++h){let u=s[h],f=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let d in u.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.attributes[d]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let d in u.morphAttributes){if(!i.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[d]===void 0&&(o[d]=[]),o[d].push(u.morphAttributes[d])}if(e){let d;if(t)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,d,h),c+=d}}if(t){let h=0,u=[];for(let f=0;f<s.length;++f){let d=s[f].index;for(let g=0;g<d.count;++g)u.push(d.getX(g)+h);h+=s[f].attributes.position.count}l.setIndex(u)}for(let h in r){let u=Qu(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let f=0;f<u;++f){let d=[];for(let x=0;x<o[h].length;++x)d.push(o[h][x][f]);let g=Qu(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}return l}function Qu(s){let e,t,n,i=-1,r=0;for(let c=0;c<s.length;++c){let h=s[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=h.gpuType),i!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let o=new e(r),a=new gt(o,t,n),l=0;for(let c=0;c<s.length;++c){let h=s[c];if(h.isInterleavedBufferAttribute){let u=l/t;for(let f=0,d=h.count;f<d;f++)for(let g=0;g<t;g++){let x=h.getComponent(f,g);a.setComponent(f+u,g,x)}}else o.set(h.array,l);l+=h.count*t}return i!==void 0&&(a.gpuType=i),a}function mc(s,e){if(e===Bu)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(e===xr||e===Oo){let t=s.getIndex();if(t===null){let o=[],a=s.getAttribute("position");if(a!==void 0){for(let l=0;l<a.count;l++)o.push(l);s.setIndex(o),t=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}let n=t.count-2,i=[];if(e===xr)for(let o=1;o<=n;o++)i.push(t.getX(0)),i.push(t.getX(o)),i.push(t.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(i.push(t.getX(o)),i.push(t.getX(o+1)),i.push(t.getX(o+2))):(i.push(t.getX(o+2)),i.push(t.getX(o+1)),i.push(t.getX(o)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let r=s.clone();return r.setIndex(i),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),s}var Xo=class extends $n{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Ec(t)}),this.register(function(t){return new bc(t)}),this.register(function(t){return new Lc(t)}),this.register(function(t){return new Dc(t)}),this.register(function(t){return new Nc(t)}),this.register(function(t){return new Ac(t)}),this.register(function(t){return new wc(t)}),this.register(function(t){return new Tc(t)}),this.register(function(t){return new Rc(t)}),this.register(function(t){return new _c(t)}),this.register(function(t){return new Cc(t)}),this.register(function(t){return new Sc(t)}),this.register(function(t){return new Pc(t)}),this.register(function(t){return new Ic(t)}),this.register(function(t){return new yc(t)}),this.register(function(t){return new Uc(t)}),this.register(function(t){return new Oc(t)})}load(e,t,n,i){let r=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let c=Ei.extractUrlBase(e);o=Ei.resolveURL(c,this.path)}else o=Ei.extractUrlBase(e);this.manager.itemStart(e);let a=function(c){i?i(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new dr(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,o,function(h){t(h),r.manager.itemEnd(e)},a)}catch(h){a(h)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let r,o={},a={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===rf){try{o[qe.KHR_BINARY_GLTF]=new Bc(e)}catch(u){i&&i(u);return}r=JSON.parse(o[qe.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new Wc(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){let u=this.pluginCallbacks[h](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[u.name]=u,o[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){let u=r.extensionsUsed[h],f=r.extensionsRequired||[];switch(u){case qe.KHR_MATERIALS_UNLIT:o[u]=new Mc;break;case qe.KHR_DRACO_MESH_COMPRESSION:o[u]=new kc(r,this.dracoLoader);break;case qe.KHR_TEXTURE_TRANSFORM:o[u]=new Fc;break;case qe.KHR_MESH_QUANTIZATION:o[u]=new zc;break;default:f.indexOf(u)>=0&&a[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(o),c.setPlugins(a),c.parse(n,i)}parseAsync(e,t){let n=this;return new Promise(function(i,r){n.parse(e,t,i,r)})}};function kx(){let s={};return{get:function(e){return s[e]},add:function(e,t){s[e]=t},remove:function(e){delete s[e]},removeAll:function(){s={}}}}var qe={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},yc=class{constructor(e){this.parser=e,this.name=qe.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,i=t.cache.get(n);if(i)return i;let r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],c,h=new he(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],Ft);let u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Hi(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Dn(h),c.distance=u;break;case"spot":c=new _i(h),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),c.decay=2,ei(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(l){return n._getNodeRef(t.cache,a,l)})}},Mc=class{constructor(){this.name=qe.KHR_MATERIALS_UNLIT}getMaterialType(){return We}extendParams(e,t,n){let i=[];e.color=new he(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let o=r.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],Ft),e.opacity=o[3]}r.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",r.baseColorTexture,St))}return Promise.all(i)}},_c=class{constructor(e){this.parser=e,this.name=qe.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name].emissiveStrength;return r!==void 0&&(t.emissiveIntensity=r),Promise.resolve()}},Ec=class{constructor(e){this.parser=e,this.name=qe.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:en}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];if(o.clearcoatFactor!==void 0&&(t.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(r.push(n.assignTexture(t,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){let a=o.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Ce(a,a)}return Promise.all(r)}},bc=class{constructor(e){this.parser=e,this.name=qe.KHR_MATERIALS_DISPERSION}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:en}extendMaterialParams(e,t){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name];return t.dispersion=r.dispersion!==void 0?r.dispersion:0,Promise.resolve()}},Sc=class{constructor(e){this.parser=e,this.name=qe.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:en}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.iridescenceFactor!==void 0&&(t.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(t.iridescenceIOR=o.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(r)}},Ac=class{constructor(e){this.parser=e,this.name=qe.KHR_MATERIALS_SHEEN}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:en}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[];t.sheenColor=new he(0,0,0),t.sheenRoughness=0,t.sheen=1;let o=i.extensions[this.name];if(o.sheenColorFactor!==void 0){let a=o.sheenColorFactor;t.sheenColor.setRGB(a[0],a[1],a[2],Ft)}return o.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&r.push(n.assignTexture(t,"sheenColorMap",o.sheenColorTexture,St)),o.sheenRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(r)}},wc=class{constructor(e){this.parser=e,this.name=qe.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:en}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.transmissionFactor!==void 0&&(t.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&r.push(n.assignTexture(t,"transmissionMap",o.transmissionTexture)),Promise.all(r)}},Tc=class{constructor(e){this.parser=e,this.name=qe.KHR_MATERIALS_VOLUME}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:en}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];t.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&r.push(n.assignTexture(t,"thicknessMap",o.thicknessTexture)),t.attenuationDistance=o.attenuationDistance||1/0;let a=o.attenuationColor||[1,1,1];return t.attenuationColor=new he().setRGB(a[0],a[1],a[2],Ft),Promise.all(r)}},Rc=class{constructor(e){this.parser=e,this.name=qe.KHR_MATERIALS_IOR}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:en}extendMaterialParams(e,t){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name];return t.ior=r.ior!==void 0?r.ior:1.5,Promise.resolve()}},Cc=class{constructor(e){this.parser=e,this.name=qe.KHR_MATERIALS_SPECULAR}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:en}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];t.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&r.push(n.assignTexture(t,"specularIntensityMap",o.specularTexture));let a=o.specularColorFactor||[1,1,1];return t.specularColor=new he().setRGB(a[0],a[1],a[2],Ft),o.specularColorTexture!==void 0&&r.push(n.assignTexture(t,"specularColorMap",o.specularColorTexture,St)),Promise.all(r)}},Ic=class{constructor(e){this.parser=e,this.name=qe.EXT_MATERIALS_BUMP}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:en}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return t.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&r.push(n.assignTexture(t,"bumpMap",o.bumpTexture)),Promise.all(r)}},Pc=class{constructor(e){this.parser=e,this.name=qe.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:en}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.anisotropyStrength!==void 0&&(t.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(t.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&r.push(n.assignTexture(t,"anisotropyMap",o.anisotropyTexture)),Promise.all(r)}},Lc=class{constructor(e){this.parser=e,this.name=qe.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;let r=i.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,o)}},Dc=class{constructor(e){this.parser=e,this.name=qe.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(e){let t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=i.images[o.source],l=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return this.detectSupport().then(function(c){if(c)return n.loadTextureImage(e,o.source,l);if(i.extensionsRequired&&i.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){let t=new Image;t.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}},Nc=class{constructor(e){this.parser=e,this.name=qe.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(e){let t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=i.images[o.source],l=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return this.detectSupport().then(function(c){if(c)return n.loadTextureImage(e,o.source,l);if(i.extensionsRequired&&i.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){let t=new Image;t.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}},Uc=class{constructor(e){this.name=qe.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let i=n.extensions[this.name],r=this.parser.getDependency("buffer",i.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){let l=i.byteOffset||0,c=i.byteLength||0,h=i.count,u=i.byteStride,f=new Uint8Array(a,l,c);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(h,u,f,i.mode,i.filter).then(function(d){return d.buffer}):o.ready.then(function(){let d=new ArrayBuffer(h*u);return o.decodeGltfBuffer(new Uint8Array(d),h,u,f,i.mode,i.filter),d})})}else return null}},Oc=class{constructor(e){this.name=qe.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let i=t.meshes[n.mesh];for(let c of i.primitives)if(c.mode!==hn.TRIANGLES&&c.mode!==hn.TRIANGLE_STRIP&&c.mode!==hn.TRIANGLE_FAN&&c.mode!==void 0)return null;let o=n.extensions[this.name].attributes,a=[],l={};for(let c in o)a.push(this.parser.getDependency("accessor",o[c]).then(h=>(l[c]=h,l[c])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(c=>{let h=c.pop(),u=h.isGroup?h.children:[h],f=c[0].count,d=[];for(let g of u){let x=new De,m=new N,p=new Tt,A=new N(1,1,1),E=new En(g.geometry,g.material,f);for(let v=0;v<f;v++)l.TRANSLATION&&m.fromBufferAttribute(l.TRANSLATION,v),l.ROTATION&&p.fromBufferAttribute(l.ROTATION,v),l.SCALE&&A.fromBufferAttribute(l.SCALE,v),E.setMatrixAt(v,x.compose(m,p,A));for(let v in l)if(v==="_COLOR_0"){let P=l[v];E.instanceColor=new an(P.array,P.itemSize,P.normalized)}else v!=="TRANSLATION"&&v!=="ROTATION"&&v!=="SCALE"&&g.geometry.setAttribute(v,l[v]);xt.prototype.copy.call(E,g),this.parser.assignFinalMaterial(E),d.push(E)}return h.isGroup?(h.clear(),h.add(...d),h):d[0]}))}},rf="glTF",Mr=12,ef={JSON:1313821514,BIN:5130562},Bc=class{constructor(e){this.name=qe.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Mr),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==rf)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-Mr,r=new DataView(e,Mr),o=0;for(;o<i;){let a=r.getUint32(o,!0);o+=4;let l=r.getUint32(o,!0);if(o+=4,l===ef.JSON){let c=new Uint8Array(e,Mr+o,a);this.content=n.decode(c)}else if(l===ef.BIN){let c=Mr+o;this.body=e.slice(c,c+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},kc=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=qe.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,i=this.dracoLoader,r=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},l={},c={};for(let h in o){let u=Vc[h]||h.toLowerCase();a[u]=o[h]}for(let h in e.attributes){let u=Vc[h]||h.toLowerCase();if(o[h]!==void 0){let f=n.accessors[e.attributes[h]],d=Us[f.componentType];c[u]=d.name,l[u]=f.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(u,f){i.decodeDracoFile(h,function(d){for(let g in d.attributes){let x=d.attributes[g],m=l[g];m!==void 0&&(x.normalized=m)}u(d)},a,c,Ft,f)})})}},Fc=class{constructor(){this.name=qe.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}},zc=class{constructor(){this.name=qe.KHR_MESH_QUANTIZATION}},qo=class extends xi{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i*3+i;for(let o=0;o!==i;o++)t[o]=n[r+o];return t}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=a*2,c=a*3,h=i-t,u=(n-t)/h,f=u*u,d=f*u,g=e*c,x=g-c,m=-2*d+3*f,p=d-f,A=1-m,E=p-f+u;for(let v=0;v!==a;v++){let P=o[x+v+a],w=o[x+v+l]*h,R=o[g+v+a],D=o[g+v]*h;r[v]=A*P+E*w+m*R+p*D}return r}},Fx=new Tt,Hc=class extends qo{interpolate_(e,t,n,i){let r=super.interpolate_(e,t,n,i);return Fx.fromArray(r).normalize().toArray(r),r}},hn={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Us={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},tf={9728:Pt,9729:Xt,9984:nc,9985:$s,9986:os,9987:In},nf={33071:Xn,33648:ir,10497:Fi},gc={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Vc={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Ai={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},zx={CUBICSPLINE:void 0,LINEAR:Ms,STEP:ys},xc={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function Hx(s){return s.DefaultMaterial===void 0&&(s.DefaultMaterial=new ot({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Ln})),s.DefaultMaterial}function Vi(s,e,t){for(let n in t.extensions)s[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function ei(s,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(s.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Vx(s,e,t){let n=!1,i=!1,r=!1;for(let c=0,h=e.length;c<h;c++){let u=e[c];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(r=!0),n&&i&&r)break}if(!n&&!i&&!r)return Promise.resolve(s);let o=[],a=[],l=[];for(let c=0,h=e.length;c<h;c++){let u=e[c];if(n){let f=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):s.attributes.position;o.push(f)}if(i){let f=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):s.attributes.normal;a.push(f)}if(r){let f=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):s.attributes.color;l.push(f)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l)]).then(function(c){let h=c[0],u=c[1],f=c[2];return n&&(s.morphAttributes.position=h),i&&(s.morphAttributes.normal=u),r&&(s.morphAttributes.color=f),s.morphTargetsRelative=!0,s})}function Gx(s,e){if(s.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)s.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(s.morphTargetInfluences.length===t.length){s.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)s.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Wx(s){let e,t=s.extensions&&s.extensions[qe.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+vc(t.attributes):e=s.indices+":"+vc(s.attributes)+":"+s.mode,s.targets!==void 0)for(let n=0,i=s.targets.length;n<i;n++)e+=":"+vc(s.targets[n]);return e}function vc(s){let e="",t=Object.keys(s).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+s[t[n]]+";";return e}function Gc(s){switch(s){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Xx(s){return s.search(/\.jpe?g($|\?)/i)>0||s.search(/^data\:image\/jpeg/)===0?"image/jpeg":s.search(/\.webp($|\?)/i)>0||s.search(/^data\:image\/webp/)===0?"image/webp":s.search(/\.ktx2($|\?)/i)>0||s.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var qx=new De,Wc=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new kx,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,r=!1,o=-1;if(typeof navigator<"u"){let a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;let l=a.match(/Version\/(\d+)/);i=n&&l?parseInt(l[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||r&&o<98?this.textureLoader=new Cs(this.options.manager):this.textureLoader=new Lo(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new dr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,i=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){let a={scene:o[0][i.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:i.asset,parser:n,userData:{}};return Vi(r,a,i),ei(a,i),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(a)})).then(function(){for(let l of a.scenes)l.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,r=t.length;i<r;i++){let o=t[i].joints;for(let a=0,l=o.length;a<l;a++)e[o[a]].isBone=!0}for(let i=0,r=e.length;i<r;i++){let o=e[i];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let i=n.clone(),r=(o,a)=>{let l=this.associations.get(o);l!=null&&this.associations.set(a,l);for(let[c,h]of o.children.entries())r(h,a.children[c])};return r(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let i=e(t[n]);if(i)return i}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let i=0;i<t.length;i++){let r=e(t[i]);r&&n.push(r)}return n}getDependency(e,t){let n=e+":"+t,i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":i=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(r,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[qe.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(r,o){n.load(Ei.resolveURL(t.uri,i.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let i=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+i)})}loadAccessor(e){let t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){let o=gc[i.type],a=Us[i.componentType],l=i.normalized===!0,c=new a(i.count*o);return Promise.resolve(new gt(c,o,l))}let r=[];return i.bufferView!==void 0?r.push(this.getDependency("bufferView",i.bufferView)):r.push(null),i.sparse!==void 0&&(r.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(r).then(function(o){let a=o[0],l=gc[i.type],c=Us[i.componentType],h=c.BYTES_PER_ELEMENT,u=h*l,f=i.byteOffset||0,d=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,g=i.normalized===!0,x,m;if(d&&d!==u){let p=Math.floor(f/d),A="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+p+":"+i.count,E=t.cache.get(A);E||(x=new c(a,p*d,i.count*d/h),E=new ar(x,d/h),t.cache.add(A,E)),m=new lr(E,l,f%d/h,g)}else a===null?x=new c(i.count*l):x=new c(a,f,i.count*l),m=new gt(x,l,g);if(i.sparse!==void 0){let p=gc.SCALAR,A=Us[i.sparse.indices.componentType],E=i.sparse.indices.byteOffset||0,v=i.sparse.values.byteOffset||0,P=new A(o[1],E,i.sparse.count*p),w=new c(o[2],v,i.sparse.count*l);a!==null&&(m=new gt(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let R=0,D=P.length;R<D;R++){let b=P[R];if(m.setX(b,w[R*l]),l>=2&&m.setY(b,w[R*l+1]),l>=3&&m.setZ(b,w[R*l+2]),l>=4&&m.setW(b,w[R*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,o=t.images[r],a=this.textureLoader;if(o.uri){let l=n.manager.getHandler(o.uri);l!==null&&(a=l)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){let i=this,r=this.json,o=r.textures[e],a=r.images[t],l=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=o.name||a.name||"",h.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(h.name=a.uri);let f=(r.samplers||{})[o.sampler]||{};return h.magFilter=tf[f.magFilter]||Xt,h.minFilter=tf[f.minFilter]||In,h.wrapS=nf[f.wrapS]||Fi,h.wrapT=nf[f.wrapT]||Fi,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Pt&&h.minFilter!==Xt,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){let n=this,i=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());let o=i.images[e],a=self.URL||self.webkitURL,l=o.uri||"",c=!1;if(o.bufferView!==void 0)l=n.getDependency("bufferView",o.bufferView).then(function(u){c=!0;let f=new Blob([u],{type:o.mimeType});return l=a.createObjectURL(f),l});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let h=Promise.resolve(l).then(function(u){return new Promise(function(f,d){let g=f;t.isImageBitmapLoader===!0&&(g=function(x){let m=new Lt(x);m.needsUpdate=!0,f(m)}),t.load(Ei.resolveURL(u,r.path),g,void 0,d)})}).then(function(u){return c===!0&&a.revokeObjectURL(l),ei(u,o),u.userData.mimeType=o.mimeType||Xx(o.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){let r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[qe.KHR_TEXTURE_TRANSFORM]){let a=n.extensions!==void 0?n.extensions[qe.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let l=r.associations.get(o);o=r.extensions[qe.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,l)}}return i!==void 0&&(o.colorSpace=i),e[t]=o,o})}assignFinalMaterial(e){let t=e.geometry,n=e.material,i=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){let a="PointsMaterial:"+n.uuid,l=this.cache.get(a);l||(l=new ur,Qt.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(a,l)),n=l}else if(e.isLine){let a="LineBasicMaterial:"+n.uuid,l=this.cache.get(a);l||(l=new hr,Qt.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(a,l)),n=l}if(i||r||o){let a="ClonedMaterial:"+n.uuid+":";i&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let l=this.cache.get(a);l||(l=n.clone(),r&&(l.vertexColors=!0),o&&(l.flatShading=!0),i&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(a,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return ot}loadMaterial(e){let t=this,n=this.json,i=this.extensions,r=n.materials[e],o,a={},l=r.extensions||{},c=[];if(l[qe.KHR_MATERIALS_UNLIT]){let u=i[qe.KHR_MATERIALS_UNLIT];o=u.getMaterialType(),c.push(u.extendParams(a,r,t))}else{let u=r.pbrMetallicRoughness||{};if(a.color=new he(1,1,1),a.opacity=1,Array.isArray(u.baseColorFactor)){let f=u.baseColorFactor;a.color.setRGB(f[0],f[1],f[2],Ft),a.opacity=f[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(a,"map",u.baseColorTexture,St)),a.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,a.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(a,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(a,"roughnessMap",u.metallicRoughnessTexture))),o=this._invokeOne(function(f){return f.getMaterialType&&f.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(f){return f.extendMaterialParams&&f.extendMaterialParams(e,a)})))}r.doubleSided===!0&&(a.side=Bt);let h=r.alphaMode||xc.OPAQUE;if(h===xc.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,h===xc.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==We&&(c.push(t.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new Ce(1,1),r.normalTexture.scale!==void 0)){let u=r.normalTexture.scale;a.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&o!==We&&(c.push(t.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==We){let u=r.emissiveFactor;a.emissive=new he().setRGB(u[0],u[1],u[2],Ft)}return r.emissiveTexture!==void 0&&o!==We&&c.push(t.assignTexture(a,"emissiveMap",r.emissiveTexture,St)),Promise.all(c).then(function(){let u=new o(a);return r.name&&(u.name=r.name),ei(u,r),t.associations.set(u,{materials:e}),r.extensions&&Vi(i,u,r),u})}createUniqueName(e){let t=ht.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,i=this.primitiveCache;function r(a){return n[qe.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(l){return sf(l,a,t)})}let o=[];for(let a=0,l=e.length;a<l;a++){let c=e[a],h=Wx(c),u=i[h];if(u)o.push(u.promise);else{let f;c.extensions&&c.extensions[qe.KHR_DRACO_MESH_COMPRESSION]?f=r(c):f=sf(new Mt,c,t),i[h]={primitive:c,promise:f},o.push(f)}}return Promise.all(o)}loadMesh(e){let t=this,n=this.json,i=this.extensions,r=n.meshes[e],o=r.primitives,a=[];for(let l=0,c=o.length;l<c;l++){let h=o[l].material===void 0?Hx(this.cache):this.getDependency("material",o[l].material);a.push(h)}return a.push(t.loadGeometries(o)),Promise.all(a).then(function(l){let c=l.slice(0,l.length-1),h=l[l.length-1],u=[];for(let d=0,g=h.length;d<g;d++){let x=h[d],m=o[d],p,A=c[d];if(m.mode===hn.TRIANGLES||m.mode===hn.TRIANGLE_STRIP||m.mode===hn.TRIANGLE_FAN||m.mode===void 0)p=r.isSkinnedMesh===!0?new _o(x,A):new Q(x,A),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),m.mode===hn.TRIANGLE_STRIP?p.geometry=mc(p.geometry,Oo):m.mode===hn.TRIANGLE_FAN&&(p.geometry=mc(p.geometry,xr));else if(m.mode===hn.LINES)p=new Ao(x,A);else if(m.mode===hn.LINE_STRIP)p=new Ts(x,A);else if(m.mode===hn.LINE_LOOP)p=new wo(x,A);else if(m.mode===hn.POINTS)p=new Rs(x,A);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(p.geometry.morphAttributes).length>0&&Gx(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),ei(p,r),m.extensions&&Vi(i,p,m),t.assignFinalMaterial(p),u.push(p)}for(let d=0,g=u.length;d<g;d++)t.associations.set(u[d],{meshes:e,primitives:d});if(u.length===1)return r.extensions&&Vi(i,u[0],r),u[0];let f=new lt;r.extensions&&Vi(i,f,r),t.associations.set(f,{meshes:e});for(let d=0,g=u.length;d<g;d++)f.add(u[d]);return f})}loadCamera(e){let t,n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new wt(zu.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new mi(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),ei(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let i=0,r=t.joints.length;i<r;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){let r=i.pop(),o=i,a=[],l=[];for(let c=0,h=o.length;c<h;c++){let u=o[c];if(u){a.push(u);let f=new De;r!==null&&f.fromArray(r.array,c*16),l.push(f)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new Eo(a,l)})}loadAnimation(e){let t=this.json,n=this,i=t.animations[e],r=i.name?i.name:"animation_"+e,o=[],a=[],l=[],c=[],h=[];for(let u=0,f=i.channels.length;u<f;u++){let d=i.channels[u],g=i.samplers[d.sampler],x=d.target,m=x.node,p=i.parameters!==void 0?i.parameters[g.input]:g.input,A=i.parameters!==void 0?i.parameters[g.output]:g.output;x.node!==void 0&&(o.push(this.getDependency("node",m)),a.push(this.getDependency("accessor",p)),l.push(this.getDependency("accessor",A)),c.push(g),h.push(x))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(u){let f=u[0],d=u[1],g=u[2],x=u[3],m=u[4],p=[];for(let A=0,E=f.length;A<E;A++){let v=f[A],P=d[A],w=g[A],R=x[A],D=m[A];if(v===void 0)continue;v.updateMatrix&&v.updateMatrix();let b=n._createAnimationTracks(v,P,w,R,D);if(b)for(let y=0;y<b.length;y++)p.push(b[y])}return new Mi(r,void 0,p)})}createNodeMesh(e){let t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(r){let o=n._getNodeRef(n.meshCache,i.mesh,r);return i.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let l=0,c=i.weights.length;l<c;l++)a.morphTargetInfluences[l]=i.weights[l]}),o})}loadNode(e){let t=this.json,n=this,i=t.nodes[e],r=n._loadNodeShallow(e),o=[],a=i.children||[];for(let c=0,h=a.length;c<h;c++)o.push(n.getDependency("node",a[c]));let l=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([r,Promise.all(o),l]).then(function(c){let h=c[0],u=c[1],f=c[2];f!==null&&h.traverse(function(d){d.isSkinnedMesh&&d.bind(f,qx)});for(let d=0,g=u.length;d<g;d++)h.add(u[d]);return h})}_loadNodeShallow(e){let t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],o=r.name?i.createUniqueName(r.name):"",a=[],l=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&a.push(l),r.camera!==void 0&&a.push(i.getDependency("camera",r.camera).then(function(c){return i._getNodeRef(i.cameraCache,r.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){a.push(c)}),this.nodeCache[e]=Promise.all(a).then(function(c){let h;if(r.isBone===!0?h=new cr:c.length>1?h=new lt:c.length===1?h=c[0]:h=new xt,h!==c[0])for(let u=0,f=c.length;u<f;u++)h.add(c[u]);if(r.name&&(h.userData.name=r.name,h.name=o),ei(h,r),r.extensions&&Vi(n,h,r),r.matrix!==void 0){let u=new De;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);return i.associations.has(h)||i.associations.set(h,{}),i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],i=this,r=new lt;n.name&&(r.name=i.createUniqueName(n.name)),ei(r,n),n.extensions&&Vi(t,r,n);let o=n.nodes||[],a=[];for(let l=0,c=o.length;l<c;l++)a.push(i.getDependency("node",o[l]));return Promise.all(a).then(function(l){for(let h=0,u=l.length;h<u;h++)r.add(l[h]);let c=h=>{let u=new Map;for(let[f,d]of i.associations)(f instanceof Qt||f instanceof Lt)&&u.set(f,d);return h.traverse(f=>{let d=i.associations.get(f);d!=null&&u.set(f,d)}),u};return i.associations=c(r),r})}_createAnimationTracks(e,t,n,i,r){let o=[],a=e.name?e.name:e.uuid,l=[];Ai[r.path]===Ai.weights?e.traverse(function(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}):l.push(a);let c;switch(Ai[r.path]){case Ai.weights:c=Qn;break;case Ai.rotation:c=bn;break;case Ai.position:case Ai.scale:c=Sn;break;default:n.itemSize===1?c=Qn:c=Sn;break}let h=i.interpolation!==void 0?zx[i.interpolation]:Ms,u=this._getArrayFromAccessor(n);for(let f=0,d=l.length;f<d;f++){let g=new c(l[f]+"."+Ai[r.path],t.array,u,h);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(g),o.push(g)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=Gc(t.constructor),i=new Float32Array(t.length);for(let r=0,o=t.length;r<o;r++)i[r]=t[r]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let i=this instanceof bn?Hc:qo;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function jx(s,e,t){let n=e.attributes,i=new jt;if(n.POSITION!==void 0){let a=t.json.accessors[n.POSITION],l=a.min,c=a.max;if(l!==void 0&&c!==void 0){if(i.set(new N(l[0],l[1],l[2]),new N(c[0],c[1],c[2])),a.normalized){let h=Gc(Us[a.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let a=new N,l=new N;for(let c=0,h=r.length;c<h;c++){let u=r[c];if(u.POSITION!==void 0){let f=t.json.accessors[u.POSITION],d=f.min,g=f.max;if(d!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(d[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(d[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(d[2]),Math.abs(g[2]))),f.normalized){let x=Gc(Us[f.componentType]);l.multiplyScalar(x)}a.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(a)}s.boundingBox=i;let o=new Zt;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,s.boundingSphere=o}function sf(s,e,t){let n=e.attributes,i=[];function r(o,a){return t.getDependency("accessor",o).then(function(l){s.setAttribute(a,l)})}for(let o in n){let a=Vc[o]||o.toLowerCase();a in s.attributes||i.push(r(n[o],a))}if(e.indices!==void 0&&!s.index){let o=t.getDependency("accessor",e.indices).then(function(a){s.setIndex(a)});i.push(o)}return Ge.workingColorSpace!==Ft&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Ge.workingColorSpace}" not supported.`),ei(s,e),jx(s,e,t),Promise.all(i).then(function(){return e.targets!==void 0?Vx(s,e.targets,t):s})}var ti={chephro:{name:"Chephro",role:"The DJ",h:2.5,glow:2.4,color:4184319},brontor:{name:"Brontor",role:"Vanguard",h:2.4,glow:1.7,color:5818623},elyra:{name:"Elyra",role:"Mender",h:1.9,glow:1.8,color:9433296},kryvax:{name:"Kryvax",role:"Striker",h:1.85,glow:2.6,color:16730682},murm:{name:"Murm",role:"Disrupter",h:1.7,glow:1.4,color:13660415},skitter:{name:"Skitter",role:"Striker",h:1.5,glow:2.2,color:8019199},thulkar:{name:"Thulkar",role:"Vanguard",h:2.5,glow:2.4,color:10479871},vexl:{name:"Vexl",role:"Disrupter",h:1.9,glow:2.2,color:5234943},warden:{name:"Temple Warden",role:"Rare guest",h:4.8,glow:0,color:16762458}},of=s=>s.replace(/^mixamorig:?/,""),Xc=class{constructor(e,t){this.id=e,this.info=ti[e],this.root=new lt,this.model=t.scene,this.root.add(this.model),this.bones={},this.meshes=[],this.mats=[],this.model.traverse(o=>{if(o.isBone&&(this.bones[of(o.name)]=o),o.isSkinnedMesh){o.frustumCulled=!1,o.castShadow=!0,this.meshes.push(o),o.geometry.attributes.normal||o.geometry.computeVertexNormals();let a=o.material;this.mats.push(a),a.emissiveMap&&(a.emissive=new he(16777215),a.emissiveIntensity=this.info.glow),a.envMapIntensity=.6}});let n=this.skinnedBox(),i=this.info.h/(n.max.y-n.min.y);this.model.scale.multiplyScalar(i);let r=this.skinnedBox();this.model.position.y-=r.min.y,this.model.position.x-=(r.min.x+r.max.x)/2,this.fitScale=i,this.rest={};for(let o in this.bones)this.rest[o]={q:this.bones[o].quaternion.clone(),p:this.bones[o].position.clone()};this.clips={};for(let o of t.animations)this.clips[o.name]=o;this.mixer=new No(this.model),this.actions={}}skinnedBox(){let e=new jt;this.root.updateMatrixWorld(!0);for(let t of this.meshes)t.skeleton.update(),t.computeBoundingBox(),e.union(t.boundingBox.clone().applyMatrix4(t.matrixWorld));return e}adopt(e,t,n,i={}){let r=[],o=this.rest.Hips.p.y/n.rest.Hips.p.y;for(let l of t.tracks){let c=l.name.lastIndexOf("."),h=l.name.slice(0,c),u=l.name.slice(c+1),f=of(h),d=this.bones[f];if(d&&!(i.skip&&i.skip.test(f))){if(u==="quaternion")r.push(new bn(d.name+".quaternion",l.times,l.values));else if(u==="position"&&f==="Hips"){let g=new Float32Array(l.values.length),x=n.rest.Hips.p,m=this.rest.Hips.p;for(let p=0;p<g.length;p+=3)g[p]=(l.values[p]-x.x)*o+m.x,g[p+1]=l.values[p+1]*o,g[p+2]=(l.values[p+2]-x.z)*o+m.z;r.push(new Sn(d.name+".position",l.times,g))}}}let a=new Mi(e,t.duration,r);return this.clips[e]=a,a}tether(e){let t=this.bones.Hips,n=this.rest.Hips.p;if(!this._unit){let l=new N;t.parent.getWorldScale(l),this._unit=l.x/(this.root.scale.x||1)||1}let i=e/this._unit,r=t.position.x-n.x,o=t.position.z-n.z,a=Math.hypot(r,o);if(a>1e-6){let l=i*Math.tanh(a/i)/a;t.position.x=n.x+r*l,t.position.z=n.z+o*l}}action(e){if(!this.actions[e]){let t=this.clips[e];if(!t)throw new Error(this.id+" has no clip "+e);let n=this.mixer.clipAction(t);n.play(),n.setEffectiveWeight(0),n.paused=!0,this.actions[e]=n}return this.actions[e]}pose(e){for(let n in this.actions)this.actions[n].setEffectiveWeight(0);let t=this.mixer._accuIndex|0;for(let n of this.mixer._bindings){let i=n.valueSize;n.buffer.fill(7.777,t*i+i,t*i+2*i)}for(let n of e){let i=this.action(n.clip);i.time=Math.max(0,Math.min(i.getClip().duration-1e-4,n.time)),i.setEffectiveWeight(n.weight)}this.mixer.update(0)}};async function af(s,e,t){let n=new Xo,i={},r=0;return await Promise.all(s.map(async o=>{let a=await n.loadAsync(e+o+".glb");i[o]=new Xc(o,a),t&&t(++r/s.length,o)})),i}var lf="data:image/webp;base64,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";var Os=Math.PI*2,cf=8,_t=-7.6,un=1,hf=`
float nonagon(vec2 p){ float a = atan(p.x, p.y); float seg = 6.2831853/9.0; a = mod(a + seg*0.5, seg) - seg*0.5; return length(p) * cos(a) / cos(seg*0.5); }
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
`;function Yx(){return new ct({uniforms:{uBeat:{value:0},uKick:{value:0},uEnergy:{value:0},uA:{value:new he},uB:{value:new he},uFlash:{value:0},uWarden:{value:0}},vertexShader:"varying vec2 vP; varying vec3 vW; void main(){ vP = position.xy; vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }",fragmentShader:`
      uniform float uBeat,uKick,uEnergy,uFlash,uWarden; uniform vec3 uA,uB; varying vec2 vP; varying vec3 vW;
      ${hf}
      void main(){
        vec2 p = vP / ${cf.toFixed(1)};
        float d = nonagon(p);
        float ang = atan(p.x, p.y); float seg = floor((ang + 3.14159265) / (6.2831853/9.0));
        // rings rolling outward, one per beat
        float ring = fract(d*3.0 - uBeat*0.5);
        float ringGlow = smoothstep(0.0,0.08,ring) * smoothstep(0.34,0.08,ring);
        // tiles
        vec2 g = vW.xz*1.0; vec2 f = abs(fract(g)-0.5); float line = smoothstep(0.47,0.5,max(f.x,f.y));
        vec2 cell = floor(g); float tw = hash(cell + floor(uBeat*2.0)*0.37);
        float tile = step(1.0 - 0.10 - uEnergy*0.22, tw);
        // a chase round the nine segments
        float chase = step(0.5, 1.0 - abs(mod(seg - floor(uBeat), 9.0) - 0.0)) ;
        vec3 col = vec3(0.012,0.012,0.03);
        vec3 mixc = mix(uA, uB, 0.5 + 0.5*sin(d*5.0 - uBeat*0.7854));
        col += mixc * ringGlow * (0.05 + 0.3*uEnergy) * (0.35 + uKick);
        col += mix(uB,uA,tw) * tile * (0.08 + 0.4*uKick) * uEnergy;
        col += uA * chase * 0.22 * uEnergy * smoothstep(0.25,1.0,d);
        col += mixc * line * (0.07 + 0.16*uEnergy);
        // edge strip
        float edge = smoothstep(0.93,0.965,d) * smoothstep(1.0,0.975,d);
        col += mix(uA,uB,0.5+0.5*sin(ang*9.0 + uBeat*1.5708)) * edge * (0.9 + 1.6*uKick);
        // the warden's seal burning through the middle
        float wd = nonagon((vP - vec2(0.0, 1.2)) / 3.4);
        float seal = smoothstep(0.08,0.0,abs(wd-0.9)) + smoothstep(0.05,0.0,abs(wd-0.55)) + 0.6*smoothstep(1.0,0.0,wd)*(0.5+0.5*sin(ang*18.0+uBeat*3.14));
        col += vec3(1.0,0.72,0.25) * seal * uWarden * 1.6;
        col += vec3(1.0) * uFlash * 0.25;
        col *= smoothstep(1.02,0.99,d);
        gl_FragColor = vec4(col, 1.0);
      }`})}function Kx(){return new ct({uniforms:{uBeat:{value:0},uKick:{value:0},uHigh:{value:0},uMid:{value:0},uMode:{value:0},uMix:{value:0},uModeB:{value:0},uA:{value:new he},uB:{value:new he},uFlash:{value:0},uDim:{value:1},uClose:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:`
      uniform float uBeat,uKick,uHigh,uMid,uMode,uModeB,uMix,uFlash,uDim,uClose; uniform vec3 uA,uB; varying vec2 vUv;
      ${hf}
      vec3 scene(float mode, vec2 p, vec2 uv){
        float r = length(p); float d = nonagon(p); float a = atan(p.x,p.y);
        vec3 c = vec3(0.0);
        if (mode < 0.5) {            // the eye: a ring, and ripples leaving it
          float eye = smoothstep(0.035,0.0,abs(r-0.36-0.02*uKick));
          float pupil = smoothstep(0.13+0.05*uKick,0.10,r);
          float rip = 0.0; for(int i=0;i<4;i++){ float rr = fract(uBeat*0.125 + float(i)*0.25); rip += smoothstep(0.012,0.0,abs(r-0.36-rr*1.6))*(1.0-rr); }
          c = uA*eye*1.6 + uB*pupil*(0.5+uMid) + mix(uA,uB,0.5)*rip*0.8;
        } else if (mode < 1.5) {     // nine-sided tunnel
          float z = 1.0/max(d,0.02); float bands = fract(z*0.9 + uBeat*0.5);
          float w = smoothstep(0.0,0.06,bands)*smoothstep(0.5,0.12,bands);
          float spoke = smoothstep(0.75,1.0,abs(sin(a*4.5 + uBeat*0.3927)));
          c = mix(uA,uB,fract(z*0.25+uBeat*0.125))*w*(0.35+0.9*uKick)*smoothstep(0.0,0.5,d)*2.0 + uB*spoke*0.12*d;
        } else if (mode < 2.5) {     // drop: bars and blocks
          float col = floor(uv.x*24.0); float h = hash(vec2(col, floor(uBeat*4.0)));
          float bar = step(abs(uv.y-0.5)*2.0, 0.15 + h*(0.4+0.6*uKick));
          float blk = step(0.72, hash(floor(uv*vec2(12.0,5.0)) + floor(uBeat*2.0)));
          c = mix(uA,uB,h)*bar*1.3 + vec3(1.0)*blk*uKick*0.6;
        } else if (mode < 3.5) {     // break: slow curtains and stars
          float cur = 0.0; for(int i=0;i<3;i++){ float fi=float(i); cur += smoothstep(0.25,0.0,abs(p.y - 0.25*sin(p.x*2.0+uBeat*0.2+fi*2.1) - (fi-1.0)*0.35))*0.5; }
          vec2 sg = floor(uv*vec2(90.0,40.0)); float st = step(0.985, hash(sg))*(0.5+0.5*sin(uBeat*1.57+hash(sg+3.0)*6.28));
          c = mix(uA,uB,uv.y)*cur*(0.6+uMid) + vec3(0.8,0.9,1.0)*st;
        } else {                     // the warden: a sun behind him
          float rays = pow(abs(sin(a*9.0 + uBeat*0.3927)), 6.0);
          float disc = smoothstep(0.42,0.36,d);
          c = vec3(1.0,0.72,0.22)*(rays*smoothstep(1.6,0.3,r)*(0.5+uKick) + disc*0.4) + vec3(1.0,0.35,0.1)*smoothstep(0.05,0.0,abs(d-0.5))*2.0;
        }
        return c;
      }
      void main(){
        vec2 cells = vec2(144.0, 54.0);
        vec2 q = (floor(vUv*cells)+0.5)/cells;
        vec2 p = (q-0.5)*vec2(2.667,1.0)*2.0;
        vec3 c = mix(scene(uMode,p,q), scene(uModeB,p,q), uMix);
        // a shutter closing in during the held breath before a drop
        float sh = nonagon(p*0.6); c *= mix(1.0, smoothstep(1.0-uClose, 1.0-uClose-0.05, sh) , step(0.001,uClose));
        c += vec3(1.0)*smoothstep(0.03,0.0,abs(sh-(1.0-uClose)))*step(0.001,uClose)*1.5;
        vec2 f = fract(vUv*cells)-0.5; float dot_ = smoothstep(0.5,0.25,length(f));
        c = c*dot_*uDim + vec3(1.0)*uFlash*dot_;
        gl_FragColor = vec4(c*0.85 + vec3(0.004,0.004,0.01), 1.0);
      }`})}function jo(s){return new ct({uniforms:{uColor:{value:new he(1,1,1)},uI:{value:1}},transparent:!0,depthWrite:!1,blending:qt,side:Bt,vertexShader:"varying float vL; varying vec3 vN; varying vec3 vV; void main(){ vL = uv.y; vec4 mv = modelViewMatrix*vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }",fragmentShader:`uniform vec3 uColor; uniform float uI; varying float vL; varying vec3 vN; varying vec3 vV;
      void main(){ float e = pow(abs(dot(normalize(vN), normalize(vV))), 1.2); float a = e * ${s?"pow(1.0-vL, 0.8)":"pow(vL, 1.1)"} * uI; gl_FragColor = vec4(uColor*a, a); }`})}function uf(s){let e={beams:[],lasers:[],speakers:[],jets:[],strips:[],arrayLeds:[]},t=document.createElement("canvas");t.width=t.height=128;let n=t.getContext("2d"),i=n.createRadialGradient(64,64,0,64,64,64);i.addColorStop(0,"#fff"),i.addColorStop(.35,"#888"),i.addColorStop(1,"#000"),n.fillStyle=i,n.fillRect(0,0,128,128),e.glowTex=new To(t);let r=new Q(new ln(60,48),new ot({color:197382,roughness:.95,metalness:0}));r.rotation.x=-Math.PI/2,r.position.y=-.02,s.add(r),e.floorMat=Yx();let o=new Q(new ln(cf*1.03,9,Math.PI/2-Math.PI/9),e.floorMat);o.rotation.x=-Math.PI/2,s.add(o),e.wallMat=Kx();let a=new Q(new $t(22,8.25),e.wallMat);a.position.set(0,5.6,-11.2),s.add(a),e.wall=a,e.logoMat=new We({map:new Cs().load(lf),transparent:!0,opacity:0,depthWrite:!1,toneMapped:!1}),e.logoMat.map.colorSpace=St,e.logo=new Q(new $t(15.6,15.6*249/720),e.logoMat),e.logo.position.set(0,5.75,-11.05),e.logo.renderOrder=3,s.add(e.logo);let l=new ot({color:723988,roughness:.5,metalness:.7}),c=new Q(new Pe(22.6,8.85,.3),l);c.position.set(0,5.6,-11.4),s.add(c);for(let V of[-1,1]){let Z=new Q(new Pe(2.2,13,2.2),new ot({color:1381148,roughness:.85,metalness:.1}));Z.position.set(V*13,6.5,-10.6),s.add(Z);let O=new Q(new Pe(.12,11,.05),new We({color:16777215}));O.position.set(V*13,6.3,-9.48),s.add(O),e.strips.push(O);let G=Z.clone();G.position.set(V*15.5,6.5,2),s.add(G);let ee=O.clone();ee.material=O.material.clone(),ee.position.set(V*14.38,6.3,2),ee.rotation.y=Math.PI/2,s.add(ee),e.strips.push(ee)}let h=new ot({color:2237486,roughness:.45,metalness:.9}),u=7.2,f=8.6,d=new vt(.07,1.25,1,20,1,!0);d.translate(0,-.5,0);for(let V=0;V<9;V++){let Z=V/9*Os+Math.PI/9,O=(V+1)/9*Os+Math.PI/9,G=new N(Math.sin(Z)*u,f,Math.cos(Z)*u-.5),ee=new N(Math.sin(O)*u,f,Math.cos(O)*u-.5);for(let Ne of[0,.35]){let je=new Q(new vt(.05,.05,G.distanceTo(ee),6),h);je.position.copy(G).lerp(ee,.5),je.position.y+=Ne,je.quaternion.setFromUnitVectors(new N(0,1,0),ee.clone().sub(G).normalize()),s.add(je)}let ie=new lt;ie.position.copy(G),ie.position.y-=.25,s.add(ie);let ce=new Q(new vt(.16,.2,.42,12),h);ce.position.y=-.05,ie.add(ce);let xe=new Q(new ln(.15,16),new We({color:16777215}));xe.rotation.x=Math.PI/2,xe.position.y=-.27,ie.add(xe);let _e=new Q(d,jo());_e.scale.set(1,15,1),_e.position.y=-.27,_e.renderOrder=5,ie.add(_e);let Xe=new Q(new ln(2.3,24),new We({map:e.glowTex,color:16777215,transparent:!0,blending:qt,depthWrite:!1,opacity:.2}));Xe.rotation.x=-Math.PI/2,Xe.position.y=.02,s.add(Xe),e.beams.push({head:ie,cone:_e,lens:xe,pool:Xe,base:ie.position.clone(),i:V,dir:new N(0,-1,0),target:new N})}let g=new vt(.008,.008,1,5,1,!0);g.translate(0,.5,0);for(let V of[-1,1])for(let Z=0;Z<6;Z++){let O=new Q(g,new We({color:6750156,transparent:!0,blending:qt,depthWrite:!1,opacity:0}));O.position.set(V*10.6,9.4,-11),O.scale.set(1,34,1),s.add(O),e.lasers.push({m:O,sx:V,k:Z})}let x=new ot({color:723728,roughness:.55,metalness:.45}),m=new ot({color:2303022,roughness:.35,metalness:.9}),p=new ot({color:1052694,roughness:.75,metalness:.2}),A=new ot({color:2895160,roughness:.25,metalness:.9}),E=new ct({transparent:!0,depthWrite:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:"varying vec2 vUv; void main(){ vec2 g = fract(vUv*vec2(46.0,38.0))-0.5; float hole = smoothstep(0.34,0.26,length(g)); gl_FragColor = vec4(vec3(0.03,0.03,0.045), 0.78*(1.0-hole*0.9)); }"}),v=(V,Z,O,G,ee,ie)=>{let ce=new lt;ce.position.set(Z,O,0),V.add(ce);let xe=new Q(new Jn(G*1,G*1.14,36),m);ce.add(xe);for(let Ue=0;Ue<8;Ue++){let Be=new Q(new ln(G*.035,6),A),Ee=Ue/8*Os+.39;Be.position.set(Math.cos(Ee)*G*1.07,Math.sin(Ee)*G*1.07,.004),ce.add(Be)}let _e=new We({color:16777215}),Xe=new Q(new Jn(G*1.15,G*1.2,40),_e);Xe.position.z=.003,ce.add(Xe);let Ne=new lt;ce.add(Ne);let je=new Q(new fr(G*.93,G*.42,36,1,!0),p);je.rotation.x=Math.PI/2,je.position.z=-G*.21,je.material.side=Bt,Ne.add(je);let B=new Q(new gi(G*.93,G*.055,8,36),new ot({color:394760,roughness:.9}));Ne.add(B);let Ze=new Q(new Zn(G*.3,16,8,0,Os,0,Math.PI/2),A);return Ze.rotation.x=Math.PI/2,Ze.position.z=-G*.36,Ne.add(Ze),e.speakers.push({cone:Ne,ringM:_e,j:ie,amt:ee,r:G}),ce},P=(V,Z,O)=>{let G=new lt;G.add(new Q(new Pe(V,Z,O),x));let ee=new Q(new Pe(V+.04,Z+.04,.06),m);ee.position.z=O/2-.05,G.add(ee);let ie=new Q(new $t(V-.1,Z-.1),new ot({color:328967,roughness:.9}));ie.position.z=O/2-.015,G.add(ie);for(let xe of[-1,1])for(let _e of[-1,1]){let Xe=new Q(new Pe(.14,.14,.14),m);Xe.position.set(xe*(V/2-.04),_e*(Z/2-.04),O/2-.04),G.add(Xe)}for(let xe of[-1,1]){let _e=new Q(new Pe(.05,.34,.2),m);_e.position.set(xe*(V/2+.01),0,0),G.add(_e)}let ce=new lt;return ce.position.z=O/2,G.add(ce),G.front=ce,G.w=V,G.h=Z,G};for(let V of[-1,1]){let Z=new lt;Z.position.set(V*9.7,0,-8.1),Z.rotation.y=-V*.38,s.add(Z);for(let B=0;B<2;B++){let Ze=P(2.3,1.55,1.7);Ze.position.y=.8+B*1.6,Z.add(Ze),v(Ze.front,-.55,0,.56,1,B),v(Ze.front,.6,0,.56,1,B+1);for(let Be of[-.56,.56]){let Ee=new Q(new Pe(2,.09,.02),new We({color:0}));Ee.position.set(0,Be*1.18,0),Ze.front.add(Ee)}let Ue=new Q(new $t(2.18,1.42),E);Ue.position.z=.06,Ze.front.add(Ue)}let O=P(2.1,1.25,1.4);O.position.y=3.85,Z.add(O),v(O.front,-.58,-.08,.34,.5,2),v(O.front,.58,-.08,.34,.5,3);let G=new Q(new Pe(.62,.3,.03),A);G.position.set(0,.36,0),O.front.add(G);let ee=new Q(new Pe(.5,.2,.035),new We({color:0}));ee.position.set(0,.36,.004),O.front.add(ee);let ie=new Q(new Pe(.66,.02,.04),new We({color:16777215}));ie.position.set(0,.16,0),O.front.add(ie),e.strips.push(ie);let ce=new Q(new ln(.09,16),A);ce.position.set(0,-.3,.003),O.front.add(ce);let xe=new Q(new Pe(.3,.05,.02),new We({color:16777215}));xe.position.set(0,-.52,0),O.front.add(xe),e.strips.push(xe);let _e=new lt;_e.position.set(V*8.3,9.4,-5.6),_e.rotation.y=-V*.5,s.add(_e);let Xe=new Q(new vt(.02,.02,3,4),m);Xe.position.y=1.6,_e.add(Xe);let Ne=0,je=.05;for(let B=0;B<7;B++){let Ze=new lt;Ze.position.set(0,Ne,Math.sin(je)*-.5*B*.25),Ze.rotation.x=je,_e.add(Ze),Ze.add(new Q(new Pe(1.7,.4,.75),x));let Ue=new Q(new Pe(1.74,.42,.04),m);Ue.position.z=.36,Ze.add(Ue);let Be=new Q(new $t(1.62,.32),new ot({color:263174,roughness:.9}));Be.position.z=.385,Ze.add(Be);for(let Re of[-.52,.52]){let T=new Q(new ln(.14,16),p);T.position.set(Re,0,.388),Ze.add(T)}let Ee=new We({color:16777215}),at=new Q(new Pe(.34,.035,.02),Ee);at.position.set(0,0,.39),Ze.add(at),e.arrayLeds.push({m:Ee,k:B,sx:V}),Ne-=.43,je+=.055}}let w=new vt(.55,.08,1,14,1,!0);w.translate(0,.5,0);for(let V of[-5.4,-3.6,3.6,5.4]){let Z=new Q(w,jo(!0));Z.position.set(V,.1,_t+2.3),Z.material.uniforms.uColor.value.set(.9,.95,1),Z.scale.set(1,.01,1),Z.renderOrder=6,s.add(Z),e.jets.push(Z)}let R=700,D=new Float32Array(R*3),b=new Float32Array(R);for(let V=0;V<R;V++)D[V*3]=(Math.random()-.5)*30,D[V*3+1]=Math.random()*10,D[V*3+2]=(Math.random()-.5)*26-1,b[V]=Math.random();let y=new Mt;y.setAttribute("position",new gt(D,3)),y.setAttribute("seed",new gt(b,1)),e.moteMat=new ct({uniforms:{uT:{value:0},uColor:{value:new he},uI:{value:1}},transparent:!0,depthWrite:!1,blending:qt,vertexShader:"attribute float seed; uniform float uT; varying float vS; void main(){ vS = seed; vec3 p = position; p.y = mod(p.y + uT*(0.08+seed*0.12), 10.0); p.x += sin(uT*0.3+seed*40.0)*0.6; vec4 mv = modelViewMatrix*vec4(p,1.0); gl_PointSize = (10.0+seed*26.0)/-mv.z; gl_Position = projectionMatrix*mv; }",fragmentShader:"uniform vec3 uColor; uniform float uI; varying float vS; void main(){ float d = length(gl_PointCoord-0.5); float a = smoothstep(0.5,0.0,d)*(0.25+0.5*vS)*uI; gl_FragColor = vec4(uColor*a, a); }"}),s.add(new Rs(y,e.moteMat));let M=96;e.crowdN=M;let C=new ot({color:526350,roughness:.62,metalness:.25}),L=(V,Z,O,G,ee=0,ie=0,ce=1,xe=1,_e=1)=>(V.scale(ce,xe,_e),V.rotateX(ee),V.rotateZ(ie),V.translate(Z,O,G),V),U=(V,Z,O,G,ee=1,ie=1,ce=1)=>L(new Zn(V,10,8),Z,O,G,0,0,ee,ie,ce),F=(V,Z,O,G,ee,ie,ce=0,xe=0)=>L(new vt(V,Z,O,8),G,ee,ie,ce,xe),W=(V,Z,O,G,ee,ie=0,ce=0)=>L(new fr(V,Z,7),O,G,ee,ie,ce),J={grey:{g:[F(.15,.1,1,0,.6,0),F(.2,.15,.3,0,1.2,0),F(.05,.05,.16,0,1.42,0),U(.22,0,1.66,.02,1,1.3,1.05)],eyes:[[-.09,1.62,.2],[.09,1.62,.2]],eyeS:[1.5,.8],sh:[.22,1.28],arm:.7,top:1.95},squid:{g:[U(.3,0,1.45,0,.9,1.5,.9),F(.2,.26,.5,0,.95,0),...[0,1,2,3,4,5].map(V=>{let Z=V/6*Os;return F(.05,.015,.85,Math.sin(Z)*.2,.36,Math.cos(Z)*.2,Math.cos(Z)*.22,-Math.sin(Z)*.22)})],eyes:[[-.2,1.2,.2],[.2,1.2,.2]],eyeS:[1.2,1.2],sh:[.24,1.05],arm:.75,top:1.9,tent:!0},brute:{g:[F(.5,.32,.95,0,.95,0),F(.34,.3,.5,0,.26,0),U(.3,-.5,1.36,0),U(.3,.5,1.36,0),U(.2,0,1.56,.08),W(.07,.36,-.17,1.8,.05,0,.5),W(.07,.36,.17,1.8,.05,0,-.5)],eyes:[[-.08,1.58,.26],[.08,1.58,.26]],eyeS:[1,.5],sh:[.62,1.34],arm:.8,top:1.95,thick:1.9},mantis:{g:[F(.1,.06,.9,0,.5,0),F(.16,.1,.55,0,1.15,.06,.25),W(.2,.34,0,1.56,.18,Math.PI*.62),F(.012,.012,.6,-.1,1.9,.1,-.3,.35),F(.012,.012,.6,.1,1.9,.1,-.3,-.35),F(.03,.02,.7,-.14,.35,.06,0,.18),F(.03,.02,.7,.14,.35,.06,0,-.18)],eyes:[[-.15,1.62,.2],[.15,1.62,.2]],eyeS:[1.3,1.3],sh:[.17,1.3],arm:.8,top:2.1},blob:{g:[U(.46,0,.5,0,1.1,1.05,1),U(.3,0,.98,.04),F(.03,.04,.5,-.14,1.4,.05,0,.25),F(.03,.04,.5,.14,1.4,.05,0,-.25),U(.08,-.2,1.66,.05),U(.08,.2,1.66,.05)],eyes:[[-.2,1.67,.11],[.2,1.67,.11]],eyeS:[1.5,1.5],sh:[.45,.8],arm:.5,top:1.75},floater:{g:[U(.42,0,1.75,0,1,.62,1),F(.36,.42,.1,0,1.6,0),...[0,1,2,3,4,5,6].map(V=>{let Z=V/7*Os;return F(.035,.008,1.1,Math.sin(Z)*.27,1.02,Math.cos(Z)*.27,Math.cos(Z)*.1,-Math.sin(Z)*.1)})],eyes:[[-.13,1.7,.4],[.13,1.7,.4],[0,1.82,.38]],eyeS:[.9,.9],sh:null,top:2.05,hover:.5},spine:{g:[F(.24,.3,1,0,.62,0),U(.26,0,1.2,0,1.15,.9,1),U(.19,0,1.52,.1,1,.9,1.25),...[0,1,2,3,4].map(V=>W(.06,.42,0,1.72-V*.26,-.16-Math.sin(V*.7)*.1,-1-V*.12)),F(.07,.02,.9,0,.3,-.42,1)],eyes:[[-.09,1.54,.3],[.09,1.54,.3]],eyeS:[1.6,.6],sh:[.3,1.22],arm:.7,top:1.9}},I=Object.keys(J),Y=Jx(13);e.crowd=[];let se={};I.forEach(V=>se[V]=0);let le=[6750176,16734794,16765024,11567359,7387391,10289002,16743120];for(let V=0;V<M;V++){let Z=(Y()*250-125)*Math.PI/180,O=9.6+Y()*4.4+(Math.abs(Z)>1.6?1.2:0),G=I[Math.floor(Y()*I.length)];G==="floater"&&Math.abs(Z)<.75&&(G="grey");let ee=Math.sin(Z)*O,ie=Math.cos(Z)*O+.3;e.crowd.push({kind:G,n:se[G]++,x:ee,z:ie,yaw:Math.atan2(-ee,-4.5-ie)+(Y()-.5)*.5,h:(.82+Y()*.5+(G==="brute"?.15:0))*(Math.abs(Z)<.6?.82:1),ph:Y(),amp:.5+Y()*.8,w:.85+Y()*.45,hue:Y(),arms:Y(),eye:le[Math.floor(Y()*le.length)],blink:Y()})}e.crowdKinds=J,e.crowdMeshes=[];for(let V of I){let Z=$u(J[V].g.map(G=>G.index?G.toNonIndexed():G)),O=new En(Z,C,Math.max(1,se[V]));O.count=se[V],J[V].mesh=O,e.crowdMeshes.push(O)}e.crowdArm=new En(new vt(.035,.06,1,6),C,M*2),e.crowdStick=new En(new Pe(.045,.46,.045),new We({color:16777215}),M*2),e.crowdEye=new En(new Zn(.028,6,5),new We({color:16777215}),M*3);for(let V of[...e.crowdMeshes,e.crowdArm,e.crowdStick,e.crowdEye])V.frustumCulled=!1,s.add(V);return e.crowdStick.instanceColor=new an(new Float32Array(M*2*3),3),e.crowdEye.instanceColor=new an(new Float32Array(M*3*3),3),e}function Jx(s){return function(){s|=0,s=s+1831565813|0;let e=Math.imul(s^s>>>15,1|s);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var Nn=s=>{let e=Math.sin(s*127.1+311.7)*43758.5453;return e-Math.floor(e)};var ni={bpm:108,off:.6014,pre:5,dur:223.968,low:"btvxw3466478a598a7bb99ccc7ddebcefnpttcjkkemllflonfoqpgoqrhrspkvvwsvtwktuwlvvwlwvwmtuultusluuumuutrwxxlwwwkxxwlxwwkxwwkxwwlxwtozzxrvrwlxwxlxuxlxwxksqtluutksqtluusorrtiornkmmqjqqtioptjqvvjussmxxwnsouhpqpiopogpqphpopippnhomofpommtqvjqqsiqqqfprpioprjssqhppphprpnsouhpqpiopogpqphpopippnhomofpommqpshmomjlmmfnoqhknqjpssgopohproxvoszqiizsilyronzsmlzrmkzrkkxrokvrsuztiiytikxopkzqnmztplzpnjwrsmwslqyohgxngjvmjkvoijynjjxniivmkivppqwphgvnghummiynljvpmjumlivnpkwsltzoomxnnovmnlvojmynlkxnklvmnjvpprwpnkvnmnumokynmnwpnlummounrltsmtxppmznnovoomvploxnlkxnlnwpojtpquxsnlwqoqunpmznnqxromwmoouprmtsmtxppmznoouoomvpmoxnlkxnlnwpojtoorvnmjunmltlnkxmlnvomktlmltmoktqlsvmnkwmlmtlmksnikxlkivljkummitoorvomjuomltlnkxmlnvomktlmltmokxvoszsijzsilyrnmzrmlzrmkzqkkxqokvrsuztiiytikxopkzqnmzsplzpnjwrsmwslqyohgxngjvmjkvoijynjjxniivmkivppqwohgvnghummiynljvpmjumlivnokwsltyoomxnnnumnmvojmynkkxnjlvmmiuooqunlkvnmltlliymlltmigumljrikhjljmggiieiikdjlldmljellmhnmlejkjgjik8dfe9ehgbgjkennlgnoohopolxzwjljnggiieiikdjlldmkjellmhnllejkjgjik8dfe9fhgbgjkeonmgnoohnpolxywikimffihdhgjcgjickihchkjejkichhhfjjk8dee9effafgjcjkjejlkdlnkippqhjhmffihdhgibhjickkhchkjfjkidijifjhk8dfe9eggbghjdllkflmlgnomjrsrwsoswknkvnnnvlkkrojlwijlvlllvnmjsoprusomvtolxmolwomnyrnoxpnpwqspvrkowokiukljtkjlunilvlijvkjlwjkitmqsuqojwrmmznplwompyqolwopozqtnwunuzponypnovlmjrmhiuhjjtkikvklismnptqmksommwlnkwnjkvnmjumllwnpkurlswmmlwmlmukjjtmgiukihujjjvikitlopsomisokkwmllwmlkvmnjunmluopluqlrxlmlxkmntjkkrmjkviijtjijtjlhsmopspmksollslnjwljlvnlkumlktnpkurmtwmmlwmmmtljktmhkwkhhuijkthigskmpsnmjrolitlljvmkkvnmjulllsoplurltxnlnylmovmmmxoknynljxmkmwqomnrrsjnpmjlmphpqrinqukqvwjtssmyzwsvyy21100000",mid:"cda66ekpstxzvxwxwxztzuxwossqkqlkojgfdqlhkkggiiegcffdbfc9baaaaba78da758867785566566545443444343425c8433322232223132212121212131315c8532213331212142313131323131315a8546555554554455434332332131216geealifgnhgglmjllhhhmkikqnglniimgebcojilmhgjnninnifjiijhmjgjojkmgeealifgnhggmmjllhhhmkikqnglmiinfdabjgfggeegjkgkledgghihmigjnjjn88di4c6e245i78fl34cl4adj34ju78af79ck4c7e335i79ej44cm4bfi33ou7aag8agkflfgcdfmbikr7djx9ihucemzdeeh8cemgjfgddfkajos7dky9iiuccpzeffi8aciflihbehmaiks7dgz9ifwbeercdfh8cbjgkigcdimajmu7chz8ifvbceudefiaddhblfhchgjbjimagglajhmdlgociimaebickhlbffmbjhobfen9ihjcefmdikmaddhblfhcgfibkimagglajhmdlgochimbgekjnmngjkqdnqvcjlzbmkwegjwgknobdgkhrljckjmeqnqbikzcnkxgnjvgiknbgekjnmngjkqdnqvcilzbmkwegjvgkno78di4c6e245i88ej34cl4bdj34ku78af79ck5b7e335h79ej44cl4bfi33pu7aag8agkflfgcdfmbikr7djx9ihucemzdeeh8cemgjfgddfkakor7dky9iiuccpzeffi8aciflihbehmbiks7dgz9jgvbeesdfgi8cbiinkldejpbmoz7djzfprxbeiwjqqra9879989b87aea7ac9bdeb77efciiegjd99adacecccad8867egfgcbedecda63aa9879989a87aea7acabdfa76efciiegjd999eacecccbd8867egfgcchgheed98eedcadecehjgnqmmovrpqxrpuzvtwzsuymjhipklmnmjpqonuyxuwzyuxzzuzzzvziiffljhjnmlprppqusrpvrrszupswprukgeflghijhhinjglonmnpkkmpojltmon676f6echafhkcijohkgoekkmflimfklibgdffigkdfinbhhncign9hfj9dclbdcgac9e9lfichhjdkkoeniqdmljcjijcffjbfdhdhfhbcbj9bee7c9g7fbf689i699c897f7hekbhhkcilpglipimpnenmqgmqpbhfofjjufhhseeghagflfkihdfjpcjnq9cdobnitelktgjmnenisiookejmpfjmsbggoekjtfggteehh9ggkhkhicfjpcjns9cdpanitfkkqhkntglkqiloofmmqgnqrbhfofkktffhqdegkafhnfkjicfjmckms9ddpbmiteklrgkmofojsjoojeklofiltcgfoemjueggsdghk9fhkglhidfiocjmr9ddoalfscfgndcfj7bekekhhbcfl9ghmbb9fcb9fb879aa8b9767765563244425da5332110000",high:"40001233322211100000000000000000100000000000000000000000000000001000000000000000000000000000000020000000000000000000000000000000c8iadef9jdufgee9icodhee8icodhee8g7e8bbb7d9kbdab7eakcebd8gcmdiec8g8iabbc7ebqbntegdasafcd7fcndtveecao89fa9cgtcmzfjgcmafdd8fdnbszfgd8i9cbc7ebqbntegeasafcc7gcndtvefb8l88c97acoaksdhfbkadcd8fdmbszegc5mfi7olf6w9uizul6zef6lmhcqctkjnh6rfj9klb8q8rkush7vef7mmibsdolioj4jeg6lke5t8uhvoi6uce5kkhbobojglf6pdi8hhb8p8ojsrh6ted6kkhaocnlgmh4kac7lll5udmgwpi6udf5kjkbqcojhmh6r9b8klh8ockjrqj6vfe6kjkaoclkgli4kad6mjk6tdlhzqk6wef5jllbqdpjgmi6rac8inj8scjjtqk7ref6llkasdmlhmj4kad6mkj6tdlgzqj5vef5jllbqdpjhmi6n9b8glg8rcihtpi6see6jkjanclkgli4lac6lji5tcmgzpj5tce5jkkapcoifki6q9b7gkh8pciiuqj6ree6kjjaoclkglj5mfi7okf6v9tizsh6yef5kmhctctjjoh6sfk9jlc8p8sksrh7wee7lnictdnlioi4jeg6kjd5u8uhvpi6vce5kkhbqbojglf6qdi8hib8s8ojssi7ved6kliaocnkgmj5jad7llk6udmgwpj6uef6kjjcrfojhom8racajnkapfljsrl9ujgamlkcqfnkjpqecgflhcnnphlpjknrmrwslhjolorwsmpjigilkkkppotykhimmjszvpsvpsrg859dcgglhcnnphlpjknrmrwrmijomorwrnpjjgiljklqposzkghmmkszwptuprrh859cbffkfcllogjmgikojotnifiiimmpmjliighkjijoolruiehiigozqlopmond648cbfekfclkogilgikokptniggjimnsolnihfhlijkoomsvjfhkjhqzsmqroppf6431f6a2iid2i878uie2pc92ijf9l8889hf1j572fhc2j978toi2lcb2hkg9k8a9aeg4ngplnwzpzlzizrj9sed5ikhapbdabfi4l9c6hkh6mcd9sol5pfe6kjjaocgbfik4kad6mlk6qdc9wkg5qdd5ilk9pbdadgi4k9b6ijh6lcc8qki5ped5hii9ocf9dhk4kac6nji6odcarji5qdd5gjh9pbd9bfh4j9b6gih6lcc9nkj5ped6iii9nbfaeij4lac6nji6sclgunh5vdc5iliaocohekg6n9b7imi8ncgipni6sed6hjjascljfmj4j9c6nkj5pcmfrni6scd6hjgaqcohdig6mqeahlg8rfmkqqi6vfd6hiiaqcljflj4k9c6nmk6qhogtnh5wed5jliaqdoigli7h77b969ai8hnbfb9j8988597g5de432000000000000",full:"izyzv57999bdcbcdecghffgggfgjhggihusxrikmkhmnlilpnjorpjorpjrtolvvuvywunswtotxtouxvnuwuntwtouwuouxtyyzumuxtlvxtmuwtmvwtlvwumvwsoyzvuxvuouyuouwuovyvmsttnuwtmsttnuwsvrurjoslllnpiqrqjnpskowskstrnvxuqttskpsolnrnkprpkprplqrolpqojqqnttutlpsqlprpipsoknqqkrtpjoqokprpqttskosolnrnkprpkprplqrolpqojqqnspsqjlplllnmgpppjjoqlotqinqojprqxwtrzpkkzrlkyopozppmzrpnzqnmwrpmvuwtzqjkyqkjympmzmpmzqpmzmplvrrowuqrxpjjwnjkvlmnwolmypmnwolmvnmlvtsrwoiivmiivkolzlnlvpnlvknlunonwuruyprownqovlpowomqypnpwonovnpmvtsrwopmvmonvkpnzlopwponvkopunrnttstwoqoxnpovnpovopqwonnwoopvqqmtsutxponxoqpvlqnzkpqxppnwkqpuprottstwoqoxnpovnpovopqwoonwoopvqqmtssrvnomunomtkpmykopvpomukootnpntsqsuopmvmomulontnmownnnunmounpltssrvoolumomulpnykopvpomukontnpnxwtrzrkkzrllzooozppmzrpnzqomwrpmvuwtzqjkyqkjylpmzmpmzqpmzmpkvrrowuqrxpjjwnjkvlmnwolmypmnwommvnmlvtsrwoiivmiivkolzlnlwpnlvknlvnonwuruxprownqovlpowomqxpnowonounolutrqvnnmvmnmuknmzknntnkjukmlqjlkopotooopmkmkhhmkgmmjgmnnjoolhknkkkkjadgeafhfcgkjgmnlimominqnmwyunpotooopmkmkihmkgmmjgmnnjonmgkmkkkkjadgeafhfcgkjgmnlilpninqnmwyvmonsnnnnkkkjigligmljgkmlilnkgjljkkljbegecfhgegijglmjilnlhmplmqqrmonsnnnnkkkihhligmmigknljlmkhkmkjkkjbdgebfhgdgijflmjilnlimpmmrttvutsukplunpnvllmsnnovjnoumopvopmsrtqvrqnwrpmyjpoylnoyppqxoprursqvtmquommtlnktjlnunmovmkmuloowknktqvrvoplwpnnzkqmxknpyopmwnqqyqsowvsuxpqoxoqowkokslmlukmnslmnvmpmsqspuqontnooxiplxmlmvopluloovoqnutqtvooovnnoujllunklunlluknmvknmtospspoltnmnxkmnwmnmvmplumoouoqotsqswooowlootjmmsmnnukmnskmntlplsqspupontnnnujolxkmmvnolulomtnqnutruvoonvmonukmmtmlnwmlltknntjmltppqtnomronlujmmwknmvoolulnntpqottquwonpwloovkooxnopyopmxmnovrqntrurknplkknniqqpkmrsmowtkstrmxzuzyzw22110000"},Yo=s=>{let e=new Float32Array(s.length);for(let t=0;t<s.length;t++)e[t]=parseInt(s[t],36)/35;return e},fn={title:"Ominous",artist:"Signal 13i",file:"Ominous.mp3",bpm:ni.bpm,off:ni.off,dur:ni.dur,P:60/ni.bpm,pre:ni.pre,low:Yo(ni.low),mid:Yo(ni.mid),high:Yo(ni.high),full:Yo(ni.full)},Ko=s=>(s-fn.off)/fn.P;function Jo(s,e){let t=fn[s],n=(e-fn.off)/(fn.P/4)+fn.pre,i=Math.floor(n),r=n-i;return i<0?t[0]*0:i>=t.length-1?t[t.length-1]:t[i]*(1-r)+t[i+1]*r}var ff=[{bar:0,mode:"intro",energy:.05,kick:!1},{bar:3,mode:"rumble",energy:.25,kick:!1},{bar:8,mode:"rumble",energy:.4,kick:!1},{bar:12,mode:"build",energy:.55,kick:!1},{bar:20,mode:"drop",energy:1,kick:!0},{bar:24,mode:"groove",energy:.8,kick:!0},{bar:44,mode:"drop",energy:1,kick:!0},{bar:48,mode:"groove",energy:.8,kick:!0},{bar:55,mode:"break",energy:.2,kick:!1},{bar:64,mode:"rise",energy:.45,kick:!1},{bar:72,mode:"drop",energy:1,kick:!0},{bar:80,mode:"groove",energy:.85,kick:!0},{bar:96,mode:"drop",energy:1,kick:!0},{bar:98,mode:"outro",energy:.15,kick:!1}],_r=[20,44,72],Er=[19,71],df=100.6;function Bs(s){let e=ff[0];for(let t of ff)s>=t.bar&&(e=t);return e}var mt=()=>new N,qc=()=>new Tt,ks=(s,e,t)=>{let n=Math.max(0,Math.min(1,(t-s)/(e-s)));return n*n*(3-2*n)},Qo=mt(),Sr=mt(),$o=mt(),Gi=mt(),wi=mt(),Ar=qc(),ea=qc(),zs=qc();function br(s,e,t,n=1){s.getWorldPosition(Qo),Sr.copy(e).sub(Qo).normalize(),$o.copy(t).normalize(),Ar.setFromUnitVectors(Sr,$o),s.getWorldQuaternion(ea),Ar.multiply(ea),s.parent.getWorldQuaternion(zs).invert(),zs.multiply(Ar),n>=1?s.quaternion.copy(zs):s.quaternion.slerp(zs,n),s.updateWorldMatrix(!1,!0)}function Fs(s,e,t){s.getWorldQuaternion(ea),Ar.setFromAxisAngle(e,t).multiply(ea),s.parent.getWorldQuaternion(zs).invert(),s.quaternion.copy(zs.multiply(Ar)),s.updateWorldMatrix(!1,!0)}var na=un+1.08,Zo=_t+1.12,At=(s=2241348)=>new We({color:s});function pf(s){let e={controls:[],platters:[],towers:[],rings:[],vu:[],screens:[]},t=new ot({color:855574,roughness:.45,metalness:.75}),n=new ot({color:2763834,roughness:.28,metalness:.95}),i=new Q(new vt(4.6,5,un,9),t);i.scale.z=.5,i.position.set(0,un/2,_t),s.add(i);let r=new Q(new gi(4.62,.035,6,9),At(16777215));r.rotation.x=Math.PI/2,r.rotation.z=Math.PI/18,r.scale.y=.5,r.position.set(0,un+.01,_t),s.add(r),e.edge=r;let o=r.clone();o.material=At(16777215),o.scale.set(1.085,.5*1.085,1),o.position.y=.03,s.add(o),e.edge2=o;let a=new lt;a.position.set(0,na,Zo),a.rotation.x=.3,s.add(a),e.desk=a;let l=new ot({color:1184540,roughness:.22,metalness:.9}),c=new Q(new Pe(4.4,.09,1.3),l);c.position.y=-.05,a.add(c);let h=new Q(new Pe(4.1,.14,1.05),t);h.position.y=-.16,a.add(h);let u=new Q(new Pe(4.44,.022,1.34),At(16777215));u.position.y=-.1,a.add(u),e.trim=u;let f=new Q(new Pe(4.4,.05,.05),n);f.position.set(0,.01,.64),a.add(f);for(let y of[-1,1]){let M=new Q(new Pe(.07,.16,1.34),n);M.position.set(y*2.22,-.06,0),a.add(M)}let d=(y,M,C,L)=>{let U=new Q(new Pe(C,.012,L),new ot({color:1776939,roughness:.4,metalness:.8}));U.position.set(y,.002,M),a.add(U);let F=new Q(new Pe(C+.02,.006,L+.02),At(1713472));F.position.set(y,0,M),a.add(F),e.rings.push({m:F.material,k:.35})};d(0,.02,.66,1.1),d(-.57,0,.5,.52),d(.57,0,.5,.52),d(-1.22,.02,.84,.84),d(1.22,.02,.84,.84),d(-1.86,0,.42,.9),d(1.86,0,.42,.9);let g=(y,M,C,L,U={})=>{L.position.set(M,L.position.y,C),a.add(L);let F={kind:y,x:M,z:C,mesh:L,hit:0,side:Math.sign(M)||1,...U};return e.controls.push(F),F};for(let y of[-1,1]){let M=new lt,C=new Q(new vt(.4,.41,.04,40),n);C.position.y=-.005,M.add(C);let L=new Q(new vt(.36,.36,.05,40),new ot({color:460555,roughness:.22,metalness:.9}));M.add(L);let U=new Q(new gi(.375,.014,6,40),At());U.rotation.x=Math.PI/2,U.position.y=.02,M.add(U);let F=[];for(let O=0;O<9;O++){let G=O/9*Math.PI*2,ee=new Q(new Jn(.405,.44,8,1,G+.06,Math.PI*2/9-.12),At());ee.rotation.x=-Math.PI/2,ee.position.y=.012,M.add(ee),F.push(ee.material)}let W=new lt;W.position.y=.03,M.add(W);for(let O of[.14,.19,.24,.29,.33]){let G=new Q(new Jn(O,O+.004,40),new We({color:1843763}));G.rotation.x=-Math.PI/2,W.add(G)}for(let O=0;O<9;O++){let G=new Q(new Pe(.02,.006,O===0?.24:.07),At()),ee=O/9*Math.PI*2;G.position.set(Math.sin(ee)*(O===0?.2:.31),0,Math.cos(ee)*(O===0?.2:.31)),G.rotation.y=ee,W.add(G)}let J=new Q(new vt(.085,.085,.03,9),At());J.position.y=.02,W.add(J);let I=new lt;I.position.set(y*.37,.05,-.33),I.rotation.y=y*.55,M.add(I),I.add(new Q(new vt(.035,.04,.07,10),n));let Y=new Q(new Pe(.018,.014,.38),n);Y.position.set(0,.04,.19),I.add(Y);let se=new Q(new Pe(.04,.02,.06),At(16777215));se.position.set(0,.03,.39),I.add(se),e.rings.push({m:se.material,k:1.2}),M.position.y=.03;let le=g("platter",y*1.22,.02,M,{ring:U,spin:W,r:.27,segs:F});e.platters.push(le);for(let O=0;O<4;O++){let G=new Q(new vt(.034,.034,.02,12),At(16777215));G.position.set(y*1.22+(O-1.5)*.1,.012,.53),a.add(G),e.rings.push({m:G.material,k:.9,blink:O+(y>0?4:0)})}let V=new Q(new Pe(.02,.006,.5),new We({color:1712176}));V.position.set(y*1.7,.01,.05),a.add(V);let Z=new Q(new Pe(.08,.04,.04),At());Z.position.y=.03,g("fader",y*1.7,.05,Z,{z0:.05,ph:y*2.2})}for(let y of[-1,1])for(let M=0;M<9;M++){let C=new Q(new Pe(.12,.03,.12),At());C.position.y=.022,g("pad",y*(.42+M%3*.15),-.16+Math.floor(M/3)*.15,C)}for(let y=0;y<6;y++){let M=(y-2.5)*.095,C=new Q(new Pe(.02,.006,.4),new We({color:1712176}));C.position.set(M,.011,.2),a.add(C);let L=new Q(new Pe(.06,.05,.045),At());L.position.y=.035,g("fader",M,.2,L,{z0:.2,ph:y*1.7})}let x=new Q(new Pe(.36,.006,.02),new We({color:1712176}));x.position.set(0,.011,.5),a.add(x);let m=new Q(new Pe(.05,.05,.07),At(16777215));m.position.set(0,.035,.5),a.add(m),e.xf=m;let p=(y,M)=>{let C=new lt,L=new Q(new vt(.036,.044,.06,12),new ot({color:1974320,roughness:.3,metalness:.9}));C.add(L);let U=At(),F=new Q(new vt(.026,.026,.012,12),U);F.position.y=.034,C.add(F);let W=new Q(new Jn(.048,.058,16),U);return W.rotation.x=-Math.PI/2,W.position.y=-.026,C.add(W),C.position.y=.04,C.material=U,g("knob",y,M,C)};for(let y=0;y<6;y++)p((y-2.5)*.095,-.2),p((y-2.5)*.095,-.36);for(let y of[-1,1])for(let M=0;M<6;M++)p(y*(1.78+M%2*.17)+y*.1,-.34+Math.floor(M/2)*.16+0);for(let y of[-1,1])for(let M=0;M<10;M++){let C=new Q(new Pe(.03,.008,.026),At());C.position.set(y*.305,.012,.4-M*.034),a.add(C),e.vu.push({m:C.material,i:M,sx:y})}let A=[];for(let y=0;y<44;y++)A.push([(y-21.5)*.094,-.56,.6]);for(let y of[-1,1])for(let M=0;M<12;M++)A.push([y*(1.74+M%4*.085),.2+Math.floor(M/4)*.085,.6]);for(let y of[-1,1])for(let M=0;M<6;M++)A.push([y*(.42+M%3*.15),.34+Math.floor(M/3)*.1,.9]);e.btn=new En(new Pe(.06,.016,.05),new We({color:16777215}),A.length),e.btnPos=A;let E=new De;A.forEach((y,M)=>{E.makeScale(y[2]/.6,1,y[2]/.6),E.setPosition(y[0],.012,y[1]),e.btn.setMatrixAt(M,E)}),e.btn.instanceColor=new an(new Float32Array(A.length*3),3),a.add(e.btn);let v=y=>{let M=fn[y],C=new Uint8Array(M.length);for(let U=0;U<M.length;U++)C[U]=M[U]*255;let L=new ws(C,M.length,1,gr);return L.needsUpdate=!0,L.magFilter=Pt,L},P=(y,M,C,L=.2,U=.3)=>{let F=new ct({transparent:!0,depthWrite:!1,blending:qt,side:Bt,uniforms:{uWave:{value:v(C)},uPos:{value:0},uN:{value:fn[C].length},uA:{value:new he},uB:{value:new he},uKick:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:`uniform sampler2D uWave; uniform float uPos,uN,uKick; uniform vec3 uA,uB; varying vec2 vUv;
        void main(){ float cols = 72.0; float cx = floor(vUv.x*cols); float idx = uPos + (cx - cols*0.5);
          float v = texture2D(uWave, vec2((idx+0.5)/uN, 0.5)).r; float gap = step(0.18, fract(vUv.x*cols));
          float y = abs(vUv.y-0.5)*2.0; float bar = step(y, 0.06 + v*0.9) * gap;
          float beat = step(mod(idx, 4.0), 0.5); float head = smoothstep(0.012, 0.0, abs(vUv.x-0.5));
          vec3 c = mix(uA, uB, y) * bar * (0.55 + 0.25*beat) * (cx < cols*0.5 ? 0.45 : 1.0);
          c += vec3(1.0)*head*(0.8+uKick); float fr = step(0.985, max(abs(vUv.x-0.5)*2.0, y)); c += mix(uA,uB,0.5)*fr*0.5;
          c += uA*0.05; gl_FragColor = vec4(c, 1.0); }`}),W=new Q(new $t(M,U),F);return W.position.set(y,L,.62),W.rotation.x=-.5,a.add(W),e.screens.push(F),W};P(-1.22,.95,"low"),P(1.22,.95,"high"),P(0,1.1,"full",.24,.36),e.core=new lt,e.core.position.set(0,.62,.3),a.add(e.core);for(let y=0;y<3;y++){let M=new Q(new gi(.1+y*.045,.006,4,9),new We({color:16777215,transparent:!0,blending:qt,depthWrite:!1}));e.core.add(M)}e.coreDot=new Q(new Zn(.035,10,8),At(16777215)),e.core.add(e.coreDot);let w=new Q(new Pe(4.36,1.2,.14),t);w.position.set(0,un+.56,Zo+.42),s.add(w),e.panel=new ct({uniforms:{uBeat:{value:0},uKick:{value:0},uLow:{value:0},uMid:{value:0},uHigh:{value:0},uA:{value:new he},uB:{value:new he}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:`uniform float uBeat,uKick,uLow,uMid,uHigh; uniform vec3 uA,uB; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
      void main(){ vec2 cells = vec2(44.0, 14.0); vec2 id = floor(vUv*cells); vec2 f = fract(vUv*cells)-0.5;
        float x = abs(id.x/cells.x - 0.5)*2.0;                         // bass in the middle, hats at the edges
        float lvl = mix(uLow, uMid, smoothstep(0.0,0.55,x)); lvl = mix(lvl, uHigh, smoothstep(0.5,1.0,x));
        lvl = lvl * (0.55 + 0.45*h(vec2(id.x, floor(uBeat*4.0)))) * (0.95 + 0.6*uKick) + 0.08;
        float row = (id.y+0.5)/cells.y; float on = step(row, lvl); float peak = step(abs(row - min(0.97, lvl + 0.1)), 0.04);
        float led = smoothstep(0.48,0.3,max(abs(f.x),abs(f.y)));
        vec3 c = mix(uA, uB, row) * on * (0.5 + row) + vec3(1.0)*peak*0.7;
        c += mix(uA,uB,0.5) * 0.035; gl_FragColor = vec4(c*led*1.5, 1.0); }`});let R=new Q(new $t(4.16,1.02),e.panel);R.position.set(0,un+.58,Zo+.495),s.add(R);for(let y of[un+.03,un+1.13]){let M=new Q(new Pe(4.4,.03,.03),At(16777215));M.position.set(0,y,Zo+.5),s.add(M),e.rings.push({m:M.material,k:1.4})}for(let y of[-1,1])for(let M=0;M<4;M++){let C=y*(2.75+M*.42),L=2.3-M*.36,U=new Q(new Pe(.16,L,.16),t);U.position.set(C,un+L/2,_t+1.25-M*.22),s.add(U);let F=new Q(new Pe(.07,L-.2,.03),At(16777215));F.position.set(C,un+L/2,_t+1.34-M*.22),s.add(F);let W=new Q(new Zn(.09,10,8),At(16777215));W.position.set(C,un+L+.06,_t+1.25-M*.22),s.add(W),e.towers.push({m:F.material,c:W.material,k:M,sx:y})}let D=new he,b=new he(1,1,1);return e.update=(y,M,C,L,U,F,W,J,I)=>{let Y=e.panel.uniforms;Y.uBeat.value=M,Y.uKick.value=C,Y.uLow.value=U,Y.uMid.value=F,Y.uHigh.value=W,Y.uA.value.copy(J),Y.uB.value.copy(I);let se=M*4+fn.pre;for(let V of e.screens)V.uniforms.uPos.value=se,V.uniforms.uA.value.copy(J),V.uniforms.uB.value.copy(I),V.uniforms.uKick.value=C;e.edge.material.color.copy(J).multiplyScalar(.5+1.8*C*L),e.edge2.material.color.copy(I).multiplyScalar(.3+1.2*(1-C)*L),e.trim.material.color.copy(I).multiplyScalar(.6+1.5*C);for(let V of e.rings){let Z=V.blink!=null?Math.floor(M*2+V.blink*1.3)%4===0?1.8:.35:1;V.m.color.copy(V.blink!=null&&V.blink%2?I:J).multiplyScalar(V.k*Z*(.5+.8*C))}for(let V of e.vu){let Z=(V.sx<0?U:(F+W)*.6)*(.6+.5*C)*10,O=V.i<Z;D.setHex(V.i>7?16724016:V.i>5?16760896:4259728),V.m.color.copy(D).multiplyScalar(O?1.6:.07)}for(let V of e.towers){let Z=(Math.floor(M)+(V.sx>0?0:2))%4===V.k?1:0,O=.12+L*(.35+1.9*Z*C+.5*C);V.m.color.copy(V.k%2?J:I).multiplyScalar(O),V.c.color.copy(V.k%2?I:J).multiplyScalar(.3+2.2*Z*C*L)}let le=e.color||J;for(let V=0;V<e.btnPos.length;V++){let O=Nn(V*12.9+Math.floor(M*2+V*.37)*.618)>.72-.25*L;D.copy(V%5===0?I:V%7===0?b:le).multiplyScalar(O?1.5+C:.1),e.btn.instanceColor.setXYZ(V,D.r,D.g,D.b)}e.btn.instanceColor.needsUpdate=!0,e.xf.position.x=.14*Math.sin(M*Math.PI/8),e.xf.material.color.copy(le).multiplyScalar(1.4),e.core.children.forEach((V,Z)=>{Z<3&&(V.rotation.set(M*.4*(Z+1)*.5,M*.3*(Z%2?-1:1),Z),V.material.color.copy(Z%2?J:I).multiplyScalar(.8+C))}),e.core.scale.setScalar(.9+.35*C*L+.3*F),e.coreDot.material.color.copy(b).multiplyScalar(1+2*C);for(let V of e.platters)V.segs.forEach((Z,O)=>Z.color.copy(O%2?J:I).multiplyScalar((Math.floor(M*2)%9===O?2.4:.25)+V.hit))},e}var Zx=["Thumb","Index","Middle","Ring"],ta=class{constructor(e,t){this.c=e,this.booth=t;let n=e.bones;e.root.position.set(0,0,_t-.12),this.arms=["Left","Right"].map(c=>({s:c,sh:n[c+"Shoulder"],up:n[c+"Arm"],lo:n[c+"ForeArm"],hand:n[c+"Hand"],fingers:Zx.map(h=>[n[c+"Hand"+h+"1"],n[c+"Hand"+h+"2"],n[c+"Hand"+h+"3"]]).filter(h=>h[0])})),e.root.updateMatrixWorld(!0);for(let c of this.arms)c.sx=Math.sign(c.up.getWorldPosition(mt()).x)||1,c.pool=h=>t.controls.filter(u=>u.kind===h&&u.side===c.sx);let i=this.arms[0];this.armLen=i.up.getWorldPosition(mt()).distanceTo(i.lo.getWorldPosition(mt()))+i.lo.getWorldPosition(mt()).distanceTo(i.hand.getWorldPosition(mt()));let r=i.fingers[2]||i.fingers[0],o=i.hand.getWorldPosition(mt()).distanceTo(r[0].getWorldPosition(mt())),a=r[0].getWorldPosition(mt()).distanceTo(r[1].getWorldPosition(mt())),l=r[1].getWorldPosition(mt()).distanceTo(r[2].getWorldPosition(mt()));this.tentLen=o+a+l*2.2,this.shoulderY=i.up.getWorldPosition(mt()).y,this.hover=na+.42-this.shoulderY,this.legs=["LeftUpLeg","RightUpLeg","LeftLeg","RightLeg","LeftFoot","RightFoot","LeftToeBase","RightToeBase"].map(c=>n[c]).filter(Boolean).map(c=>({bn:c,q:c.quaternion.clone()})),this.proc=[n.Neck,n.Head,n.Spine,n.Spine1,n.Spine2,...this.arms.flatMap(c=>[c.sh,c.up,c.lo,c.hand,...c.fingers.flat()])].filter(Boolean).map(c=>({bn:c,q:c.quaternion.clone()})),this.info={armLen:this.armLen,tentLen:this.tentLen,shoulderY:this.shoulderY,hover:this.hover}}plan(e){let t=Math.floor(e/4),n=Bs(t),i=Math.floor(e),r=Er.includes(t),o=_r.some(l=>t>=l&&t<l+2),a={cast:0,hands:[{mode:"mix"},{mode:"mix"}],step:2};if(t<2?a.hands=[{mode:"free"},{mode:"free"}]:t<3?a.hands=[{mode:"free"},{mode:"mix"}]:n.mode==="rumble"||n.mode==="build"||n.mode==="rise"?a.step=4:n.mode==="break"?(a.hands=t%4===3?[{mode:"mix"},{mode:"free"}]:[{mode:"free"},{mode:"free"}],a.step=4):n.mode==="outro"&&(a.hands=[{mode:"free"},{mode:"free"}]),r&&(a.cast=1,a.hands=[{mode:"free"},{mode:"free"}]),o){let l=t%2;a.hands[l]={mode:"up"},(t===72||t===20)&&i%4<2&&_r.includes(t)&&(a.hands=[{mode:"up"},{mode:"up"}])}else n.kick&&t%8===7&&(a.hands[(t>>3)%2]={mode:"up"});return a}focusOf(e,t,n,i){let r=["platter","pad","fader","knob","platter","pad"];return r[Math.floor(Nn(n*7.3+t*31.7+i)*r.length)]}tips(e,t,n,i,r,o){let a=e.pool(n),l=this.booth.desk,c=Math.floor(r*2);for(let h=0;h<4;h++){let u,f=0,d=0,g=.03;if(n==="platter"){u=a[0];let x=h/4*Math.PI*1.2-.6+(e.sx>0?Math.PI:0)+Math.sin(r*Math.PI*2)*.5*(i%2?1:.4);f=Math.sin(x)*u.r,d=Math.cos(x)*u.r*.9,g=.07}else if(n==="pad"){u=a[Math.floor(Nn(i*3.1+h*17.3+t*5+Math.floor((c+h)/2)*.77)*a.length)];let x=(r*2+h*.5)%1;g=.04+.1*Math.sin(Math.min(1,x*1.6)*Math.PI)}else if(n==="fader")u=a[(h+i)%a.length],g=.06;else{let x=a.filter(p=>Math.abs(p.x)<1==(i%2===0)),m=x.length>=4?x:a;u=m[(h*2+i)%m.length],g=.08}o[h]={c:u,p:l.localToWorld(mt().set(u.x+f,g,u.mesh.position.z+d))}}return o}update(e,t,n){let i=this.c,r=i.bones,o=this.booth,a=Math.floor(t/4),c=Bs(a).energy;for(let v of o.controls)v.hit*=.86,v.kind==="platter"&&(v.spin.rotation.y=-t*.9*(v.side>0?1:.97)+(v.scr||0)),v.kind==="fader"&&(v.mesh.position.z=v.z0+.15*Math.sin(t*.3927+v.ph)*(.4+c));for(let v of this.proc)v.bn.quaternion.copy(v.q);let h=this.plan(t),u=this.plan(t-1),f=t-Math.floor(t),d=u.cast+(h.cast-u.cast)*ks(0,.6,f),x=[{clip:"Floating",time:(t/8%1+1)%1*i.clips.Floating.duration,weight:1-d}];if(d>.001){let v=t/4%1;x.push({clip:"Two_Hand_Spell_Casting",time:(.12+.62*v)*i.clips.Two_Hand_Spell_Casting.duration,weight:d})}i.pose(x);let m=ks(-1.5,7,t),p=ks(398,402.4,t);i.root.position.y=this.hover-2.6*(1-m)-3*p+.05*Math.sin(t*Math.PI/2)-.035*n*c,i.root.rotation.y=.12*Math.sin(t*Math.PI/8),i.root.position.x=.22*Math.sin(t*Math.PI/4)*(.4+c*.6),i.root.updateMatrixWorld(!0),this.legs.forEach((v,P)=>{v.bn.quaternion.copy(v.q),P<4&&(v.bn.updateWorldMatrix(!0,!1),Fs(v.bn,wi.set(1,0,0),(P<2?-.28:-.12)+.07*Math.sin(t*Math.PI/2+P*1.7)),Fs(v.bn,wi.set(0,0,1),.05*Math.sin(t*Math.PI/4+P)))});let A=.2*(1-d);r.Spine&&Fs(r.Spine,wi.set(1,0,0),A),r.Spine1&&Fs(r.Spine1,wi.set(1,0,0),A*.8),Fs(r.Neck||r.Head,wi.set(1,0,0),.1*n*(.3+c)-.12),this.arms.forEach((v,P)=>{let w=h.hands[P],R=u.hands[P],D=(R.mode==="mix"?1:0)+((w.mode==="mix"?1:0)-(R.mode==="mix"?1:0))*ks(0,.7,f),b=(R.mode==="up"?1:0)+((w.mode==="up"?1:0)-(R.mode==="up"?1:0))*ks(0,.5,f),y=Math.min(1,D+b);if(y<.002){this.wiggle(v,P,t,.5);return}let M=h.step,C=Math.floor((t+P*1)/M),L=(t+P*1)/M%1,U=this.focusOf(v,P,C,M),F=this.focusOf(v,P,C-1,M),W=this.tips(v,P,F,C-1,t,[]),J=this.tips(v,P,U,C,t,[]),I=ks(0,.42/M*2,L),Y=J.map((G,ee)=>({c:G.c,p:W[ee].p.clone().lerp(G.p,I)})),se=mt();Y.forEach(G=>se.add(G.p)),se.multiplyScalar(.25);let le=Math.min(.34,this.tentLen*.55),V=se.clone().add(Gi.set(-v.sx*.04,le+.05*Math.sin(I*Math.PI),-.16));v.up.getWorldPosition(Qo);let Z=Qo.clone().add(Gi.set(v.sx*.28,this.armLen*(.86+.12*n),.22+.1*Math.sin(t*Math.PI))),O=V.clone().lerp(Z,b/Math.max(1e-4,D+b));if(this.ik(v,O,y),b<.5){let G=v.fingers[Math.min(2,v.fingers.length-1)][0];br(v.hand,G.getWorldPosition(Sr),$o.copy(se).sub(v.hand.getWorldPosition(Gi)).add(wi.set(0,-.05,.1)),y*.85),v.fingers.forEach((ee,ie)=>{let ce=Y[ie%Y.length];ee[0].getWorldPosition(Gi);let xe=wi.copy(Gi).lerp(ce.p,.5);xe.y+=.07+.03*Math.sin(t*3+ie),br(ee[0],ee[1].getWorldPosition(Sr),xe.sub(Gi),y),br(ee[1],ee[2].getWorldPosition(Sr),$o.copy(ce.p).sub(ee[1].getWorldPosition(Gi)),y),I>.9&&y>.8&&(ce.c.hit=Math.max(ce.c.hit,ce.c.kind==="pad"?(t*2+ie*.5)%1<.25?1:ce.c.hit:.75),ce.c.kind==="platter"&&(ce.c.scr=Math.sin(t*Math.PI*2)*.5*(C%2?1:.4)))})}else this.wiggle(v,P,t,1.6,!0)});let E=o.color||new he(4184319);for(let v of o.controls){let w=(v.kind==="pad"?.1+.5*(Nn(v.x*91+v.z*37+Math.floor(t*2)*.13)>.8?c:0):.22)+v.hit*3.2,R=v.kind==="platter"?v.ring.material:v.mesh.material;v.kind==="knob"&&(v.mesh.rotation.y=Math.sin(t*.6+v.x*9)*1.2+v.hit),R.color.copy(E).multiplyScalar(w),v.hit>.3&&R.color.lerp(Qx,.35*v.hit),v.kind==="platter"&&v.spin.children.forEach(D=>{D.geometry.type!=="RingGeometry"&&D.material.color.copy(E).multiplyScalar(.5+1.5*n)})}}wiggle(e,t,n,i,r){e.fingers.forEach((o,a)=>{for(let l=0;l<2;l++){let c=i*.16*Math.sin(n*Math.PI*(r?2:.5)+a*1.3+l*.9+t);Fs(o[l],wi.set(Math.sin(a*2.1),.2,Math.cos(a*2.1)).normalize(),c+(r?(a-1.5)*.12*(l===0?1:0):0))}})}ik(e,t,n){let i=e.up.getWorldPosition(mt()),r=e.lo.getWorldPosition(mt()),o=e.hand.getWorldPosition(mt()),a=i.distanceTo(r),l=r.distanceTo(o),c=t.clone().sub(i),h=c.length();h=Math.max(.05,Math.min(a+l-.004,h)),c.normalize();let u=(a*a-l*l+h*h)/(2*h),f=Math.sqrt(Math.max(0,a*a-u*u)),d=mt().set(e.sx*.9,.25,-.75);d.addScaledVector(c,-d.dot(c)).normalize();let g=i.clone().addScaledVector(c,u).addScaledVector(d,f);br(e.up,r,g.clone().sub(i),n);let x=e.lo.getWorldPosition(mt());br(e.lo,e.hand.getWorldPosition(mt()),i.clone().addScaledVector(c,h).sub(x),n)}},Qx=new he(1.6,1.6,1.6);var Ke=(s,e,t)=>{let n=Math.max(0,Math.min(1,(t-s)/(e-s)));return n*n*(3-2*n)},Et=(s,e,t)=>s+(e-s)*t,Tn=["skitter","elyra","kryvax","murm","vexl","brontor","thulkar"],Tr={brontor:1,thulkar:1};function $x(s){let e=[{bar:0,cast:[]},{bar:4,cast:["skitter"],solo:"skitter"},{bar:6,cast:["skitter","elyra"],solo:"elyra"},{bar:8,cast:["skitter","elyra","kryvax"],solo:"kryvax"},{bar:10,cast:["skitter","elyra","kryvax","murm"],solo:"murm"},{bar:12,cast:["skitter","elyra","kryvax","murm"],solo:"elyra"},{bar:16,cast:["skitter","elyra","kryvax","murm","vexl"],solo:"vexl"},{bar:20,cast:Tn,solo:"brontor",duo:"thulkar"},{bar:24,cast:["murm","skitter","kryvax","brontor","vexl"],solo:"murm"},{bar:28,cast:["skitter","kryvax","elyra","thulkar","vexl"],solo:"skitter"},{bar:32,cast:["kryvax","elyra","murm","thulkar","brontor"],solo:"kryvax"},{bar:36,cast:["thulkar","murm","skitter","vexl","elyra"],solo:"thulkar"},{bar:40,cast:["vexl","brontor","kryvax","skitter","murm"],solo:"vexl"},{bar:44,cast:Tn,unison:"HipHop"},{bar:48,cast:["brontor","elyra","murm","kryvax"],solo:"brontor"},{bar:52,cast:["elyra","skitter","vexl","thulkar","murm"],solo:"elyra"},{bar:55,cast:["elyra"],solo:"elyra",fly:!0},{bar:60,cast:["elyra","murm"],solo:"murm",fly:!0},{bar:64,cast:["elyra","murm","skitter"],solo:"skitter"},{bar:66,cast:["elyra","murm","skitter","kryvax","vexl"],solo:"kryvax"},{bar:68,cast:["elyra","murm","skitter","kryvax","vexl","brontor"],solo:"brontor"},{bar:70,cast:Tn,solo:"thulkar"},s?{bar:72,cast:[...Tn,"warden"],solo:"warden",unison:"Silly",wardenShow:!0}:{bar:72,cast:Tn,unison:"Silly"},s?{bar:76,cast:[...Tn,"warden"],solo:"warden",unison:"Silly",wardenShow:!0}:{bar:76,cast:Tn,solo:"thulkar",duo:"brontor"},{bar:80,cast:["kryvax","skitter","elyra","murm","vexl"],solo:"kryvax"},{bar:84,cast:["murm","brontor","thulkar","skitter","elyra"],solo:"murm"},{bar:88,cast:["skitter","vexl","kryvax","thulkar","brontor"],solo:"skitter"},{bar:92,cast:Tn,solo:"elyra"},{bar:96,cast:Tn,unison:"Boom"},{bar:98,cast:Tn,bow:!0},{bar:99.5,cast:[]}];return e.forEach((t,n)=>{t.i=n,t.beat=t.bar*4,t.end=(e[n+1]?e[n+1].bar:df)*4,t.slots=ev(t)}),e}function ev(s){let e={},t=s.cast.filter(r=>r!=="warden");if(s.wardenShow)return e.warden=[0,-1.2],t.forEach((r,o)=>{let a=Et(-1.25,1.25,o/(t.length-1));e[r]=[Math.sin(a)*6,2.6+Math.cos(a)*2.6-1.2]}),e;if(s.unison||s.bow){let r=[...t].sort((a,l)=>(Tr[a]||0)-(Tr[l]||0)),o=[[0,3.6],[-2.5,2],[2.5,2],[-4.6,.3],[4.6,.3],[-2.4,-2.2],[2.4,-2.2]];return r.forEach((a,l)=>e[a]=o[l]||[0,0]),e}let n=[s.solo,s.duo].filter(Boolean),i=t.filter(r=>!n.includes(r)).sort((r,o)=>Nn(r.length*3.3+s.bar+r.charCodeAt(1))-Nn(o.length*3.3+s.bar+o.charCodeAt(1)));return n.length===1?e[n[0]]=[0,3.2]:n.length===2&&(e[n[0]]=[-2.2,3],e[n[1]]=[2.2,3]),i.forEach((r,o)=>{let a=i.length,l=a===1?s.bar%4?.7:-.7:Et(-1.15,1.15,o/(a-1)),c=5.2+(Tr[r]?.5:0)-(a>4&&o%2?1.5:0);e[r]=[Math.sin(l)*c,2.4-Math.cos(l)*c*.82]}),e}var jc=(s,e)=>{let t=s[0];for(let n of s)e>=n.beat&&(t=n);return t},wr={HipHop:["elyra","Hip_Hop_Dancing"],Rumba:["kryvax","Rumba_Dancing"],Silly:["murm","Silly_Dancing"],Boom:["brontor","Boom_Dance"]},Yc={elyra:[["Dwarf_Idle","L","l"],["Floating","L","l"],["HipHop","L","mh"],["Rumba","L","mh"],["Silly","L","h"],["Boom","L","mh"],["Standing_2H_Magic_Area_Attack_02","P","mh"],["Mma_Kick","P","h"]],kryvax:[["Unarmed_Idle_01","L","l"],["Rumba","L","mh"],["HipHop","L","mh"],["Boom","L","mh"],["Silly","L","h"],["Flying_Kick","P","h"],["Jumping","P","h"]],murm:[["Orc_Idle","L","l"],["Silly","L","mh"],["HipHop","L","mh"],["Rumba","L","mh"],["Boom","L","h"],["Standing_Torch_Jump","P","h"],["Roundhouse_Kick","P","h"]],skitter:[["Ready_Idle","L","l"],["HipHop","L","mh"],["Silly","L","mh"],["Rumba","L","mh"],["Boom","L","h"],["Martelo_2","P","h"],["Dodging","P","mh"],["Kicking","P","h"]],brontor:[["Alert","L","l"],["Boom","L","mh"],["HipHop","L","mh"],["Silly","L","h"],["Attack","P","h"],["Skill_03","P","h"]],thulkar:[["Nervously_Look_Around","L","l"],["Punching_Bag","L","mh"],["Cross_Punch","P","mh"],["Elbow_Punching","P","h"],["Hook_Punch","P","h"],["Rifle_Jump","P","h"],["Roundhouse_Kick","P","h"],["Punching","P","h"],["Stabbing","P","mh"]],vexl:[["Standing_Idle","L","l"],["HipHop","L","mh"],["Rumba","L","mh"],["Silly","L","mh"],["Boom","L","h"],["Two_Hand_Spell_Casting","P","mh"],["Sumo_High_Pull","P","h"],["Fist_Fight_A","L","h"]],warden:[["Orc_Idle","L","l"],["Silly","L","h"],["HipHop","L","h"],["Boom","L","h"],["Jump","P","h"],["Hurricane_Kick","P","h"],["Great_Sword_Jump_Attack","P","h"],["Standing_Melee_Attack_Downward","P","h"],["Fist_Fight_B","L","h"]]},tv=[2,4,6,8,12,16];function nv(s){let e=s/fn.P,t=4,n=9;for(let i of tv){let r=Math.abs(Math.log(i/e));r<n&&(n=r,t=i)}return t}function iv(s){let e={};for(let t in Yc){let n=s[t];if(n){for(let i in wr){let[r,o]=wr[i];if(t==="thulkar")continue;let a=t==="vexl"?{skip:/Leg|Foot|Toe|Hips/}:{};n.adopt(i,s[r].clips[o],s[r],a)}if(t==="vexl")for(let i of Yc.vexl)wr[i[0]]||n.adopt("v_"+i[0],n.clips[i[0]],n,{skip:/Leg|Foot|Toe|Hips/});e[t]=Yc[t].filter(i=>t!=="thulkar"||!wr[i[0]]).map(i=>{let r=t==="vexl"&&!wr[i[0]]?"v_"+i[0]:i[0],o=n.clips[r].duration;return{clip:r,mode:i[1],tiers:i[2],dur:o,beats:nv(o)}})}}return e}var Kc=s=>s.mode==="drop"||s.mode==="groove"?"h":s.mode==="build"||s.mode==="rise"?"m":"l";function Jc(s,e,t){let n=s.beats*t,i=e/n;return s.mode==="L"?(i=(i%1+1)%1,i*s.dur):(i=(i%2+2)%2,i=i>1?2-i:i,i=i*i*(3-2*i)*.94+.03,i*s.dur)}var ii={omen:[16717616,8006911],violet:[10108159,16722570],cyanmag:[1630463,16722120],amber:[16752664,9059583],acid:[4259728,1609983],ice:[2780159,3205328],white:[16777215,16719920],gold:[16760896,16734736],blood:[16722464,16756832]},mf=["cyanmag","amber","acid","violet","blood"];function sv(s,e,t){return t?ii.gold:s.mode==="intro"||s.mode==="rumble"?ii.omen:s.mode==="build"?ii.violet:s.mode==="break"?ii.ice:s.mode==="rise"?ii.violet:s.mode==="drop"?e.bar===44?ii.cyanmag:ii.white:s.mode==="outro"?ii.omen:ii[mf[e.i%mf.length]]}var wn=new N,ia=new N,dn=new De,Zc=new Tt,Ti=new N,zt=new he,Qc=new he,gf=new on,$c=new Tt,xf=new N,rv=new N(0,-1,0),vf=new N(0,1,0),sa=class{constructor({scene:e,camera:t,stage:n,booth:i,chars:r,dj:o,lights:a}){Object.assign(this,{scene:e,camera:t,stage:n,booth:i,chars:r,dj:o,lights:a}),this.lib=iv(r),this.setWarden(!1),this.colA=new he,this.colB=new he,this.dancers={};for(let l of[...Tn,"warden"]){let c=r[l];if(!c)continue;e.add(c.root),c.root.visible=!1;let h=new he(ti[l].color),u=new vt(1,1,1,20,1,!0);u.translate(0,.5,0);let f=new Q(u,jo(!0));f.material.uniforms.uColor.value.copy(h).lerp(new he(16777215),.3),f.renderOrder=6,f.scale.set(c.info.h*.28,14,c.info.h*.28),e.add(f);let d=new Q(new ln(1.5,32),new We({map:n.glowTex,color:h,transparent:!0,opacity:0,blending:qt,depthWrite:!1}));d.rotation.x=-Math.PI/2,d.position.y=.03,e.add(d),this.dancers[l]={c,beam:f,pool:d,col:h,pos:new N,vis:0}}this.solo=null,this.onSolo=null,this.shotName="",this.camPos=new N(0,3.2,15),this.camLook=new N(0,2.2,-2)}setWarden(e){this.wardenOn=!!e,this.S=$x(this.wardenOn)}slot(e,t){return e.slots[t]}place(e,t){let n=this.S,i=jc(n,t),r=n[i.i-1]||n[0],o=i.cast.includes(e),a=r.cast.includes(e)&&i.i>0,l=t-i.beat,c=0,h=0,u=0,f=0;if(o&&a){let d=Ke(0,4,l),g=r.slots[e],x=i.slots[e];h=Et(g[0],x[0],d),u=Et(g[1],x[1],d),c=1}else if(o){let d=i.slots[e];h=d[0],u=d[1],c=Ke(0,1.6,l),f=1-Math.abs(2*Ke(0,2.4,l)-1),l>2.4&&(f=0)}else if(a){let d=r.slots[e];h=d[0],u=d[1],c=1-Ke(.2,1.6,l),f=l<2.2?1-Math.abs(2*Ke(0,2.2,l)-1):0}return{vis:c,x:h,z:u,fx:f,p:i,prev:r,lb:l,inNow:o}}pickMove(e,t,n,i){let r=this.lib[e],o=Math.floor(t/4),a=Er.includes(o),l=Kc(i);(a||n.bow)&&(l="l");let c=n.solo===e||n.duo===e,h=Math.floor(t/8),u=c?h:Math.floor(h/2),f=(c?h:Math.floor(h/2)*2)*8;if(e==="warden"){let p={72:"Orc_Idle",73:"Great_Sword_Jump_Attack",78:"Hurricane_Kick",79:"Standing_Melee_Attack_Downward"}[o]||(o>=74&&o<78?"Silly":"Orc_Idle"),A=r.find(v=>v.clip===p),E=o>=74&&o<78?296:o*4;return{m:o===73||o===79?{...A,mode:"O",beats:4}:A,start:E,slow:1}}if(n.fly&&e==="elyra")return{m:r.find(p=>p.clip==="Floating"),start:n.beat,slow:2};if(n.unison&&l==="h"&&e!=="thulkar"){let m=r.find(p=>p.clip===n.unison);if(m)return{m,start:n.beat,slow:1}}let d=r.filter(m=>m.tiers.includes(l)),g=Math.floor(Nn(u*5.71+e.charCodeAt(0)*1.37+e.length)*d.length),x=Math.floor(Nn((u-1)*5.71+e.charCodeAt(0)*1.37+e.length)*d.length);return g===x&&d.length>1&&(g=(g+1)%d.length),{m:d[g],start:f,slow:l==="m"?2:l==="l"?1.5:1}}update(e,t){let n=Ko(e),i=Math.floor(n/4),r=n-Math.floor(n),o=Bs(i),a=jc(this.S,n),l=Jo("low",e),c=Jo("mid",e),h=Jo("high",e),u=Er.includes(i),f=n/4-i,d=_r.find(M=>i>=M&&i<M+4),g=d!=null?n-d*4:99,x=o.kick?Math.exp(-r*5.5):.35*Math.exp(-((n/2%1+1)%1)*3)*(.4+l),m=o.energy;o.mode==="rise"&&(m=Et(.3,.8,(n/4-64)/8)),u&&(m*=1-.75*f),n<0&&(m=0);let p=g>=0&&g<1.2?.6*Math.exp(-g*3.2)*(this.calm?.25:1):0,A=!!a.wardenShow,E=n-288,v=this.wardenOn?Ke(-10,0,E)*(1-Ke(30,33,E)):0,P=sv(o,a,A&&E>0);zt.setHex(P[0]),Qc.setHex(P[1]);let w=Math.min(1,t*4+(p>.5?1:0));this.colA.lerp(zt,w),this.colB.lerp(Qc,w);let R=this.colA,D=this.colB;this.state={beatF:n,bar:i,sec:o,p:a,kick:x,energy:m,flash:p,low:l,mid:c,high:h,pre:u,barF:f};let b=null,y=a.solo&&a.cast.includes(a.solo)?a.solo:null;for(let M in this.dancers){let C=this.dancers[M],L=C.c,U=this.place(M,n);if(M==="warden"){this.updateWarden(C,U,n,x,E),y==="warden"&&C.c.root.visible&&(b=C.c.root.position);continue}if(C.vis=U.vis,L.root.visible=U.vis>.004,C.beam.material.uniforms.uI.value=U.fx*.9,C.beam.visible=U.fx>.01,C.beam.position.set(U.x,0,U.z),C.beam.scale.x=C.beam.scale.z=L.info.h*(.14+.2*U.fx),C.pool.position.set(U.x,.03,U.z),C.pool.scale.setScalar(L.info.h*(.55+.12*x)),C.pool.material.opacity=U.vis*(.1+.22*x*m)+U.fx*.5,!L.root.visible)continue;let F=this.pickMove(M,n,U.p,o),W=this.pickMove(M,n-1,jc(this.S,n-1),Bs(Math.floor((n-1)/4))),J=F.m.clip===W.m.clip&&F.start===W.start,I=J?1:Ke(0,1,r),Y=[{clip:F.m.clip,time:Jc(F.m,n-F.start,F.slow),weight:I}];J||Y.push({clip:W.m.clip,time:Jc(W.m,n-W.start,W.slow),weight:1-I}),L.pose(Y),L.tether(.7);let se=y===M||U.p.duo===M,le=-.07*(L.info.h/1.8)*x*(.3+m)*(Tr[M]?1.5:1),V=Math.atan2(-U.x,9-U.z)*.55+.22*Math.sin(n*Math.PI/8+M.length),Z=U.x,O=U.z;if(M==="elyra"){let ee=Ke(220,228,n)*(1-Ke(250,256,n));le+=ee*(1.7+.25*Math.sin(n*Math.PI/4)),V+=ee*Math.sin(n*Math.PI/16)*1.2}M==="vexl"&&Kc(o)==="h"&&(Math.floor(n/8)%2===1&&(V+=n/8%1*Math.PI*2),Z+=.7*Math.sin(n*Math.PI/4),O+=.35*Math.sin(n*Math.PI/2)),M==="skitter"&&Kc(o)==="l"&&(Z+=.5*Math.sin(n*Math.PI/8)),g>=0&&g<1&&(le+=Math.sin(g*Math.PI)*.55*(Tr[M]?.5:1)),U.p.bow&&(V=Math.atan2(-U.x,12-U.z)),L.root.position.set(Z,le,O),L.root.rotation.y=V;let G=U.vis;L.root.scale.set(.35+.65*G,Math.pow(G,.6)*(1+.25*U.fx),.35+.65*G);for(let ee of L.mats)ee.emissiveMap&&(ee.emissiveIntensity=L.info.glow*(.4+.7*x*m+2*U.fx+(se?.2:0)));C.pos.set(Z,le,O),y===M&&(b=C.pos)}y!==this.solo&&(this.solo=y,this.onSolo&&this.onSolo(y,a)),this.updateLights(e,n,i,o,a,{kick:x,energy:m,flash:p,low:l,mid:c,high:h,pre:u,barF:f,soloPos:b,A:R,B:D,wardenGlow:v,wardenShow:A,sinceDrop:g}),this.updateCrowd(n,x,m,R,D,g),this.updateCamera(e,n,i,o,a,b,x,m,g,u,f,E)}updateWarden(e,t,n,i,r){let o=e.c,a=this.wardenOn&&r>-.5&&r<33;if(o.root.visible=a,e.beam.visible=!1,e.pool.material.opacity=0,!a)return;let l=this.pickMove("warden",n,t.p,{mode:"drop"}),c=this.pickMove("warden",n-1,t.p,{mode:"drop"}),h=n-Math.floor(n),u=l.m.clip===c.m.clip&&l.start===c.start,f=u?1:Ke(0,1,h),d=A=>A.m.mode==="O"?Math.min(1,(n-A.start)/A.m.beats)*A.m.dur*.98:Jc(A.m,n-A.start,A.slow),g=[{clip:l.m.clip,time:d(l),weight:f}];u||g.push({clip:c.m.clip,time:d(c),weight:1-f}),o.pose(g),o.tether(1.6);let x=Ke(0,3.5,r),m=Ke(30,32.6,r),p=-5.4*(1-x)-5.6*m+(x<1?.04*Math.sin(r*40):0)-.08*i;o.root.position.set(0,p,-1.2),o.root.rotation.y=.15*Math.sin(n*Math.PI/8),o.root.scale.setScalar(1),e.pos.copy(o.root.position)}updateLights(e,t,n,i,r,o){let{stage:a,booth:l,lights:c}=this,{kick:h,energy:u,flash:f,low:d,mid:g,high:x,pre:m,barF:p,soloPos:A,A:E,B:v,wardenGlow:P}=o,w=a.floorMat.uniforms;w.uBeat.value=t,w.uKick.value=h,w.uEnergy.value=u,w.uA.value.copy(E),w.uB.value.copy(v),w.uFlash.value=f,w.uWarden.value=P;let R=a.wallMat.uniforms;R.uBeat.value=t,R.uKick.value=h,R.uHigh.value=x,R.uMid.value=g,R.uA.value.copy(E),R.uB.value.copy(v),R.uFlash.value=f*.9;let b=((I,Y)=>Y.wardenShow&&t>=288?4:I.mode==="drop"?2:I.mode==="groove"?Y.i%3===0?0:1:I.mode==="break"?3:I.mode==="rise"||I.mode==="build"?1:0)(i,r);this._wallMode===void 0&&(this._wallMode=b,this._wallPrev=b,this._wallAt=-99),b!==this._wallMode&&(this._wallPrev=this._wallMode,this._wallMode=b,this._wallAt=t),R.uMode.value=this._wallPrev,R.uModeB.value=this._wallMode,R.uMix.value=Ke(0,1.5,Math.abs(t-this._wallAt)),R.uDim.value=(.25+.75*Math.min(1,u*1.4))*(t<0?.3:1)*(1-.96*Ke(398,402,t)),R.uClose.value=m?p*.97:0,a.moteMat.uniforms.uT.value=e,a.moteMat.uniforms.uColor.value.copy(E).lerp(v,.5),a.moteMat.uniforms.uI.value=.5+u+f*2,a.strips.forEach((I,Y)=>I.material.color.copy(Y%2?E:v).multiplyScalar(.25+1.6*h*u+f*3));let y=i.mode,M=a.beams.length,C=y==="groove"?["circle","cross","solo","wave"][r.i%4]:y==="drop"?"fan":y==="break"?"pillars":y==="rise"?"cross":y==="build"?"wave":y==="rumble"?"slow":y==="outro"?"pillars":"booth";for(let I of a.beams){let Y=I.i,se=Y/M*Math.PI*2,le=.5,V=I.target;if(C==="booth")V.set((Y-4)*.5,2.6,_t+.5),le=(Y%4===0?.55:0)*Ke(-2,8,t);else if(C==="slow")V.set(Math.sin(se+t*.1)*5,0,Math.cos(se*2+t*.07)*4),le=Y%3===Math.floor(t/8)%3?.6:.08;else if(C==="wave")V.set(Math.sin(se)*6,0,1+5*Math.sin(t*Math.PI/8+se)),le=.45+.4*x;else if(C==="circle"){let O=se+t*Math.PI/8;V.set(Math.sin(O)*4.5,0,Math.cos(O)*4.5+.5),le=.75}else if(C==="cross"){let O=se+Math.PI+.9*Math.sin(t*Math.PI/4+Y);V.set(Math.sin(O)*5.5,0,Math.cos(O)*5.5),le=.7}else if(C==="solo")A&&Y%3!==2?V.set(A.x+Math.sin(se)*.6,1,A.z+Math.cos(se)*.6):V.set(Math.sin(se+t*.4)*6,0,Math.cos(se+t*.4)*6),le=.75;else if(C==="fan"){let O=Math.sin(t*Math.PI/2+Y*.7);V.set(I.base.x*.2+O*7,o.sinceDrop<4?9+6*Math.abs(O):0,I.base.z*.2+Math.cos(t*Math.PI/2+Y)*6+(o.sinceDrop<4?8:0)),le=.6+.6*(Math.floor(t*2+Y)%2)}else C==="pillars"&&(V.set(I.base.x*.82,0,I.base.z*.82),le=Y%3===0?.55:0,A&&Y===4&&(V.set(A.x,A.y+1,A.z),le=.9));m&&(V.lerp(wn.set(0,3,_t+.4),Ke(0,.6,p)),le*=1-.85*p),o.wardenShow&&t>=288&&Y%2===0&&(V.set(Math.sin(se)*1.5,3+1.5*Math.sin(t+Y),-1.2+Math.cos(se)*1.5),le=.9),le*=(.55+.75*h)*Math.min(1,.25+u)*(1-Ke(396,402,t))+f*.8,wn.copy(V).sub(I.base).normalize(),I.dir.lerp(wn,.25).normalize(),I.head.quaternion.setFromUnitVectors(rv,I.dir);let Z=o.wardenShow&&t>=288?zt.setHex(16760912):Y%2?E:v;if(I.cone.material.uniforms.uColor.value.copy(Z),I.cone.material.uniforms.uI.value=le*1.1,I.lens.material.color.copy(Z).multiplyScalar(.3+le*3),I.dir.y<-.15){let O=-I.base.y/I.dir.y;I.pool.position.set(I.base.x+I.dir.x*O,.025,I.base.z+I.dir.z*O),I.pool.material.color.copy(Z),I.pool.material.opacity=Math.min(.6,le*.4),I.pool.visible=!0}else I.pool.visible=!1}let L=y==="groove"||y==="drop"||y==="rise"?Math.min(1,x*1.5)*(.4+.6*u):0;for(let I of a.lasers){let Y=(I.k-2.5)*.11*(1+.6*Math.sin(t*Math.PI/4))+.25*Math.sin(t*Math.PI/8+I.sx);wn.set(-I.sx*(.5+Y),-.16+.1*Math.sin(t*Math.PI/2+I.k),.85).normalize(),I.m.quaternion.setFromUnitVectors(vf,wn),I.m.material.opacity=L*(Math.floor(t*4+I.k)%3===0?.1:.5)*(I.k%2?1:.6),I.m.material.color.copy(I.k%2?E:v).lerp(zt.setHex(16777215),.25)}for(let I of a.speakers)I.cone.position.z=I.r*.16*h*d*I.amt,I.cone.scale.setScalar(1+.03*d*I.amt),I.ringM.color.copy(I.j%2?E:v).multiplyScalar(.25+2.4*h*u);for(let I of a.arrayLeds)I.m.color.copy(I.k%2?E:v).multiplyScalar(.15+(Math.floor(t*2)%7===I.k?2.6*u:0)+.5*h*u);let U=Math.max(Ke(-5,-1,t)*(1-Ke(9,13,t)),Ke(226,232,t)*(1-Ke(250,255,t)),Ke(389,393,t)*(1-Ke(401,403.5,t)));a.logoMat.opacity=U*(.92+.08*h),a.logo.visible=U>.005,a.logo.scale.setScalar(1+.012*h+.04*(1-U)),R.uDim.value*=1-.8*U,a.jets.forEach((I,Y)=>{let se=o.sinceDrop>=0&&o.sinceDrop<5?Math.exp(-o.sinceDrop*.7)*Math.min(1,o.sinceDrop*6):0;I.scale.set(1+(1-se)*.6,.01+7.5*se,1+(1-se)*.6),I.material.uniforms.uI.value=se*.8,I.visible=se>.01}),l.color=Qc.copy(E).lerp(zt.setHex(4184319),.45).clone(),l.update(e,t,h,u,d,g,x,E,v);let F=c,W=(.2+.8*Math.min(1,u*1.3))*(m?1-.8*p:1)*(1-Ke(396,402,t))*Ke(-4,8,t);F.hemi.intensity=.05+.12*u+f*.8,F.hemi.color.copy(E).lerp(zt.setHex(16777215),.5),F.hemi.groundColor.copy(v).multiplyScalar(.4),F.spotA.color.copy(E).lerp(zt.setHex(16777215),.45),F.spotB.color.copy(v).lerp(zt,.45),F.fill.intensity=W*.55;let J=(.25+.75*Math.min(1,u*1.3))*(m?1-.8*p:1)*(1-Ke(396,402,t));F.spotA.intensity=J*(170+260*h),F.spotB.intensity=J*(170+260*(1-h)*u),F.back.color.copy(v).lerp(E,.5),F.back.intensity=J*(160+260*h)+f*900,F.console.color.copy(l.color),F.console.intensity=(5+5*h)*Ke(-4,6,t)*(1-Ke(398,402,t)),F.key.intensity=A?J*520:0,A&&(F.key.target.position.set(A.x,A.y+1.2,A.z),F.key.color.setHex(16773856)),F.strobe.intensity=f*4+(!this.calm&&y==="drop"&&o.sinceDrop<16&&o.sinceDrop>1.2&&Math.floor(t*4)%4===0?1.6*Math.exp(-(t*4%1)*4):0),F.warden.intensity=P*(60+45*h),this.fx={bloom:.42+.25*h*u+f*.7,exposure:(.92+.12*h*u+f*.5)*(t<0?.6+.4*Ke(-6,0,t):1)*(1-.97*Ke(399,403,t)),aberr:.0012+.004*h*u+f*.012}}updateCrowd(e,t,n,i,r,o){let a=this.stage,l=e-Math.floor(e),c=a.crowdKinds;for(let h=0;h<a.crowdN;h++){let u=a.crowd[h],f=c[u.kind],d=Math.max(0,Math.sin((l+u.ph*.18)*Math.PI))*.16*u.amp*n+(o>=0&&o<1?Math.sin(o*Math.PI)*.35:0),g=Math.sin(e*Math.PI/2+u.ph*6.28)*.07*(.4+n),x=u.h,m=u.w,p=Math.cos(u.yaw),A=Math.sin(u.yaw),E=(f.hover?f.hover*(1+.25*Math.sin(e*Math.PI/4+u.ph*6)):0)+d*(f.hover?.4:1);gf.set(0,u.yaw,g,"YXZ"),Zc.setFromEuler(gf),Ti.set(m,x,m),dn.compose(wn.set(u.x,E,u.z),Zc,Ti),f.mesh.setMatrixAt(u.n,dn);let v=(w,R,D,b)=>b.set(u.x+(w*p+D*A)*m+g*R*x*-p,E+R*x,u.z+(-w*A+D*p)*m),P=(e*.11+u.blink*7)%1<.03?0:1;for(let w=0;w<3;w++){let R=f.eyes[w];R?(v(R[0],R[1],R[2],wn),Ti.set(f.eyeS[0]*m,f.eyeS[1]*m*P,.6),dn.compose(wn,Zc,Ti),zt.setHex(u.eye).multiplyScalar(.55+.9*t*n),a.crowdEye.instanceColor.setXYZ(h*3+w,zt.r,zt.g,zt.b)):dn.makeScale(0,0,0),a.crowdEye.setMatrixAt(h*3+w,dn)}for(let w=0;w<2;w++){let R=w?1:-1;if(!f.sh){dn.makeScale(0,0,0),a.crowdArm.setMatrixAt(h*2+w,dn),a.crowdStick.setMatrixAt(h*2+w,dn);continue}let D=u.arms>.3||n>.9?1:.12,b=D*(.45+.55*n),y=Math.sin(e*Math.PI+u.ph*9+w*1.7)*.4*n,M=R*(.3+.25*(1-b))+y*.5,C=Et(-.85,.9,b),L=.25+.2*b;ia.set(M*p+L*A,C,-M*A+L*p).normalize();let U=f.arm*x*.8;v(R*f.sh[0],f.sh[1],0,wn),$c.setFromUnitVectors(vf,ia),Ti.set(f.thick||1,U,f.thick||1),dn.compose(xf.copy(wn).addScaledVector(ia,U*.5),$c,Ti),a.crowdArm.setMatrixAt(h*2+w,dn);let F=(u.hue>.4||w===0)&&b>.3;Ti.setScalar(F?1:.001),dn.compose(xf.copy(wn).addScaledVector(ia,U+.2),$c,Ti),a.crowdStick.setMatrixAt(h*2+w,dn),zt.copy((h+w)%2?i:r).multiplyScalar(.8+1.4*t*n+(n<.3?0:.4)),a.crowdStick.instanceColor.setXYZ(h*2+w,zt.r,zt.g,zt.b)}}for(let h of a.crowdMeshes)h.instanceMatrix.needsUpdate=!0;a.crowdArm.instanceMatrix.needsUpdate=a.crowdStick.instanceMatrix.needsUpdate=a.crowdEye.instanceMatrix.needsUpdate=!0,a.crowdStick.instanceColor.needsUpdate=a.crowdEye.instanceColor.needsUpdate=!0}updateCamera(e,t,n,i,r,o,a,l,c,h,u,f){let d=this.camera,g=i.mode,x=g==="groove"||g==="drop"?8:16,m=Math.floor(t/x),p=t/x%1,A={intro:["djrise"],rumble:["djclose","low","wide","djover"],build:["orbit","side","djover","wide"],drop:["wide","low","djclose","crane"],groove:["orbit","wide","djover","low","orbit","side","djclose","crane"],break:["fly","djclose","crane","fly"],rise:["low","djover","orbit","wide"],outro:["wide"]}[g]||["wide"],E=A[(m%A.length+A.length)%A.length];this.forceShot&&(E=this.forceShot),h&&(E="djclose"),c>=0&&c<8&&(E="wide"),this.wardenOn&&f>=-1&&f<33&&(E=f<8?"warden":m%3===0?"wide":m%3===1?"warden":"low"),t<14&&(E="djrise"),!o&&(E==="orbit"||E==="fly")&&(E="wide");let v=this.camPos,P=this.camLook,w=42,R=m%2?1:-1,D=this.dj.c.root.position.y+this.dj.shoulderY;if(E==="wide")v.set(R*Et(-2.5,2.5,p),4.1+.5*p,16.5-1.2*p),P.set(0,2.6,-3),w=44;else if(E==="crane")v.set(R*Et(6,2,p),9.5-2*p,12-2*p),P.set(0,1,-1.5),w=46;else if(E==="low")v.set(R*Et(-4,4,p),.7,7.7),P.set(0,2.4,-2),w=54;else if(E==="side")v.set(R*8.4,2.4+p,3-2.5*p),P.set(-R*2,2.2,-3.5),w=50;else if(E==="djclose")v.set(R*Et(2.8,1.3,p),D+.7,_t+5.6-.6*p),P.set(0,D+.1,_t+.6),w=38;else if(E==="djover")v.set(R*Et(1.9,.9,p),D+1.55,_t-1.9),P.set(0,D-1,_t+3.4),w=58;else if(E==="djrise"){let M=Ke(3,13,t);v.set(Et(0,1.6,M),Et(2.6,3.4,M),Et(_t+16.5,_t+5.4,M)),P.set(0,Et(4.6,D+.1,M),_t+.6),w=Et(46,40,M)}else if(E==="orbit"){let M=R*(.9-1.8*p),C=this.chars[this.solo]?this.chars[this.solo].info.h:1.8,L=2.6+C*1.5;v.set(o.x+Math.sin(M)*L,.5+C*.45,o.z+Math.cos(M)*L),P.set(o.x,o.y+C*.55,o.z),w=40}else if(E==="fly"){let M=t*.05*R;v.set(o.x+Math.sin(M)*6.5,1.2+1.2*p,o.z+Math.cos(M)*6.5),P.set(o.x,o.y+1.1,o.z),w=40}else if(E==="warden"){let M=Ke(0,8,f);v.set(Et(-1.5,2.5,p),Et(.6,1.3,M),Et(7.2,8.7,M)),P.set(0,Et(1,3.2,M),-1.2),w=52}this.shotName=E;let b=d.aspect;b<1.5&&(w*=Et(1.9,1,Ke(.45,1.5,b)));let y=this.calm?0:(c>=0&&c<2?Math.exp(-c*2)*.12:0)+(this.wardenOn&&f>0&&f<4?.06:0);d.position.set(v.x+y*Math.sin(e*61),v.y+y*Math.sin(e*53+1),v.z+y*Math.sin(e*47+2)),d.fov=w*(1-.018*a*l),d.lookAt(P),d.updateProjectionMatrix()}};var eh=.12;function ov(){try{return!!document.createElement("canvas").getContext("webgl2")}catch{return!1}}function av(s,e){let t=!1,n=0,i,r,o,a,l,c,h,u,f,d,g,x=new As,m=[];try{i=new yo({antialias:!1,powerPreference:"high-performance"})}catch(M){return e.onError&&e.onError(M),{destroy(){}}}let p=Math.min(window.devicePixelRatio||1,1.5);i.setPixelRatio(p),i.toneMapping=mr,i.domElement.className="rv-sal-canvas",s.appendChild(i.domElement),x.background=new he(131591),x.fog=new Mo(262922,.017),h=new wt(42,16/9,.1,200);let A=new Ss(i),E=A.fromScene(new Wo,.04);x.environment=E.texture,x.environmentIntensity=.22,A.dispose();let v={hemi:new Po(16777215,2232627,.2),spotA:new _i(16777215,0,60,.75,.7,1.6),spotB:new _i(16777215,0,60,.75,.7,1.6),back:new Dn(16777215,0,40,1.6),console:new Dn(4184319,0,7,1.6),fill:new Hi(16774378,0),key:new _i(16777215,0,60,.16,.7,1.6),strobe:new Hi(16777215,0),warden:new Dn(16756800,0,30,1.6)};v.spotA.position.set(-9,11,9),v.spotB.position.set(9,11,9),v.spotA.target.position.set(1,0,0),v.spotB.target.position.set(-1,0,0),v.back.position.set(0,6.5,-9.5),v.console.position.set(0,na+.25,_t+1),v.key.position.set(0,12,10),v.strobe.position.set(0,8,12),v.fill.position.set(2,7,14),v.warden.position.set(0,2.5,3.5);for(let M in v)x.add(v[M]),v[M].target&&x.add(v[M].target);r=new Ho(i),r.addPass(new Vo(x,h)),l=new Ds(new Ce(640,360),.5,.7,.9),r.addPass(l),c=new Ls({uniforms:{tDiffuse:{value:null},uAb:{value:.002},uT:{value:0},uExp:{value:1}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:`uniform sampler2D tDiffuse; uniform float uAb,uT,uExp; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))+uT)*43758.5453); }
      void main(){ vec2 d = vUv-0.5; float r2 = dot(d,d); vec2 o = d*uAb*(0.4+r2*4.0);
        vec3 c = vec3(texture2D(tDiffuse, vUv+o).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv-o).b);
        c *= uExp * mix(1.0, 0.38, smoothstep(0.12, 0.62, r2)); c += (h(vUv*800.0)-0.5)*0.022; gl_FragColor = vec4(c, 1.0); }`}),r.addPass(c),r.addPass(new Go);let P=0,w=0,R=()=>{let M=s.clientWidth||innerWidth,C=s.clientHeight||innerHeight;M===P&&C===w||(P=M,w=C,i.setPixelRatio(p),i.setSize(M,C,!1),r.setPixelRatio(p),r.setSize(M,C),h.aspect=M/C,h.updateProjectionMatrix())};u=document.createElement("div"),u.className="rv-sal-card",f=document.createElement("div"),f.className="rv-sal-name",d=document.createElement("div"),d.className="rv-sal-role",u.append(f,d),s.appendChild(u);let D=(M,C)=>{R(),o.update(M,C),a.update(M,Ko(M),o.state.kick),l.strength=o.fx.bloom,c.uniforms.uAb.value=o.fx.aberr,c.uniforms.uT.value=M%10,c.uniforms.uExp.value=o.fx.exposure,r.render()},b=uf(x),y=pf(x);return af(Object.keys(ti),e.base+"models/",(M,C)=>e.onProgress&&e.onProgress(M,ti[C].name)).then(M=>{if(t)return;x.add(M.chephro.root),a=new ta(M.chephro,y),o=new sa({scene:x,camera:h,stage:b,booth:y,chars:M,dj:a,lights:v}),o.calm=!!e.calm,o.setWarden(e.warden!=null?e.warden:Math.random()<eh),o.onSolo=J=>{clearTimeout(g),u.classList.remove("on"),J&&(f.textContent=ti[J].name,d.textContent=ti[J].role,u.style.setProperty("--c","#"+ti[J].color.toString(16).padStart(6,"0")),u.offsetWidth,u.classList.add("on"),g=setTimeout(()=>u.classList.remove("on"),5200))};let C=performance.now(),L=0,U=0,F=null,W=J=>{if(t)return;n=requestAnimationFrame(W);let I=Math.min(.1,(J-C)/1e3);C=J;let Y=e.getTime();e.warden==null&&F!=null&&Y<1&&F>20&&o.setWarden(Math.random()<eh),F=Y,D(Y,I),I>.03?L++:I<.019&&U++,L>45&&p>.6&&(p=Math.max(.6,p-.2),L=U=0,P=0),L+U>400&&(L=U=0)};D(e.getTime(),.016),e.onReady&&e.onReady(),n=requestAnimationFrame(W)}).catch(M=>{t||e.onError&&e.onError(M)}),{destroy(){t=!0,cancelAnimationFrame(n),clearTimeout(g),x.traverse(M=>{M.geometry&&M.geometry.dispose();let C=M.material;C&&(Array.isArray(C)?C:[C]).forEach(L=>{for(let U in L)L[U]&&L[U].isTexture&&L[U].dispose();L.dispose()})}),E.dispose(),r.dispose&&r.dispose(),i.dispose();try{i.forceContextLoss()}catch{}s.innerHTML=""}}}window.SalientRave={mount:av,supported:ov,WARDEN_ODDS:eh};})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2024 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
