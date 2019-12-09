#define NUM_OCTAVES 5

precision lowp float; 
varying vec2 vUV;
varying float vShade;
varying vec3 vPosition;

uniform vec3 uTranslate;
uniform vec3 uColor;
uniform float uR;
uniform float uTime;
varying vec3 vColor;
// varying float vYPosition;
const float PI = 3.141592653;


float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}
float fbm(vec3 x) {
	float v = 0.0;
	float a = 0.5;
	vec3 shift = vec3(100);
	for (int i = 0; i < NUM_OCTAVES; ++i) {
		v += a * noise(x);
		x = x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}

void main(){
    // float temp = clamp(vYPosition,0.,1.); // restrain the value
    
    vec3 black = vec3(0.,0.,0.);
    
    // vec3 finalColor = mix(black,uColor*2.,uR*0.1);

   
    // vec3 finalColor = vec3(temp,temp,temp);
    // finalColor.xy = rotate(finalColor.xy,uR);
    // vec3 finalColor = mix(black,vColor*0.5+0.5,vShade);
    
    // gl_FragColor = vec4(finalColor,1.);
    
   gl_FragColor = vec4(vColor,1.);

    // gl_FragColor = vec4(uColor,1.);

/*
    float noiseValueBase = noise(vec3(uTime*1.0,vColor.yz*2.0));
    float noiseValue = noise(vec3(vColor.x,uTime*0.4+vColor.y,noiseValueBase/3.));
    // +uR/4.
    vec3 pink = vec3(1.0,0.8,0.8);
    vec3 blue = vec3(220./255.,1.0,1.0);
    vec3 white = vec3(1.0,1.0,1.0);
    vec3 black = vec3(0.0,0.0,0.0);

    vec3 finalColor = mix(pink,blue,noiseValue);
    // finalColor*=noiseValue;

    gl_FragColor = vec4(vec3(noiseValue*noiseValue*noiseValue),1.0);
    */
}