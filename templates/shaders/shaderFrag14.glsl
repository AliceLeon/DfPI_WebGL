precision highp float;

varying vec3 vColor;
varying float vTotal;
varying float vcurrentR;

void main() {

  // controling the number of layers with the trancparency
  if (vTotal >= vcurrentR) {
    gl_FragColor = vec4(vColor, 1.);
  } else {
    gl_FragColor = vec4(vColor, 0);
  }
}