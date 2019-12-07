precision mediump float;

attribute vec2 aPosition;
attribute vec3 aColor;
varying vec3 fColor;
uniform vec3 theta;
uniform vec3 gerak;
void main(){
    fColor=aColor;
    vec3 angle = radians(theta);
    vec3 c = cos(angle);
    vec3 s = sin(angle);
    gl_PointSize = 10.0;
    mat4 skalasi = mat4(
        0.2, 0.0, 0.0, 0.0,           //  y - - y
        0.0, 0.2, 0.0, 0.0,             //  - x x -
        0.0, 0.0, 1.0, 0.0,             //  y x x y
        0.0, 0.0, 0.0, 1.0              //
    );
    mat4 rx = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, c.x, s.x, 0.0,
        0.0, -s.x, c.x, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
    mat4 ry = mat4(
        c.y, 0.0, -s.y, 0.0,
        0.0, 1.0, 0.0, 0.0,
        s.y, 0.0, c.y, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
    mat4 rz = mat4(
        c.z, s.z, 0.0, 0.0,
        -s.z, c.z, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
    mat4 translasi = mat4(
        1.0, 0.0, 0.0, gerak.x,   // dx = 0.5
        0.0, 1.0, 0.0, gerak.y,
        0.0, 0.0, 1.0, gerak.z,
        0.0, 0.0, 0.0, 1.0
    );
    gl_Position = vec4(aPosition,0,1) * skalasi * rz * ry * rx;
    gl_Position = gl_Position * translasi;
}