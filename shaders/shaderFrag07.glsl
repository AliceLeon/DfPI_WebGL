precision lowp float; //medium
varying vec3 vColor;
varying vec2 vUV;
uniform vec3 uTranslate;
// varying float vYPosition;

void main(){
    // float temp = clamp(vYPosition,0.,1.); // restrain the value
    // finalColor = mix(black,pink,temp);
    gl_FragColor = vec4(vColor,1.0);
}