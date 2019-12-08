precision mediump float;

attribute vec3 aPosition;
uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
void main(){
    gl_Position = projection * view *model* vec4(aPosition,1) ;
}