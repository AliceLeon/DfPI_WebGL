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

void main(){
    vec2 center = vec2(0.5,0.5);
    float d = distance(vUV,center);

    // z fighting
    vec3 colorBg = vec3(1.0, 1.0, 1.);
    vec3 colorDot = vec3(1.0,0.,0.);

    // smoothstep
    float gradient = smoothstep(0.49,.5,d);
    // gradient:0~1

    // vec3 color = vec3(gradient);
    // vec4 color = mix(colorDot,colorBg,gradient);

    // gl_FragColor = vec4(color);// color
    // uTranslate = -5~5 & map it to 0~1
    // gl_FragColor = vec4(uTranslate,1.0-gradient);
    
    gl_FragColor = vec4((uTranslate/15.)*.5+.5,1.);//1.0-gradient

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

vec2 rotate(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
}

void main(){
    // create holder for position
    // vec3 pos = aPosition + uTranslate;
    vec3 pos = aPosition;
    
    float scale = 0.4;
    float z = sin(uTranslate.x*scale+uTranslate.y*scale+uTime*4.0);
    // pos.z+=z*02.;
   

    float angle = cos(uTranslate.x+uTranslate.y-uTime);
    pos.xy = rotate(pos.xy,angle);

    pos+=+ uTranslate;

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

    var moveRange = 1//10
    mouseX = - percentX * moveRange
    mouseY = percentY * moveRange
})


let trace = true
var num = 30
var start = - num / 2

function render() { // draw()

    let cameraRadius = 3.0
    mat4.lookAt(viewMatrix, [mouseX, mouseY, 20], [0, 0, 0], [0, 1, 0]) // distance

    // out eye(pos of camera) center up

    currTime += 0.01;
    // time increase every frame

    clear()


    for (var i = 0; i < num; i++) {
        for (var j = 0; j < num; j++) {
            var obj = {
                objTime: currTime,
                view: viewMatrix,
                translate: [start+i,start+j,0]
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