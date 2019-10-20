precision lowp float; //medium
varying vec2 vUV;
varying float vShade;

uniform vec3 uTranslate;
uniform vec3 uColor;
// varying float vYPosition;

void main(){
    // float temp = clamp(vYPosition,0.,1.); // restrain the value
    
    vec3 black = vec3(0.,0.,0.);
    vec3 finalColor = mix(black,uColor*2.,vShade);


    gl_FragColor = vec4(finalColor,vShade*0.3);
    // gl_FragColor = vec4(uColor,1.);
}