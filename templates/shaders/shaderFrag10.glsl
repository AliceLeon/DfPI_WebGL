precision lowp float; 
varying vec2 vUV;
varying float vShade;
varying vec3 vPosition;
varying float r;

uniform vec3 uTranslate;
uniform vec3 uColor;

varying vec3 vColor;
// varying float vYPosition;

void main(){
    float temp = clamp(r,0.,1.); // restrain the value
    
    vec3 black = vec3(0.,0.,0.);
    vec3 red = vec3(1.,0.,0.);
    vec3 white = vec3(1.0,1.0,1.0);
    // vec3 finalColor = mix(black,uColor,1.-vShade);

    // vec3 finalColor = mix(black,vec3(vUV,1.0),1.-vShade);
    // vec3 finalColor = vColor*0.5+0.5;
    vec3 finalColor = mix(white,red,r);
    
    // gl_FragColor = vec4(finalColor,vShade*0.3);
    gl_FragColor = vec4(finalColor,1.);
}