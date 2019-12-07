precision mediump float;

varying vec3 fNormal;
varying vec3 fPosition;
varying vec2 fTexCoord;

uniform vec3 lightColor;
uniform vec3 lightPosition;
uniform vec3 ambientColor;

uniform sampler2D sampler0;

void main() {

  vec4 tex0 = texture2D(sampler0, fTexCoord); // Hasil akhirnya adalah warna (RGBA)

  vec3 normal = normalize(fNormal);
  vec3 lightDirection = lightPosition - fPosition;
  float lightIntensity = max(dot(lightDirection, normal), 0.0);
  vec3 diffuse = lightColor * tex0.rgb * lightIntensity;
  vec3 ambient = ambientColor * tex0.rgb;

  gl_FragColor = vec4(diffuse + ambient, 1.0);
}
