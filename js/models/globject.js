var GLObject = function() {
	this.buffers = [];
	this.drawByIndex = false;
	this.isColorEnabled = false;

	this.position = vec3.fromValues(0.0, 0.0, -5.0);
	this.rotation = vec3.fromValues(0.0, 0.0, 0.0);
	this.scale = vec3.fromValues(1.0, 1.0, 1.0);
	this.color = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
};

GLObject.prototype = {
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

	draw: function() {
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

		// Enviamos el buffer del color al shader
		gl.bindBuffer(colorBuffer.type,colorBuffer);
		gl.vertexAttribPointer(program.attributes.aVertexColor, colorBuffer.itemSize, gl.FLOAT, false, 0, 0);		
		//..
		//..
		
		// Enviamos el buffer de los vertices al shader

		gl.bindBuffer(vertexBuffer.type, vertexBuffer);
		gl.vertexAttribPointer(program.attributes.vPos, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);		
		
		// Activamos el envio de arreglo con la variable aVertexColor de tipo atributo
		//..
		gl.enableVertexAttribArray(program.attributes.aVertexColor);	

		// Activamos el envio de arreglo con la variable vPos de tipo atributo		

		gl.enableVertexAttribArray(program.attributes.vPos);	

		//..
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

	},

	/* Getters And Setters */
	getColor: function() { return this.color; },
	getColorR: function() { return this.color[0]; },
	getColorG: function() { return this.color[1]; },
	getColorB: function() { return this.color[2]; },
	getColorA: function() { return this.color[3]; },
	setColor: function(r, g, b, a) { 

		var color=[];
		for (var i = this.buffers["vertex"].numItems- 1; i >= 0; i--) {
			color.push(r);
			color.push(g);
			color.push(b);
			color.push(a);
		};
		this.createBuffer("color", "array", 4, color);
		//..
		//..
		//..
		//..
		//..
		//..
		//..
	},
	setColors: function(colors) {
		this.color=colors;
		//..
		//..
	},

	getPosition: function() { return this.position; },
	getPositionX: function() { return this.position[0]; },
	getPositionY: function() { return this.position[1]; },
	getPositionZ: function() { return this.position[2]; },

	setPosition: function(position) { this.position = position; },
	setPositionX: function(x) { this.position[0] = x; },
	setPositionY: function(y) { this.position[1] = y; },
	setPositionZ: function(z) { this.position[2] = z; },

	getScale: function() { return this.scale; },
	getScaleX: function() { return this.scale[0]; },
	getScaleY: function() { return this.scale[1]; },
	getScaleZ: function() { return this.scale[2]; },

	setScale: function(scale) { this.scale = scale; },
	setScaleX: function(sx) { this.scale[0] = sx; },
	setScaleY: function(sy) { this.scale[1] = sy; },
	setScaleZ: function(sz) { this.scale[2] = sz; },

	getRotation: function() {
		var x = Math.radToDeg(this.rotation[0]);
		var y = Math.radToDeg(this.rotation[1]);
		var z = Math.radToDeg(this.rotation[2]);
		return vec3.fromValues(x, y, z);
	},
	getRotationX: function() { return Math.radToDeg(this.rotation[0]); },
	getRotationY: function() { return Math.radToDeg(this.rotation[1]); },
	getRotationZ: function() { return Math.radToDeg(this.rotation[2]); },

	setRotation: function(rotation) { 
		for (var i = 0; i < rotation.length; i++) {
			rotation[i] = (rotation[i] > 360) ? rotation[i] - 360 : rotation[i];
			rotation[i] = (rotation[i] < 0) ? rotation[i] + 360 : rotation[i];
		}
		var x = Math.degToRad(rotation[0]);
		var y = Math.degToRad(rotation[1]);
		var z = Math.degToRad(rotation[2]);
		this.rotation = vec3.fromValues(x, y, z);
	},
	setRotationX: function(rx) { 
		rx = (rx > 360) ? rx - 360 : rx;
		rx = (rx < 0) ? rx + 360 : rx;
		this.rotation[0] = Math.degToRad(rx);
	},
	setRotationY: function(ry) {
		ry = (ry > 360) ? ry - 360 : ry;
		ry = (ry < 0) ? ry + 360 : ry;
		this.rotation[1] = Math.degToRad(ry);
	},
	setRotationZ: function(rz) {
		rz = (rz > 360) ? rz - 360 : rz;
		rz = (rz < 0) ? rz + 360 : rz;
		this.rotation[2] = Math.degToRad(rz);
	}
};

GLObject.createSquare = function() {
	var glObject = new GLObject();
	var vertices = [
		 1.0,  1.0,  0.0,
		-1.0,  1.0,  0.0,
		 1.0, -1.0,  0.0,
		-1.0, -1.0,  0.0
	];
	glObject.createBuffer("vertex", "array", 3, vertices);
	return glObject;
}

GLObject.createCube = function() {
	var glObject = new GLObject();
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
		  0.2,  0.5,  0.9, 1.0,//2
		 1.0,  0.0,  0.3, 1.0,//3
		 
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
		  0.5, 0.5, 0.5,1.0, //16
		  1.0,  1.0, 1.0,1.0, //17
		  1.0,  1.0,  1.0,1.0, //18
		  1.0, 1.0,  1.0,1.0, //19
		 
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
	return glObject;
}













