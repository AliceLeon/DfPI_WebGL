#define NUM_OCTAVES 5

// pass color to varying
// precision highp lowp mediump floating point

// cant assign to attribute
// attribute are buffers

// have no access to attribute

precision lowp float; //medium
varying vec3 vColor;
varying vec2 vUV;

uniform vec3 uTranslate;
uniform float uTime;

const float PI = 3.141592653;

// float rand(float n){return fract(sin(n) * 43758.5453123);}

// float rand(vec2 n) { 
// 	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
// }

// float noise(vec2 n) {
// 	const vec2 d = vec2(0.0, 1.0);
//   vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
// 	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
// }

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
    /* ?
    vec2 center = vec2(0.5,0.5);
    vec2 diff = vUV - center;
    diff = normalize(diff);
    float angle = atan(diff.y,diff.x);

    float dist = distance(vUV,center);
    dist - sin(dist*5.0-uTime*5.0);
    gl_FragColor = vec4(vec3(angle),1.0);
    */

    float noiseValueBase = noise(vec3(uTime*2.0,vUV*3.0));
    float noiseValue = fbm(vec3(vUV*1.0,uTime));
    vec3 pink = vec3(1.0,0.8,0.8);
    vec3 blue = vec3(220./255.,1.0,1.0);
    vec3 white = vec3(1.0,1.0,1.0);
    vec3 black = vec3(0.0,0.0,0.0);

    vec3 finalColor = mix(pink,blue,noiseValue);
    // finalColor*=noiseValue;

    gl_FragColor = vec4(vec3(noiseValue),1.0);

}