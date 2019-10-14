precision lowp float;
attribute vec3 aPosition;
attribute vec3 aColor;
attribute vec2 aUV;

uniform float uTime;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

uniform vec3 uTranslate;

varying vec3 vColor;
varying vec2 vUV;

vec2 rotate(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
}

void main(){
    // create holder for position
    // vec3 pos = aPosition + uTranslate;
    vec3 pos = aPosition;
    
    float scale = 0.4;
    float z = sin(uTranslate.x*scale+uTranslate.y*scale+uTime*4.0);
    // pos.z+=z*02.;
   

    float angle = cos(uTranslate.x+uTranslate.y-uTime);
    pos.xy = rotate(pos.xy,angle);

    pos+=+ uTranslate;

    gl_Position = uProjectionMatrix * uViewMatrix*vec4(pos,1.0);
    vColor = aColor;
    vUV = aUV;
}