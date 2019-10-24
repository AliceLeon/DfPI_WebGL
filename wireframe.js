const regl = require('regl')({extensions: ['oes_standard_derivatives']});
const glsl = require('glslify');
const camera = require('regl-camera')(regl);
const mesh = require('glsl-solid-wireframe')(require('bunny'));

const draw = regl({
  frag: glsl`
    #extension GL_OES_standard_derivatives : enable
    precision mediump float;
    #pragma glslify: grid = require(glsl-solid-wireframe/barycentric/scaled)
    varying vec2 b;
    void main () {
      gl_FragColor = vec4(vec3(grid(b, 1.0)), 1);
    }
  `,
  vert: `
    precision mediump float;
    uniform mat4 projection, view;
    attribute vec3 position;
    attribute vec2 barycentric;
    varying vec2 b;
    void main () {
    b = barycentric;
    // b = vec2(0.1,1.);
    gl_Position = projection * view * vec4(position, 1);
    }
  `,
  attributes: {
    position: mesh.positions,
    barycentric: mesh.barycentric
  },
  elements: mesh.cells,
});

regl.frame(() => {
  regl.clear({color: [1, 1, 1, 1], depth: 1});
  camera(draw);
});