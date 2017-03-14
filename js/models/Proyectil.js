/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var Proyectil=function(){
    this.buffers = [];
    this.drawByIndex = false;
    this.isColorEnabled = false;
    this.position = vec3.fromValues(0.0, 0, 0);
    this.rotation = vec3.fromValues(0.0, 0.0, 0.0);
    this.scale = vec3.fromValues(1.0, 1.0, 1.0);
    this.color = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.colision;
  
};

Proyectil.prototype={
    Move:function(){
        this.position[2]-=.1;
    },
    DetectarColision:function(Proyectil){
        
    },  
    createBuffer: function(name, type, itemSize, data) {	
		var gl = GLM.getInstance().gl;		
		var buffer = gl.createBuffer();
		if (type == "array") {
			buffer.type = gl.ARRAY_BUFFER;
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
		} else {
			buffer.type = gl.ELEMENT_ARRAY_BUFFER;
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
		}
		buffer.itemSize = itemSize;
		buffer.numItems = data.length / itemSize;
		this.buffers[name] = buffer;	
	},
      Draw:function(){
                //clear();
      		var gl = GLM.getInstance().gl;
		var program = GLM.getInstance().getProgram("basicColor");

		var mvMatrix = mat4.create();
		mat4.identity(mvMatrix);

		mat4.translate(mvMatrix, mvMatrix, this.position);
		mat4.rotateX(mvMatrix, mvMatrix, this.rotation[0]);
		mat4.rotateY(mvMatrix, mvMatrix, this.rotation[1]);
		mat4.rotateZ(mvMatrix, mvMatrix, this.rotation[2]);
		mat4.scale(mvMatrix, mvMatrix, this.scale);

		gl.uniformMatrix4fv(program.uniforms.mvMatrix, false, mvMatrix);

		var vertexBuffer = this.buffers["vertex"];
		var colorBuffer = this.buffers["color"];

		
		gl.bindBuffer(colorBuffer.type,colorBuffer);
		gl.vertexAttribPointer(program.attributes.aVertexColor, colorBuffer.itemSize, gl.FLOAT, false, 0, 0);		
		

		gl.bindBuffer(vertexBuffer.type, vertexBuffer);
		gl.vertexAttribPointer(program.attributes.vPos, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);		
		
		
		gl.enableVertexAttribArray(program.attributes.aVertexColor);	

		

		gl.enableVertexAttribArray(program.attributes.vPos);	

		
		var drawMode = (this.isColorEnabled) ? gl.TRIANGLES : gl.TRIANGLE_STRIP;

		if (this.drawByIndex == false) {
			gl.bindBuffer(vertexBuffer.type, vertexBuffer);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexBuffer.numItems);
		} else {
			var indexBuffer = this.buffers["index"];
				gl.bindBuffer(indexBuffer.type, indexBuffer);
			gl.drawElements(gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}

		gl.disableVertexAttribArray(program.attributes.aVertexColor);
		gl.disableVertexAttribArray(program.attributes.vPos);
      
  }
};

Proyectil.Create=function(positionSpawn,scale,rotation){
      var glObject = new Proyectil();
      glObject.position=positionSpawn;
      glObject.scale=scale;
      glObject.rotation=rotation;
	var vertices = [
		// Front
		 -1.0, -1.0,  1.0, //0
		  1.0, -1.0,  1.0, //1
		  1.0,  1.0,  1.0, //2
		 -1.0,  1.0,  1.0, //3
		 
		 // Back
		 -1.0, -1.0, -1.0, //4
		 -1.0,  1.0, -1.0, //5
		  1.0,  1.0, -1.0, //6
		  1.0, -1.0, -1.0, //7
		 
		 // Top
		 -1.0,  1.0, -1.0, //8
		 -1.0,  1.0,  1.0, //9
		  1.0,  1.0,  1.0, //10
		  1.0,  1.0, -1.0, //11
		 
		 // Bottom 
		 -1.0, -1.0, -1.0, //12
		  1.0, -1.0, -1.0, //13
		  1.0, -1.0,  1.0, //14
		 -1.0, -1.0,  1.0, //15
		 
		 // Right
		  1.0, -1.0, -1.0, //16
		  1.0,  1.0, -1.0, //17
		  1.0,  1.0,  1.0, //18
		  1.0, -1.0,  1.0, //19
		 
		 // Left
		 -1.0, -1.0, -1.0, //20
		 -1.0, -1.0,  1.0, //21
		 -1.0,  1.0,  1.0, //22
		 -1.0,  1.0, -1.0  //23
	];

	var indices = [ 
		0,  1,  2,      0,  2,  3,    // front
		4,  5,  6,      4,  6,  7,    // back
		8,  9,  10,     8,  10, 11,   // top
		12, 13, 14,     12, 14, 15,   // bottomm
		16, 17, 18,     16, 18, 19,   // right
		20, 21, 22,     20, 22, 23    // left
	];

	// Los colores son por vertice (Un color por cada vertice)
	var colors = [
		 1.0, 1.0,  1.0,1.0, //0
		  1.0, 1.0,  1.0, 1.0,//1
		  1.0,  1.0,  1.0, 1.0,//2
		 1.0,  1.0,  1.0, 1.0,//3
		 
		 // Back
		 1.0, 1.0, 1.0, 1.0,//4
		 1.0,  1.0, 1.0, 1.0,//5
		  1.0,  1.0, 1.0,1.0, //6
		  1.0, 1.0, 1.0, 1.0,//7
		 
		 // Top
		 1.0,  1.0, 1.0, 1.0,//8
		 1.0,  1.0,  1.0,1.0, //9
		  1.0,  1.0,  1.0,1.0, //10
		  1.0,  1.0, 1.0,1.0, //11
		 
		 // Bottom 
		 1.0, 1.0, 1.0, 1.0,//12
		  1.0, 1.0, 1.0, 1.0,//13
		  1.0, 1.0,  1.0,1.0, //14
		 1.0, 1.0,  1.0, 1.0,//15
		 
		 // Right
		 1.0, 1.0,  1.0,1.0, //0
		  1.0, 1.0,  1.0, 1.0,//1
		  1.0,  1.0,  1.0, 1.0,//2
		 1.0,  1.0,  1.0, 1.0,//3
		 
		 // Left
		 1.0, 1.0, 1.0, 1.0,//20
		 1.0, 1.0,  1.0, 1.0,//21
		 1.0,  1.0,  1.0,1.0, //22
		 1.0,  1.0, 1.0,1.0  //23

	];

	glObject.createBuffer("vertex", "array", 3, vertices);
	glObject.createBuffer("color", "array", 4, colors);
	glObject.createBuffer("index", "element", 1, indices);

	// Creamos el buffer del color
	glObject.isColorEnabled = true;
	glObject.drawByIndex = true;
        glObject.colision=new Colision.Create(glObject.position,glObject.rotation,glObject.scale);
	return glObject;
  };