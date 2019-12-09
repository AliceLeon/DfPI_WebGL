// using the libraries. regl packages most of the webgl functions, gl-matrix for postioning and camera, socket for setting up the link to server, glslify for using .glsl files.
const regl = require('regl')() 
const glm = require('gl-matrix')
const io = require('socket.io-client')
var glslify = require('glslify');

// load the model.
const loadObj = require('./utils/loadObj.js')

// setting up the link to server/. The IP should be the same sharing with the remoter.
const socket = io('http://172.20.10.2:9876')

// listening to cameramove
socket.on('cameramove', function (o) {
    mat4.copy(viewMatrix, o.view)
})

// using shader files.
const vertexShader = glslify('./shaders/shaderVertex14.glsl')
const fragShader = glslify('./shaders/shaderFrag14.glsl')

// initializing time.
let currTime = 0

// setting background color
const bg = [0, 0, 0, 1]

// camera setting.
var mat4 = glm.mat4
var projectionMatrix = mat4.create()
var fov = 75. * Math.PI / 180.;
var aspect = window.innerWidth / window.innerHeight
mat4.perspective(projectionMatrix, fov, aspect, 0.01, 1000.)
var viewMatrix = mat4.create()
mat4.lookAt(viewMatrix, [0, 0, 50], [0, 0, 0], [0, 1, 0]) 

// declare drawCube
var drawCube

// load and give the model custom attributes.
loadObj('./assets/10.obj', function (obj) {
    
    var newPosition = [];
    var newUV = [];
    var newTranslate = [];
    var newR = [];
    var newColor = [];
    var numInstance = 0;

    let num = 10;
    let scale = 2;
    let start1 = num / 2 * scale - 10;

    for (let i = 0; i < num; i++) {
        for (var k = 0; k < obj.positions.length; k++) {
            // copy all the position / uvs
            newPosition.push(obj.positions[k])
            newUV.push(obj.uvs[k])
            var tempR = i * 2
            newR.push(tempR)
            var colornw = [1., 1., 1.]
            newColor.push(colornw)
            // add new translate as attribute
            var translate = [0, 0, -start1 + i * scale / 50.]
            newTranslate.push(translate)
        }

        numInstance++;
    }
    // create the attributes
    var attributes = {
        aPosition: regl.buffer(newPosition),
        aUV: regl.buffer(newUV),
        aColor: regl.buffer(newColor),
        aR: regl.buffer(newR),
        aTranslate: regl.buffer(newTranslate)
    }

    // create our draw call
    drawCube = regl({
        uniforms: {
            uTime: regl.prop('time'),
            uProjectionMatrix: regl.prop('projection'),
            uViewMatrix: regl.prop('view'),
            uTranslate: regl.prop('translate'),
            uColor: regl.prop('color'),
            uR: regl.prop('r'),
            uMouseVX: regl.prop('mouseVX'),
            uMouseVY: regl.prop('mouseVY')
        },
        vert: vertexShader,
        frag: fragShader,
        attributes: attributes,
        count: obj.count * numInstance,
        depth: {
            enable: true // transparent
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

function map(value, start, end, newStart, newEnd) {
    var percent = (value - start) / (end - start)
    if (percent < 0) {
        percent = 0
    }
    if (percent > 1) {
        percent = 1
    }
    var newValue = newStart + (newEnd - newStart) * percent
    return newValue
}

// initializing mouseX,mouseY
var mouseX = 0
var mouseY = 0

socket.on('touching', function (o) {
    mouseX = map(o.x,0,1,-1,1);
    mouseY = map(o.y,0,1,-1,1);
})

function clear() {
    regl.clear({
        color: bg
    })
}

function render() { // draw()
    currTime += 0.01;
    clear()
    if (drawCube != undefined) {
        var obj = {
            time: currTime,
            projection: projectionMatrix,
            view: viewMatrix,
            r: 1,
            mouseVY: mouseY,
            mouseVX: mouseX,
        }
        drawCube(obj)
    }
    window.requestAnimationFrame(render);

}
render()