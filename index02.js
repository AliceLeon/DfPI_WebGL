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
var fov = 75.*Math.PI/180.; // fovy: field of view (radian)

var aspect = window.innerWidth/window.innerHeight

mat4.perspective(projectionMatrix, fov, aspect, 0.01, 1000.)

var viewMatrix = mat4.create()

mat4.lookAt(viewMatrix, [0,0,2], [0,0,0], [0,1,0]) // out eye center up

console.log(projectionMatrix)

const r = 0.5
const attributes = {
    aPosition: regl.buffer([
        [-0.5,0.5,0],
        [0.5,-0.5,0],
        [-0.5,-0.5,0],
        [0.5,0.5,0],
        [-0.5,0.5,0],
        [0.5,-0.5,0]
    ]),
    aColor: regl.buffer([
        [1,1,0],
        [1,0,1],
        [0,1,1],
        [1,1,1],
        [1,1,0],
        [1,0,1]
    ])
}

let bg = [1,1,1,1]



console.log('Attribute',attributes)
// buffer: big array that Graphic card would take


// pass color to varying
// precision highp lowp mediump floating point

// cant assign to attribute
// attribute are buffers

var vertexShader = `
precision lowp float;
attribute vec3 aPosition;
attribute vec3 aColor;

uniform float uTime;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

varying vec3 vColor;

void main(){
    // create holder for position
    vec3 pos = aPosition;

    float scale = sin(uTime)*.5+.5;
    // pos.x += sin(uTime)*.5;
    // pos.y += cos(uTime)*.5;
    pos.xy *=scale;
    gl_Position = uProjectionMatrix * uViewMatrix*vec4(pos,1.0);
    vColor = aColor;
}
`

// pos.x += sin(uTime)*0.1;
// gl_Position = vec4(pos,1.0);


// have no access to attribute

var fragShader = `
precision mediump float;
varying vec3 vColor;

void main(){
    gl_FragColor = vec4(vColor,1.0);
}`

const drawTriangle = regl({
    // attributes: values of each point
    // use buffer to do this
    attributes:attributes,
    frag:fragShader,
    vert:vertexShader,
    count: 6,
    uniforms:{
        uTime: regl.prop('objTime'),
        uProjectionMatrix: projectionMatrix,
        uViewMatrix: regl.prop('view')
    }
})

//*/
function clear(){
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

var mouseX =0
var mouseY = 0


window.addEventListener('mousemove',function(event){
    console.log('Mouse move',event,event.clientX,event.clientY)
    var percentX = event.clientX/ window.innerWidth;
    percentX = 2*percentX-1 // -1~ 1
    
    var percentY = event.clientY/ window.innerHeight;
    percentY = 2*percentY-1 // same
    
})
function render(){ // draw()

    let cameraRadius = 3.0
    // mouseX = percentX *cameraRadius
    // mouseY = percentY *cameraRadius

    /*/
    let cameraX = mouseX
    let cameraZ = mouseY
    
    /*/
    let cameraX = Math.sin(currTime)*cameraRadius
    let cameraZ = Math.cos(currTime)*cameraRadius
    //*/

    // console.log(cameraX)
    mat4.lookAt(viewMatrix, [cameraX,0,cameraZ], [0,0,0], [0,1,0]) 
    // out eye(pos of camera) center up

    currTime+=0.01;
    currRdm = Math.random()
    // time increase every frame

    const obj = {
        objTime: currTime,
        view: viewMatrix
    }

    // console.log('Time is',currTime,obj)

    clear()

    drawTriangle(obj)
    // assign the current to time 
    // for setting up the uniform
    window.requestAnimationFrame(render);
    // loop things in a reasonable frame
}
render()