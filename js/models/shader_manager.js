var ShaderManager = function() {

}

ShaderManager.getNoColorShader = function() {
	var shader = {};
	shader.vertex = {};
	shader.fragment = {};
	shader.name = "noColor";

	shader.vertexText = `
		attribute vec3 aVertexPosition;
		uniform mat4 uMVMatrix;
		uniform mat4 uPMatrix;

		void main(void) {
		    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
		}`;
	shader.fragmentText = `
		precision highp float;    
		void main(void) {
		    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
		}`;

	return shader;	
};

ShaderManager.getBasicColorShader = function() {
	var shader = {};
	shader.vertex = {};
	shader.fragment = {};
	shader.name = "basicColor";

	shader.vertexText = `
		attribute vec3 aVertexPosition;
		attribute vec4 aVertexColor;
		uniform mat4 uMVMatrix;
		uniform mat4 uPMatrix;

	    varying lowp vec4 vColor;

		void main(void) {
		    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
		    vColor = aVertexColor;
		}`;
	shader.fragmentText = `
		precision highp float;   

	    varying lowp vec4 vColor;

		void main(void) {
	        gl_FragColor = vColor;
		}`;

	return shader;	
};