const regl = require('regl')()
// require('regl')  = the function
// use another () to call the function
// initialize
const glm = require('gl-matrix') // returns an object
console.log(glm)
var mat4 = glm.mat4

var glslify = require('glslify');

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


// pos.x += sin(uTime)*0.1;
// gl_Position = vec4(pos,1.0);

const vertexShader = glslify('./shaders/shaderVertex.glsl')
// const vertexShader = require('./shaders/shaderVertex.js')

const fragShader = glslify('./shaders/shaderFrag.glsl')


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
var num = 1
var start = - num / 2

function render() { // draw()

    let cameraRadius = 3.0
    mat4.lookAt(viewMatrix, [0,0, 2], [0, 0, 0], [0, 1, 0]) // distance

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