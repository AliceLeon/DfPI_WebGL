const regl = require('regl')()
const glm = require('gl-matrix') // returns an object
var glslify = require('glslify');
const loadObj = require('./utils/loadObj.js')
console.log(loadObj)


const vertexShader = glslify('./shaders/shaderVertex12.glsl')
const fragShader = glslify('./shaders/shaderFrag12.glsl')

var mat4 = glm.mat4
let currTime = 0
const bg = [0, 0, 0, 1]

// create a matrix
var projectionMatrix = mat4.create()
var fov = 75. * Math.PI / 180.; // fovy: field of view (radian)

var aspect = window.innerWidth / window.innerHeight
mat4.perspective(projectionMatrix, fov, aspect, 0.01, 1000.)

var viewMatrix = mat4.create()
mat4.lookAt(viewMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0]) // out eye center up

var drawCube

loadObj('./assets/10.obj', function (obj) {
    console.log('fuck loaded', obj)

    var newPosition = [];
    var newUV = [];
    var newTranslate = [];
    var newR = [];
    var newColor = [];
    var numInstance = 0;

    let num = 7;
    let scale = 2;
    let start1 = num / 2 * scale-10;

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
            uMouse: regl.prop('mouseView'),
            uMouseVX: regl.prop('mouseVX'),
            uMouseVY: regl.prop('mouseVY')
            // uTotal: regl.prop('total')
        },
        vert: vertexShader,
        frag: fragShader,
        attributes: attributes,
        count: obj.count * numInstance,
        depth: {
            enable: true // 透明
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

var mouseX = 0
var mouseY = 0

var intMouse

window.addEventListener('mousemove', function (e) {
    // console.log('Mouse move',e.clientX,e.clientY)

    var percentX = e.clientX / window.innerWidth // 0~1
    var percentY = e.clientY / window.innerHeight

    percentX = percentX * 2 - 1 //-1~1
    percentY = percentY * 2 - 1

    var moveRange = 100//10
    intMouse = parseInt(mouseX, 10)
    intMouse = map(intMouse, -50, 50, 1, 100)
    // console.log(intMouse)
    mouseX = - percentX * moveRange
    mouseY = percentY * moveRange
    console.log("mouse",mouseX)
})

function clear() {
    regl.clear({
        color: bg
    })
}

function render() { // draw()
    currTime += 0.01;
    mat4.lookAt(viewMatrix, [0,0, 50], [0, 0, 0], [0, 1, 0]) // distance
    clear()

    // console.log("time",currTime)
    if (drawCube != undefined) {

        var obj = {
            time: currTime,
            projection: projectionMatrix,
            view: viewMatrix,
            translate: [0, 0, 0],
            color: [0, 0, 0],
            r: 1,
            mouseView: 2 * Math.sin(currTime),
            // total: num
            mouseVY: mouseY,// 50*Math.sin(currTime),
            mouseVX: mouseX,
        }
        drawCube(obj)
    }

    window.requestAnimationFrame(render);

}
render()