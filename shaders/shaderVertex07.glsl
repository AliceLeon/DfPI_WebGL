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
    vec3 pos = aPosition;
    //+ uTranslate;
    gl_Position = uProjectionMatrix * uViewMatrix*vec4(pos,1.0);
    vColor = aColor;
    // vUV = aUV;
}
