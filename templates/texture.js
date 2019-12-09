const regl = require('regl')()
const { mat4 } = require('gl-matrix')
// const io = require('socket.io-client')

/*
const socket = io('localhost:9876')

socket.on('clicked', o => {
  console.log('Clicked', o)
})
*/

const clear = () => {
  regl.clear({
    color: [0, 0, 0, 0]
  })
}

let time = 0
const r = 0.5
const mtxProject = mat4.create()
const mtxView = mat4.create()
const fov = 45 * Math.PI / 180

const positions = [
  [-r, r, 0],
  [r, r, 0],
  [r, -r, 0],

  [-r, r, 0],
  [r, -r, 0],
  [-r, -r, 0]
]

const uvs = [
  [0, 0],
  [1, 0],
  [1, 1],

  [0, 0],
  [1, 1],
  [0, 1]
]

let texture
let imageLoaded = false
console.log('Create img')
const img = new Image()

console.log('set the source of the image')
img.src = './assets/image.jpg'

img.onload = function () {
  console.log('Image loaded', this)
  texture = regl.texture(this)
  imageLoaded = true
}

// img.src = './assets/image.jpg'

mat4.perspective(mtxProject, fov, window.innerWidth / window.innerHeight, 0.1, 100)
mat4.lookAt(mtxView, [0, 0, 10], [0, 0, 0], [0, 1, 0])

const drawTriangle = regl({
  frag: `
		precision mediump float;
    varying vec2 vUV;
    uniform sampler2D texture;
    
    void main() {
      vec2 uv = vUV;
      // gl_FragColor = vec4(uv, 0.0, 0.5);
      vec4 colorImage = texture2D(texture, uv);
      float grey = (colorImage.r+colorImage.g+colorImage.b)/3.;
      // colorImage.rg *= 2.;
      gl_FragColor = colorImage;
    }`,

  vert: `
    precision mediump float;
    attribute vec3 position;
    attribute vec2 uv;
    
    uniform float time;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform sampler2D texture;

    varying vec2 vUV;
    varying vec3 vColor;

    void main() {
      vec3 pos = position;
      // vec4 colorImage = texture2D(texture, uv);
      // vColor = vec3(0.,0.,.5-colorImage.b);
      // pos+=vColor;
      gl_Position = uProjectionMatrix * uViewMatrix * vec4(pos, 1.0);
      vUV = uv;
    }`,

  attributes: {
    position: regl.buffer(positions),
    uv: regl.buffer(uvs)
  },
  uniforms: {
    time: regl.prop('time'),
    uProjectionMatrix: mtxProject,
    uViewMatrix: regl.prop('viewMatrix'),
    texture: regl.prop('texture')
  },
  count: 6
})

function render() {
  if (!imageLoaded) {
    console.log('image not loaded')
    window.requestAnimationFrame(render)
    return
  }
  time += 0.01
  const r = 3.0

  const x = Math.sin(time) * r
  const z = Math.cos(time) * r

  mat4.lookAt(mtxView, [x,0,z], [0, 0, 0], [0, 1, 0]) // x0z
  clear()
  drawTriangle({
    time: time,
    viewMatrix: mtxView,
    texture: texture
  })

  window.requestAnimationFrame(render)
}

render()
