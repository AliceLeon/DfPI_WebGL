const regl = require('regl')()
const glm = require('gl-matrix') // returns an object
var glslify = require('glslify');
const loadObj = require('./utils/loadObj.js')
console.log(loadObj)

const vertexShader = glslify('./shaders/shaderVertex07.glsl')
const fragShader = glslify('./shaders/shaderFrag07.glsl')

loadObj('./assets/cube.obj', function (obj) {
    console.log('fuck loaded', obj)
    // create the attributes
    var attributes = {
        aPosition: regl.buffer(obj.positions),
        aUV: regl.buffer(obj.uvs)
    }

    // create our draw call
    var drawTriangle = regl({
        uniforms: {
            uTime: regl.prop('time'),
            uProjectionMatrix: regl.prop('projection'),
            uViewMatrix: regl.prop('view')
        },
        vert: vertexShader,
        frag: fragShader,
        attributes: attributes,
        count: obj.count
    })
})

var mat4 = glm.mat4
let currTime = 0
const bg = [1, 1, 1, 1]

// create a matrix
var projectionMatrix = mat4.create()
var fov = 75. * Math.PI / 180.; // fovy: field of view (radian)

var aspect = window.innerWidth / window.innerHeight
mat4.perspective(projectionMatrix, fov, aspect, 0.01, 1000.)

var viewMatrix = mat4.create()
mat4.lookAt(viewMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0]) // out eye center up


function clear() {
    regl.clear({
        color: bg
    })
}

function render() { // draw()
    currTime += 0.01;
    mat4.lookAt(viewMatrix, [0, 0, 5], [0, 0, 0], [0, 1, 0]) // distance
    clear()
    window.requestAnimationFrame(render);
}
render()