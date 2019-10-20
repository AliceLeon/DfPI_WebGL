precision lowp float; 
varying vec2 vUV;
varying float vShade;
varying vec3 vPosition;

uniform vec3 uTranslate;
uniform vec3 uColor;

varying vec3 vColor;
// varying float vYPosition;

void main(){
    // float temp = clamp(vYPosition,0.,1.); // restrain the value
    
    vec3 black = vec3(0.,0.,0.);
    // vec3 finalColor = mix(black,uColor*2.,vShade);
    // vec3 finalColor = vColor;
    vec3 finalColor = mix(black,vColor*0.5+0.5,vShade);
    
    // gl_FragColor = vec4(finalColor,vShade*0.3);
    gl_FragColor = vec4(finalColor,1.);
}