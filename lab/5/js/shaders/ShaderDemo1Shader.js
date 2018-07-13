/**
 * @author flimshaw / http://charliehoey.com
 *
 * Technicolor Shader
 * Simulates the look of the two-strip technicolor process popular in early 20th century films.
 * More historical info here: http://www.widescreenmuseum.com/oldcolor/technicolor1.htm
 * Demo here: http://charliehoey.com/technicolor_shader/shader_test.html
 */
var flim_noise = THREE.ImageUtils.loadTexture("textures/seamless-perlin-noise.jpg");
flim_noise.wrapS = THREE.RepeatWrapping;
flim_noise.wrapT = THREE.RepeatWrapping;
THREE.ShaderDemo1Shader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"tNoise": { type: "t", value: flim_noise },
		"uTime": { type: "f", value: 0.0 },
	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform sampler2D tNoise;",
		"uniform float uTime;",

		"varying vec2 vUv;",

		"vec3 Wheel(float wheelPos)",
		"{",
		"	float r = abs(tan(wheelPos + .025));",
        "	float g = abs(tan(wheelPos - .05));",
        "	float b = abs(tan(wheelPos - .1));",
		"  return( vec3( r, g, b ) );",
		"}",

		"void main() {",

			"float phase = abs( sin( uTime * .0001 ) );",
			"float wipe = sin(uTime * .000025);",
			"vec4 tex = texture2D( tNoise, vec2(vUv.x + (uTime * .000025), vUv.y * ( sin(uTime * .0001) * .25 + .75) ));",
			"vec4 tex2 = texture2D( tNoise, vec2(vUv.x - (tex.r * .2), vUv.y - (tex.r * .3) ) );",
			
			"gl_FragColor = vec4(Wheel( ( (tex.r * sin(tex2.r) * 2.5) ) * .55 ), 1.);",

			// "gl_FragColor = vec4(Wheel( ( (tex.r - (2.5 * tex2.r)) ) * ( (sin(uTime * .0001) * 1.) ) ), 1.);",
		"}"

	].join("\n")

};
