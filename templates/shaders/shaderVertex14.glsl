// specify the highest available precision
precision highp float;
// using the attributes / uniforms we created
attribute vec3 aPosition;
attribute vec3 aTranslate;
attribute float aR;

uniform float uTime;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform float uMouseVX;
uniform float uMouseVY;

// pass these varying values between vertex shader and fragment shader
varying float vTotal;
varying vec3 vColor;
varying float vcurrentR;

const float PI = 3.141592653;

// 2Drotate fuction from Wen.
vec2 rotate(vec2 v, float a) {
  float s = sin(a);
  float c = cos(a);
  mat2 m = mat2(c, -s, s, c);
  return m * v;
}

// mapping values thx Wen
float map(float value, float start, float end, float newStart, float newEnd) {
  float percent = (value - start) / (end - start);
  if (percent < 0.0) {
    percent = 0.0;
  }
  if (percent > 1.0) {
    percent = 1.0;
  }
  float newValue = newStart + (newEnd - newStart) * percent;
  return newValue;
}

void main() {
  // positioning different layers 
  vec3 pos = aPosition * (10. + aR) * 0.01;

  // calculating the layers based on the position of the finger.
  float layers = map(distance(vec2(uMouseVX,uMouseVY),vec2(0.,0.)),0.,1.4,30.,0.);

  vTotal = layers; // layers we want
  vcurrentR = aR; // layers in total
  
  // create the fake light and shadow effect
  vColor = normalize(pos);
  float temp = (vColor.x + vColor.y + vColor.z) * (vColor.x + vColor.y + vColor.z) / 4.;
  vColor = vec3(temp, temp, temp);

  // making the model face us, enabling the deform
  pos.xy = rotate(pos.xy, PI/2.);
  pos.xz = rotate(pos.xz, PI/2.);

  // calculating how much the wave deforms based on the position of the finger.
  float waves = map(distance(vec2(uMouseVX,uMouseVY),vec2(0.,0.)),0.,1.4,2.,100.);

  // creating the weird wave based on the position of each point
  pos.xz = rotate(pos.xz, sin(uTime + pos.y / 2. + aR / 2.) * PI/2. * pos.y / waves); 
  
  // setting position of each point
  gl_Position = uProjectionMatrix * uViewMatrix * vec4(pos, 1.0);
}
