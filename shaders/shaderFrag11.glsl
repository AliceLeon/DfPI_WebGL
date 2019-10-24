precision lowp float; 
varying vec2 vUV;
varying float vShade;
varying vec3 vPosition;

uniform vec3 uTranslate;
uniform vec3 uColor;
uniform float uR;

varying vec3 vColor;
// varying float vYPosition;


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
}