/**
 * @author mrdoob / http://www.mrdoob.com
 *
 * Simple test shader
 */

THREE.CharlieShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"h":        { type: "f", value: 1.0 / 512.0 },
		"time": 	{ type: "f", value: 0.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"precision highp float;",
		"uniform sampler2D tDiffuse;",
		"uniform float h;",
		"uniform float time;",

		"varying vec2 vUv;",

		"float random( vec2 p )",
		"{",
		"  // We need irrationals for pseudo randomness.",
		"  // Most (all?) known transcendental numbers will (generally) work.",
		"  const vec2 r = vec2(",
		"    23.1406926327792690,  // e^pi (Gelfond's constant)",
		"     2.6651441426902251); // 2^sqrt(2) (Gelfond–Schneider constant)",
		"  return fract( cos( mod( 123456789., 1e-7 + 256. * dot(p,r) ) ) );  ",
		"}",

		"void main() {",

			"vec4 sum = texture2D( tDiffuse, vUv );",
			"sum = vec4( 0., sum.g, 0., 1. );",
			"float blur = .5;",
			"float blurDist = .005 * distance( vUv, vec2(.5, .5) );",
			"sum += vec4(0., 1., 0., 1.) * texture2D( tDiffuse, vec2( vUv.x - blurDist, vUv.y ) ) * blur;",
			"sum += vec4(0., 0., 1., 1.) * texture2D( tDiffuse, vec2( vUv.x - blurDist, vUv.y - blurDist ) ) * blur;",
			"sum += vec4(1., 0., 0., 1.) * texture2D( tDiffuse, vec2( vUv.x, vUv.y - blurDist ) ) * blur;",
			"sum *= abs(sin(vUv.y * 2700.));",
			"gl_FragColor = sum;",

		"}"

	].join("\n")

};
