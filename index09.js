//---- homework version ------//

// using libraries. regl,gl-matrix.
const regl = require('regl')()
const glm = require('gl-matrix') // returns an object

// i really need hightlight/auto formating so im using this library to use glsl file.
var glslify = require('glslify'); 

// load obj
const loadObj = require('./utils/loadObj.js')

// using shader file 
const vertexShader = glslify('./shaders/shaderVertex07.glsl')
const fragShader = glslify('./shaders/shaderFrag07.glsl')

// set currTime
let currTime = 0
const bg = [0,0,0, 1] // set background color

// matrix settings.
var mat4 = glm.mat4
var projectionMatrix = mat4.create()
var fov = 75. * Math.PI / 180.;
var aspect = window.innerWidth / window.innerHeight
mat4.perspective(projectionMatrix, fov, aspect, 0.01, 1000.)
var viewMatrix = mat4.create()
mat4.lookAt(viewMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0]) // out eye center up

var drawCube

// load object

loadObj('./assets/cube.obj', function (obj) {
    console.log('fuck loaded', obj)
    // create the attributes
    var attributes = {
        aPosition: regl.buffer(obj.positions),
        aUV: regl.buffer(obj.uvs),
        aColor: regl.buffer(obj.color)
    }
    // create our draw call
    drawCube = regl({
        uniforms: {
            // using what we declared in the obj
            uTime: regl.prop('time'),
            uProjectionMatrix: regl.prop('projection'),
            uViewMatrix: regl.prop('view'),
            uTranslate: regl.prop('translate'),
            uColor: regl.prop('color')
        },
        vert: vertexShader,
        frag: fragShader,
        attributes: attributes,
        count: obj.count,

    // copied the code below from stackoverflow to enable transparency
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
})

// mouse settings
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

// clear the whole canvas
function clear() {
    regl.clear({
        color: bg
    })
}

// draw things on it
function render() {
    currTime += 0.01;

    // add mouse control
    mat4.lookAt(viewMatrix, [mouseX, mouseY, 30], [0, 0, 0], [0, 1, 0]) 
    clear()

    // render is faster so it takes time to drawCube
    if (drawCube != undefined) {
        let num = 10; // object num on a row/line
        let scale = 2; // to adjust different size of objects.
        let start = num / 2*scale -1;
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num; j++) {
                for (let k = 0; k < num; k++) {
                    var obj = {
                        time: currTime,
                        projection: projectionMatrix,
                        view: viewMatrix,
                        translate: [-start + i*scale , -start + j*scale , -start + k*scale ],
                        
                        // limit the color to (255,xxx,xxx)
                        color: [1,j/num,k/num]
                    }
                    drawCube(obj)
                }
            }
        }
    }

    window.requestAnimationFrame(render);

}
render()