(function (global) {
  // var canvas,gl,program;
  glUtils.SL.init({callback:function() { main();} });  
  function main(){
    window.addEventListener('resize', resize);
    var canvas=document.getElementById("glcanvas");
    var gl=glUtils.checkWebGL(canvas);
    var vertexShader =glUtils.getShader(gl,gl.VERTEX_SHADER,glUtils.SL.Shaders.v1.vertex);
    var fragmentShader=glUtils.getShader(gl,gl.FRAGMENT_SHADER,glUtils.SL.Shaders.v1.fragment);
    var vertexShader2 =glUtils.getShader(gl,gl.VERTEX_SHADER,glUtils.SL.Shaders.v2.vertex);
    var fragmentShader2=glUtils.getShader(gl,gl.FRAGMENT_SHADER,glUtils.SL.Shaders.v2.fragment);
    resize();
    var program=glUtils.createProgram(gl,vertexShader,fragmentShader);
    var program2=glUtils.createProgram(gl,vertexShader2,fragmentShader2);
    //Huruf
    var gerakx=Math.random() * 0.0085;
    var geraky=Math.random()* 0.0085;
    var gerakz=Math.random()* 0.0085;
    var gerak=[0,0,0];
    var rotation=[0,0,0];
    var rotate=0.05;
    //Cube
    var thetaCube = [0,0,0];  
    var xAxis = 0;
    var yAxis = 1;
    var zAxis = 2;
    gl.useProgram(program2)
    // Uniform untuk definisi cahaya
    var lightColorLoc = gl.getUniformLocation(program2, 'lightColor');
    var lightPositionLoc = gl.getUniformLocation(program2, 'lightPosition');
    var ambientColorLoc = gl.getUniformLocation(program2, 'ambientColor');
    var lightColor = [0.1,0.2,0.3];
    var lightPosition;
    var ambientColor = glMatrix.vec3.fromValues(0.05117, 0.4000, 0.0085);
    gl.uniform3fv(lightColorLoc, lightColor);
    gl.uniform3fv(ambientColorLoc, ambientColor);
    var vm = glMatrix.mat4.create();
    var pm = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(vm,
      glMatrix.vec3.fromValues(0.0, 0.0, 0.0),    // posisi kamera
      glMatrix.vec3.fromValues(0.0, 0.0, -2.0),  // titik yang dilihat; pusat kubus akan kita pindah ke z=-2
      glMatrix.vec3.fromValues(0.0, 1.0, 0.0)   // arah atas dari kamera
    );

    var fovy = glMatrix.glMatrix.toRadian(90.0);
    var aspect = canvas.width / canvas.height;
    var near = 0.01;
    var far = 10.0;
    glMatrix.mat4.perspective(pm,
      fovy,
      aspect,
      near,
      far
    );
    // Definisi view, model, dan projection
    var vmLoc = gl.getUniformLocation(program2, 'view');
    var pmLoc = gl.getUniformLocation(program2, 'projection');
    var mmLoc = gl.getUniformLocation(program2, 'model');
    gl.uniformMatrix4fv(vmLoc, false, vm);
    gl.uniformMatrix4fv(pmLoc, false, pm);
    function resize(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }
    var lastX, lastY, dragging;
    function onMouseDown(event) {
      var x = event.clientX;
      var y = event.clientY;
      var rect = event.target.getBoundingClientRect();
      if (rect.left <= x &&
          rect.right > x &&
          rect.top <= y &&
          rect.bottom > y) {
            lastX = x;
            lastY = y;
            dragging = true;
      }
    }
    function onMouseUp(event) {
      dragging = false;
    }
    function onMouseMove(event) {
      var x = event.clientX;
      var y = event.clientY;
      if (dragging) {
        var factor = 10 / canvas.height;
        var dx = factor * (x - lastX);
        var dy = factor * (y - lastY);
        thetaCube[yAxis] += dx;
        thetaCube[xAxis] += dy;
      }
      lastX = x;
      lastY = y;
    }
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
    render();   
    gl.useProgram(program2);
    // Uniform untuk tekstur
    var sampler0Loc = gl.getUniformLocation(program2, 'sampler0');
    gl.uniform1i(sampler0Loc, 0);
    // Inisialisasi tekstur
    var texture = gl.createTexture();
    if (!texture) {
      reject(new Error('Gagal membuat objek tekstur'));
    }
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Sementara warnai tekstur dengan sebuah 1x1 piksel biru
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
    initTexture(function () {
      render();
    });
    function cube(){
      gl.useProgram(program2);
      /**
     *  A ( -0.5, -0.5,  0.5 )
     *  B ( -0.5,  0.5,  0.5 )
     *  C (  0.5,  0.5,  0.5 )
     *  D (  0.5, -0.5,  0.5 )
     *  E ( -0.5, -0.5, -0.5 )
     *  F ( -0.5,  0.5, -0.5 )
     *  G (  0.5,  0.5, -0.5 )
     *  H (  0.5, -0.5, -0.5 )
     */
      var cubeVertices = [
        // x, y, z            u, v         normal

        // -0.5,  0.5,  0.5,     0.0, 1.0,  0.0, 0.0, 1.0, // depan, merah, BAD BDC
        // -0.5, -0.5,  0.5,     0.0, 0.0,  0.0, 0.0, 1.0, 
        // 0.5, -0.5,  0.5,     1.0, 0.0,  0.0, 0.0, 1.0, 
        // -0.5,  0.5,  0.5,     0.0, 1.0,  0.0, 0.0, 1.0, 
        // 0.5, -0.5,  0.5,     1.0, 0.0,  0.0, 0.0, 1.0, 
        // 0.5,  0.5,  0.5,     1.0, 1.0,  0.0, 0.0, 1.0, 

        0.5,  0.5,  0.5,     0.0, 0.5,  1.0, 0.0, 0.0, // kanan, hijau, CDH CHG
        0.5, -0.5,  0.5,     0.0, 0.0,  1.0, 0.0, 0.0,
        0.5, -0.5, -0.5,     0.33, 0.0,  1.0, 0.0, 0.0,
        0.5,  0.5,  0.5,     0.0, 0.5,  1.0, 0.0, 0.0,
        0.5, -0.5, -0.5,     0.33, 0.0,  1.0, 0.0, 0.0,
        0.5,  0.5, -0.5,     0.33, 0.5,  1.0, 0.0, 0.0,

        0.5, -0.5,  0.5,     0.33, 0.5,  0.0, -1.0, 0.0, // bawah, biru, DAE DEH
        -0.5, -0.5,  0.5,     0.33, 0,  0.0, -1.0, 0.0,
        -0.5, -0.5, -0.5,     0.66, 0,  0.0, -1.0, 0.0,
        0.5, -0.5,  0.5,     0.33, 0.5,  0.0, -1.0, 0.0,
        -0.5, -0.5, -0.5,     0.66, 0,  0.0, -1.0, 0.0,
        0.5, -0.5, -0.5,     0.66, 0.5,  0.0, -1.0, 0.0,

        -0.5, -0.5, -0.5,     0.66, 0.5,  0.0, 0.0, -1.0, // belakang, kuning, EFG EGH
        -0.5,  0.5, -0.5,     0.66, 0.0,  0.0, 0.0, -1.0,
        0.5,  0.5, -0.5,     1.0, 0.0,  0.0, 0.0, -1.0,
        -0.5, -0.5, -0.5,     0.66, 0.5,  0.0, 0.0, -1.0,
        0.5,  0.5, -0.5,     1.0, 0.0,  0.0, 0.0, -1.0,
        0.5, -0.5, -0.5,     1.0, 0.5,  0.0, 0.0, -1.0,

        -0.5,  0.5, -0.5,     0.0, 1.0,  -1.0, 0.0, 0.0, // kiri, cyan, FEA FAB
        -0.5, -0.5, -0.5,     0.0, 0.5,  -1.0, 0.0, 0.0,
        -0.5, -0.5,  0.5,     0.33, 0.5,  -1.0, 0.0, 0.0,
        -0.5,  0.5, -0.5,     0.0, 1.0,  -1.0, 0.0, 0.0,
        -0.5, -0.5,  0.5,     0.33, 0.5,  -1.0, 0.0, 0.0,
        -0.5,  0.5,  0.5,     0.33, 1.0,  -1.0, 0.0, 0.0,

        0.5,  0.5, -0.5,     0.33, 1.0,  0.0, 1.0, 0.0, // atas, magenta, GFB GBC
        -0.5,  0.5, -0.5,     0.33, 0.5,  0.0, 1.0, 0.0,
        -0.5,  0.5,  0.5,     0.66, 0.5,  0.0, 1.0, 0.0,
        0.5,  0.5, -0.5,     0.33, 1.0,  0.0, 1.0, 0.0,
        -0.5,  0.5,  0.5,     0.66, 0.5,  0.0, 1.0, 0.0,
        0.5,  0.5,  0.5,     0.66, 1.0,  0.0, 1.0, 0.0
      ];
  
      var cubeVBO = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, cubeVBO);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);
  
      var vPosition = gl.getAttribLocation(program2, 'vPosition');
      var vTexCoord = gl.getAttribLocation(program2, 'vTexCoord');
      var vNormal = gl.getAttribLocation(program2, 'vNormal');
      gl.vertexAttribPointer(
        vPosition,  // variabel yang memegang posisi attribute di shader
        3,          // jumlah elemen per attribute
        gl.FLOAT,   // tipe data atribut
        gl.FALSE,
        8 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap verteks 
        0                                   // offset dari posisi elemen di array
      );
      gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, gl.FALSE, 
        8 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
      gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, gl.FALSE, 
          8 * Float32Array.BYTES_PER_ELEMENT, 5 * Float32Array.BYTES_PER_ELEMENT);
  
      gl.enableVertexAttribArray(vPosition);
      gl.enableVertexAttribArray(vTexCoord);
      gl.enableVertexAttribArray(vNormal);
      // thetaCube[axis] += gcube;  // dalam derajat
      var nmLoc = gl.getUniformLocation(program2, 'normalMatrix');
     
      var mm = glMatrix.mat4.create();
      glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -2.0]);
      glMatrix.mat4.rotateY(mm, mm, thetaCube[yAxis]);
      glMatrix.mat4.rotateX(mm, mm, thetaCube[xAxis]);
      glMatrix.mat4.rotateZ(mm, mm, thetaCube[zAxis]);
      gl.uniformMatrix4fv(mmLoc, false, mm);
      // Perhitungan modelMatrix untuk vektor normal
      var nm = glMatrix.mat3.create();
      glMatrix.mat3.normalFromMat4(nm, mm);
      gl.uniformMatrix3fv(nmLoc, false, nm);
      gl.drawArrays(gl.TRIANGLES, 0,30);
    }
    function rendersegitiga(){
      gl.useProgram(program);
      var vertices = [
        // x, y       r, g, b   x'=x-0.6
        -0.2,+0.75,0.0,      
        -0.2,-0.75,0.0,      
        -0.15,+0.76,0.0,     
        -0.15,+0.76,0,     
        -0.15,-0.65,0,     
        -0.2,-0.75,0,      
        -0.15,+0.76,0,     
        +0.1,+0.8,0,       
        -0.15,+0.65,0,     
        -0.15,+0.65,0,     
        +0.1,+0.8,0,       
        +0.075,+0.7,0,     
        +0.2,+0.425,0,    
        +0.1,+0.8,0,      
        +0.075,+0.7,0,    
        +0.2,+0.425,0,    
        +0.075,+0.7,0,    
        +0.15,+0.425,0,   
        +0.15,+0.425,0,    
        +0.2,+0.425,0,     
        -0.15,+0.05,0,     
        -0.15,+0.05,0,     
        +0.2,+0.425,0,     
        -0.15,-0.05,0,     
        -0.15,+0.05,0,     
        +0.2,-0.325,0,     
        +0.15,-0.325,0,    
        -0.15,-0.05,0,     
        -0.15,+0.05,0,     
        +0.15,-0.325,0,    
        +0.2,-0.325,0,     
        +0.15,-0.325,0,    
        +0.1,-0.7,0,       
        +0.1,-0.7,0,       
        +0.15,-0.325,0,    
        +0.075,-0.6,0,     
        +0.075,-0.6,0,     
        -0.15,-0.65,0,     
        +0.1,-0.7,0,       
        -0.2,-0.75,0,      
        +0.1,-0.7,0,       
        -0.15,-0.65,0 
      ];
      matrixScaling(vertices,0.1);
      lightPosition = [gerak[0],gerak[1],-2+gerak[2]];
      var vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
      var aPosition = gl.getAttribLocation(program, 'aPosition');
      // var aColor = gl.getAttribLocation(program, 'aColor');
      gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
      // gl.vertexAttribPointer(aColor, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(aPosition);
      // gl.enableVertexAttribArray(aColor);
      if(gerak[0]+0.2> 0.5 || gerak[0]-0.2 <-0.5){
        gerakx*=-1;
        rotate*=-1;
      }
      gerak[0]+=gerakx;
      rotation[0]+=rotate;
      lightPosition[0]+=gerakx;
      if(gerak[1]+0.2 > 0.5 || gerak[1]-0.2 <-0.5){
        geraky*=-1;
        rotate*=-1;
      }
      gerak[1]+=geraky;
      rotation[1]+=rotate;
      lightPosition[1]+=geraky;
      if(gerak[2]+0.05 > 0.5  || gerak[2]-0.05 <-0.5){
        gerakz*=-1;
        rotate*=-1;
      }
      gerak[2]+=gerakz;
      rotation[2]+=rotate;
      lightPosition[2]+=gerakz;
      var vmLoc2 = gl.getUniformLocation(program, 'view');
      var pmLoc2 = gl.getUniformLocation(program, 'projection');
      var mmLoc = gl.getUniformLocation(program, 'model');
      gl.uniformMatrix4fv(vmLoc2, false, vm);
      gl.uniformMatrix4fv(pmLoc2, false, pm);
      var mm = glMatrix.mat4.create();
      glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -2.0]);
      glMatrix.mat4.translate(mm,mm,gerak);
      gl.uniformMatrix4fv(mmLoc, false, mm);
      gl.drawArrays(gl.TRIANGLES,0,42);
      var mvpLoc=gl.getUniformLocation(program,'mvp');
      var mvp=glMatrix.mat4.create();
      glMatrix.mat4.multiply(mvp,vm,mm);
      glMatrix.mat4.multiply(mvp,pm,mvp);
      glMatrix.mat4.rotateX(mvp,mvp,rotation[xAxis]);
      glMatrix.mat4.rotateY(mvp,mvp,rotation[yAxis]);
      gl.uniformMatrix4fv(mvpLoc, false, mvp);
    }
    function render(){
      requestAnimationFrame(render);
      // Bersihkan layar jadi hitam
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(gl.DEPTH_TEST);
      // Bersihkan buffernya canvas
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      cube();
      rendersegitiga();
      gl.useProgram(program2);
      gl.uniform3fv(lightPositionLoc, lightPosition); 
    } 
    // Membuat mekanisme pembacaan gambar jadi tekstur
    function initTexture(callback, args) {
      var imageSource = 'images/Untitled.jpg';
      var promise = new Promise(function(resolve, reject) {
        var image = new Image();
        if (!image) {
          reject(new Error('Gagal membuat objek gambar'));
        }
        image.onload = function() {
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          resolve('Sukses');
        }
        image.src = imageSource;
      });
      promise.then(function() {
        if (callback) {
          callback(args);
        }
      }, function (error) {
        console.log('Galat pemuatan gambar', error);
      });
    }
  }

})(window || this);