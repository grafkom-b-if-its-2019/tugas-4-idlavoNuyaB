precision mediump float;

attribute vec2 aPosition;
attribute vec3 aColor;
varying vec3 fColor;
uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
void main(){
    fColor=aColor;
    gl_Position = projection * view * model*vec4(aPosition,0,1) ;
}