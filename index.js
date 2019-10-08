const regl = require('regl')() 
// require('regl')  = the function
// use another () to call the function
// initialize

const points = [
    [-0.5,0.5,0],
    [0.5,-0.5,0],
    [-0.5,-0.5,0]
]

const colors =[
    [1,1,0],
    [1,0,1],
    [0,1,1]
]
let bg = [0,0,0,1]

let currTime = 0

var attributes = {
    position: regl.buffer(points),
    aColor: regl.buffer(colors)
}
console.log('Attribute',attributes)
// buffer: big array that Graphic card would take


// pass color to varying
// precision highp lowp mediump floating point

// cant assign to attribute
// attribute are buffers

var vertexShader = `
precision lowp float;
attribute vec3 position;
attribute vec3 aColor;
varying vec3 vColor;

void main(){
    vec3 pos = position;
    gl_Position = vec4(pos,1.0);
    vColor = aColor;
}
`
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
    count: 3,
    uniforms:{
        uTime: regl.prop('time')
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

function render(){ // draw()

    currTime+=0.01;

    // time increase every frame
    const obj = {
        time: currTime
    }
    console.log('time',currTime,obj)

    clear()

    drawTriangle(obj)
    // assign the current to time 
    // for setting up the uniform
    window.requestAnimationFrame(render);
    // loop things in a reasonable frame
}
render()