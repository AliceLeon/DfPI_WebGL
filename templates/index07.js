const regl = require('regl')()
const glm = require('gl-matrix') // returns an object
var glslify = require('glslify');
const loadObj = require('./utils/loadObj.js')
console.log(loadObj)


const vertexShader = glslify('./shaders/shaderVertex07.glsl')
const fragShader = glslify('./shaders/shaderFrag07.glsl')

var mat4 = glm.mat4
let currTime = 0
const bg = [0,0,0, 1]

// create a matrix
var projectionMatrix = mat4.create()
var fov = 75. * Math.PI / 180.; // fovy: field of view (radian)

var aspect = window.innerWidth / window.innerHeight
mat4.perspective(projectionMatrix, fov, aspect, 0.01, 1000.)

var viewMatrix = mat4.create()
mat4.lookAt(viewMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0]) // out eye center up

var drawCube

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

function clear() {
    regl.clear({
        color: bg
    })
}

function render() { // draw()
    currTime += 0.01;
    //*/
    mat4.lookAt(viewMatrix, [mouseX, mouseY, 30], [0, 0, 0], [0, 1, 0]) // distance
    /*/
    mat4.lookAt(viewMatrix, [0, 0, 15], [0, 0, 0], [0, 1, 0]) // distance
    //*/

    clear() // make sure you clear first

    // render is faster so it takes time to drawCube
    if (drawCube != undefined) {
        let num = 10;
        let scale = 2;
        let start = num / 2*scale -1;
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num; j++) {
                for (let k = 0; k < num; k++) {
                    var obj = {
                        time: currTime,
                        projection: projectionMatrix,
                        view: viewMatrix,
                        translate: [-start + i*scale , -start + j*scale , -start + k*scale ],
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