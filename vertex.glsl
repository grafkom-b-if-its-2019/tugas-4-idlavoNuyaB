precision mediump float;

attribute vec3 aPosition;
uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform mat4 mvp;
void main(){
    gl_Position = mvp* vec4(aPosition,1) ;
}