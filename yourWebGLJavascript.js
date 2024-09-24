var gl;

window.addEventListener("load", init);

function init() {
   var canvas = document.getElementById("gl-canvas");
   gl = canvas.getContext('webgl2');
   if (!gl) alert("WebGL 2.0 isn't available");

   // Configure WebGL
   gl.clearColor(1.0, 1.0, 1.0, 1.0);
   gl.enable(gl.DEPTH_TEST);

   // Load shaders and initialize attribute buffers
   var program = initShaders(gl, "vertex-shader", "fragment-shader");
   gl.useProgram(program);

   // Set up data to draw
   var points = [];
   var colors = [];

   // Example usage of drawPoint function to draw a red point
   var redPoint = drawPoint(0.0, 0.0, 0.05, 1); // 1-sided circle (essentially a point)
   var redPointColor = generateColors(1, [1.0, 0.0, 0.0]); // Red color
   points = points.concat(redPoint);
   colors = colors.concat(redPointColor);

   // Draw a blue triangle
   var blueTriangle = [
      vec4(-0.5, -0.5, 0.0, 1.0),
      vec4(0.5, -0.5, 0.0, 1.0),
      vec4(0.0, 0.5, 0.0, 1.0)
   ];
   var blueTriangleColors = generateColors(3, [0.0, 0.0, 1.0]); // Blue color
   points = points.concat(blueTriangle);
   colors = colors.concat(blueTriangleColors);

   // Load the data into GPU data buffers
   var vertexBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

   var colorBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

   // Associate shader attributes with corresponding data buffers
   var vPosition = gl.getAttribLocation(program, "vPosition");
   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
   gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(vPosition);

   var vColor = gl.getAttribLocation(program, "vColor");
   gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
   gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(vColor);

   // Get addresses of shader uniforms
   var modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

   // Set point size uniform
   var pointSizeLoc = gl.getUniformLocation(program, "pointSize");
   gl.uniform1f(pointSizeLoc, 5.0); // Set point size to 5.0

   // Either draw as part of initialization
   render();
}

function render() {
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   // Draw the points
   gl.drawArrays(gl.POINTS, 0, 1);

   // Draw the triangle
   gl.drawArrays(gl.TRIANGLES, 1, 3);

   requestAnimationFrame(render);
}

function drawPoint(centerX, centerY, radius, sides) {
   var angle = (2 * Math.PI) / sides;
   var points = [];

   for (var i = 0; i < sides; i++) {
      var x = centerX + radius * Math.cos(i * angle);
      var y = centerY + radius * Math.sin(i * angle);
      points.push(vec4(x, y, 0.0, 1.0));
   }

   return points;
}

function generateColors(count, baseColor) {
   var colors = [];
   for (var i = 0; i < count; i++) {
      colors.push(baseColor);
   }
   return colors;
}
