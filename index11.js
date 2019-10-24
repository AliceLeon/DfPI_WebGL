const regl = require('regl')()
const glm = require('gl-matrix') // returns an object
var glslify = require('glslify');
const loadObj = require('./utils/loadObj.js')
console.log(loadObj)


const vertexShader = glslify('./shaders/shaderVertex11.glsl')
const fragShader = glslify('./shaders/shaderFrag11.glsl')

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

loadObj('./assets/semi.obj', function (obj) {
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
            uColor: regl.prop('color'),
            uR: regl.prop('r'),
            uMouse: regl.prop('mouseView')
        },
        vert: vertexShader,
        frag: fragShader,
        attributes: attributes,
        count: obj.count,
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

var mouseX = 0
var mouseY = 0

window.addEventListener('mousemove', function (e) {
    // console.log('Mouse move',e.clientX,e.clientY)

    var percentX = e.clientX / window.innerWidth // 0~1
    var percentY = e.clientY / window.innerHeight

    percentX = percentX * 2 - 1 //-1~1
    percentY = percentY * 2 - 1

    var moveRange = 100//10
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
    mat4.lookAt(viewMatrix, [0,0, 30], [0, 0, 0], [0, 1, 0]) // distance

    clear() // make sure you clear first
    
    /*/
    // render is faster so it takes time to drawCube
    if (drawCube != undefined) {
        let num = 5;
        let num2 = 5;
        let scale = 1;
        let r = 2;
        let start = num / 2 * scale - 1;
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num2; j++) {
                // for (let k = 0; k < num; k++) {
                let temp = parseFloat(i / num);
                var obj = {
                    time: currTime,
                    projection: projectionMatrix,
                    view: viewMatrix,
                    translate:
                        [(1. + i / 2) * Math.sin(i / num * 2 * Math.PI + currTime  + i * .1+ j *  2* Math.PI / num2),
                        i * scale / 5,
                        // 0,
                        (1. + i / 2) * Math.cos(i / num * 2 * Math.PI + currTime + i *.1 + j * 2 * Math.PI / num2)
                        ],
                    color: [1, 0, 0]
                }
                drawCube(obj)
                // }
            }
        }
    }
    /*/
    if (drawCube != undefined) {
        let num = 100;
        let num2 = 2;
        let scale = 2;
        let start = num / 2*scale -1;
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num2; j++) {
                // for (let k = 0; k < num; k++) {
                    var obj = {
                        time: currTime,
                        projection: projectionMatrix,
                        view: viewMatrix,
                        // translate: [-start + i*scale , -start + j*scale , -start + k*scale ],
                        translate: [-start + j*scale*10,0, -start + i*scale/50. ],
                        // color: [1,j/num,k/num]
                        color: [i/num,1,1],
                        r: i+15,
                        mouseView: mouseX
                    }
                    drawCube(obj)
                }
            }
        // }
    }
    //*/

    window.requestAnimationFrame(render);

}
render()