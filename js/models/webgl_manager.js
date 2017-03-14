var GLM = function() {	
	this.gl = {};
	this.shaderPrograms = [];
};

GLM.prototype = {	
	getProgram: function(programName) {
		return this.shaderPrograms[programName];
	},

	createProgram: function(shaderSource) {
		var shader = this.getShader(shaderSource);
		if (shader == null) return;

		var shaderProgram = this.gl.createProgram();
		shaderProgram.name = shaderSource.name;
		this.gl.attachShader(shaderProgram, shader.vertex);
		this.gl.attachShader(shaderProgram, shader.fragment);
		this.gl.linkProgram(shaderProgram);

		if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
			alert("No se pudo cargar los shaders");
			return;
		}

		this.gl.bindAttribLocation(shaderProgram, 0, "aVertexPosition");

		shaderProgram.attributes = {
			vPos: this.gl.getAttribLocation(shaderProgram, "aVertexPosition"),
			aVertexColor: this.gl.getAttribLocation(shaderProgram, "aVertexColor")
		};

		shaderProgram.uniforms = {
			pMatrix: this.gl.getUniformLocation(shaderProgram, "uPMatrix"),
			mvMatrix: this.gl.getUniformLocation(shaderProgram, "uMVMatrix")
		}

		this.gl.useProgram(shaderProgram);

		var pMatrix = mat4.create();
                var pMatrixTranslate=mat4.create();
                var vectorEye=vec3.fromValues(0.0, 0.0, 1.0);
                var vectorCenter=vec3.fromValues(0.0, 0.0, 0.0);
                var vectorUp=vec3.fromValues(0.0, 1.0, 0.0);
                //pMatrix = pMatrix*pMatrixTranslate;
                //mat4.fromTranslation(pMatrix,vectorTraslate);
                //mat4.lookAt(pMatrix,vectorEye,vectorCenter,vectorUp);
                //mat4.scalar.scale(pMatrix,pMatrixTranslate,vectorTranlate);
		mat4.perspective(pMatrix, 45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0);
		this.gl.uniformMatrix4fv(shaderProgram.uniforms.pMatrix, false, pMatrix);

		this.shaderPrograms[shaderProgram.name] = shaderProgram;
	},


	getShader: function(shaderSource) {
		var vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
		var fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

		this.gl.shaderSource(vertexShader, shaderSource.vertexText);
		this.gl.compileShader(vertexShader);

		this.gl.shaderSource(fragmentShader, shaderSource.fragmentText);
		this.gl.compileShader(fragmentShader);

		if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
		    alert(this.gl.getShaderInfoLog(vertexShader));		    
		    return null;
		}
		if (!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)) {
		    alert(this.gl.getShaderInfoLog(fragmentShader));	
		    return null;
		}

		var compiledShader = {
			vertex: vertexShader,
			fragment: fragmentShader
		};

		return compiledShader;
	},

	clear: function() {		
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);			
	}
};

GLM.instance = null;
GLM.initialize = function(canvas) {
	GLM.instance = new GLM();	
	var gl;
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);		
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);		
	} catch (e) {
		alert("Problema al cargar WebGL en el canvas");
		return false;
	}
	GLM.instance.gl = gl;
	return true;
};

GLM.getInstance = function() { return GLM.instance; };
