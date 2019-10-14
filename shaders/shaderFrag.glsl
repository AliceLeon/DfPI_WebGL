
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

void main(){
    // ?
    vec2 center = vec2(0.5,0.5);
    vec2 diff = vUV - center;
    diff = normalize(diff);
    float angle = atan(diff.y,diff.x);

    float dist = distance(vUV,center);
    dist - sin(dist*5.0-uTime*5.0);
    gl_FragColor = vec4(vec3(angle),1.0);

}