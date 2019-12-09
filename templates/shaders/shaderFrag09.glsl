precision lowp float;
varying vec2 vUV;
varying float vShade;

uniform vec3 uTranslate;
uniform vec3 uColor;

void main(){
    vec3 black = vec3(0.,0.,0.);

    // adds different shades of black
    vec3 finalColor = mix(black,uColor*2.,vShade); 
    gl_FragColor = vec4(finalColor,vShade*0.3);
}