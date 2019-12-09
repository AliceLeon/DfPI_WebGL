const regl = require('regl')()
// require('regl')  = the function
// use another () to call the function
// initialize
const glm = require('gl-matrix') // returns an object
console.log(glm)
var mat4 = glm.mat4

let currTime = 0

// create a matrix
var projectionMatrix = mat4.create()
var fov = 75. * Math.PI / 180.; // fovy: field of view (radian)

var aspect = window.innerWidth / window.innerHeight

mat4.perspective(projectionMatrix, fov, aspect, 0.01, 1000.)

var viewMatrix = mat4.create()

// mat4.lookAt(viewMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0]) // out eye center up

console.log(projectionMatrix)

const r = 0.5

var pos = [
    [-r, r, 0],
    [r, r, 0],
    [r, -r, 0],

    [-r, r, 0],
    [r, -r, 0],
    [-r, -r, 0]
]

var uvs = [// different 坐标系
    //*
    [0, 0],
    [1, 0],
    [1, 1],

    [0, 0],
    [1, 1],
    [0, 1]
    /*/
    [1, 1, 0],
    [1, 0, 1],
    [0, 1, 1],

    [1, 1, 1],
    [1, 1, 0],
    [1, 0, 1]
    /*/
]
var colors = [
    [0, 1, 1],
    [1, 0, 1],
    [1, 1, 0],

    [0, 1, 1],
    [1, 1, 0],
    [1, 0, 1]
]
const attributes = {
    aPosition: regl.buffer(pos),
    aColor: regl.buffer(colors),
    aUV: regl.buffer(uvs)
}

let bg = [0,0,0,1]



console.log('Attribute', attributes)
// buffer: big array that Graphic card would take


// pass color to varying
// precision highp lowp mediump floating point

// cant assign to attribute
// attribute are buffers


// have no access to attribute

var fragShader = `
precision lowp float; //medium
varying vec3 vColor;
varying vec2 vUV;
uniform vec3 uTranslate;
varying float vYPosition;

void main(){
    vec3 finalColor = uTranslate/5.0*.5+.5;
    
    vec3 pink = vec3(1.0,0.8,0.8);
    vec3 blue = vec3(220./255.,1.0,1.0);
    vec3 white = vec3(1.0,1.0,1.0);
    vec3 black = vec3(0.0,0.0,0.0);

    float temp = clamp(vYPosition,0.,1.); // restrain the value
    finalColor = mix(black,pink,temp);
    gl_FragColor = vec4(finalColor,1.);
}`

var vertexShader = `
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
varying float vYPosition;

vec2 rotate(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
}

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

void main(){
    // create holder for position
    vec3 pos = aPosition + uTranslate;
    pos = pos.xzy; // transform here

    float noiseScale = 0.1;
    float noiseSize = 3.0;
    float noise1 = cnoise(vec3(uTranslate.y*5.0,uTranslate.x*5.0,uTime*0.25));
    float noise = cnoise(vec3(uTranslate.x*noiseScale,uTranslate.y*noiseScale-uTime,noise1));
    // pos*= noise*noiseSize;
    pos.y = noise*noiseSize;
    
    vYPosition = noise;

    gl_Position = uProjectionMatrix * uViewMatrix*vec4(pos,1.0);
    vColor = aColor;
    vUV = aUV;
}
`

// pos.x += sin(uTime)*0.1;
// gl_Position = vec4(pos,1.0);



const drawTriangle = regl({
    // attributes: values of each point
    // use buffer to do this
    attributes: attributes,
    frag: fragShader,
    vert: vertexShader,
    count: 6,
    uniforms: {
        uTime: regl.prop('objTime'),
        uProjectionMatrix: projectionMatrix,
        uViewMatrix: regl.prop('view'),
        uTranslate: regl.prop('translate')
        // uniform: apply on all the point
    },
    depth: {
        enable: false
    },
    blend: {
        enable: true,
        func: {
            srcRGB: 'src alpha',
            srcAlpha: 'src alpha',
            dstRGB: 'one minus src alpha',
            dstAlpha: 'one minus src alpha',
        },
    }
})

//*/
function clear() {
    regl.clear({
        color: bg
    })
}
/*/
const clear = () =>{
    regl.clear({
        color: [1,1,0,1]
    })
}
//*/

var mouseX = 0
var mouseY = 0

window.addEventListener('mousemove', function (e) {
    // console.log('Mouse move',e.clientX,e.clientY)

    var percentX = e.clientX / window.innerWidth // 0~1
    var percentY = e.clientY / window.innerHeight

    percentX = percentX * 2 - 1 //-1~1
    percentY = percentY * 2 - 1

    var moveRange = 10//10
    mouseX = - percentX * moveRange
    mouseY = percentY * moveRange
})


let trace = true
var num = 25
var start = - num / 2

function render() { // draw()

    let cameraRadius = 3.0
    mat4.lookAt(viewMatrix, [mouseX,mouseY, 15], [0, 0, 0], [0, 1, 0]) // distance

    // out eye(pos of camera) center up

    currTime += 0.01;
    // time increase every frame

    clear()


    for (var i = 0; i < num; i++) {
        for (var j = 0; j < num; j++) {
            var obj = {
                objTime: currTime,
                view: viewMatrix,
                translate: [start+i*1.1,start+j*1.1,0]
                // translate: [j+Math.sin(currTime+j*.7)*0.5-5,i-5,0]
                // translate: [j + start + Math.sin(currTime + j * 1.),
                // i + start,
                // Math.cos(currTime + j * 1.)]
            }
            if (trace) {
                console.log(obj.translate[0], obj.translate[1])
            }
            drawTriangle(obj)

        }
    }


    // assign the current to time 
    // for setting up the uniform
    trace = false
    window.requestAnimationFrame(render);
    // loop things in a reasonable frame
}
render()