function threeMezzanine () {
    var parent = new THREE.Object3D();

    var extrudeSettings = {
        bevelEnabled: false,
        bevelSegments: 0,
        steps: 20,
        amount: 5
    };
    var extrudeSettings2 = {
        bevelEnabled: true,
        bevelThickness: 3.0,
        bevelSize: 0.5,
        bevelSegments: 10,
        curveSegments : 50,
        steps: 20,
        amount: 50
    };
    var extrudeSettings3 = {
        bevelEnabled: false,
        bevelThickness: 10.0,
        bevelSize: 0,
        bevelSegments: 50,
        curveSegments : 50,
        steps: 50,
        amount: 50
    };

    //Blue Circle
    var ctx = new THREE.Shape();
    ctx.moveTo(300.0, 150.0);
//    ctx.arc(-150, 0, 150, 0, 7);
    ctx.bezierCurveTo(300.0, 232.8, 232.8, 300.0, 150.0, 300.0);
    ctx.bezierCurveTo(67.2, 300.0, 0.0, 232.8, 0.0, 150.0);
    ctx.bezierCurveTo(0.0, 67.2, 67.2, 0.0, 150.0, 0.0);
    ctx.bezierCurveTo(232.8, 0.0, 300.0, 67.2, 300.0, 150.0);

    var ctx1 = new THREE.Shape();
    ctx1.moveTo(67.0, 138.3);
    ctx1.bezierCurveTo(64.9, 136.2, 62.0, 135.1, 58.4, 135.0);
    ctx1.bezierCurveTo(58.4, 135.0, 58.3, 135.0, 58.2, 135.0);
    ctx1.bezierCurveTo(58.1, 135.0, 57.9, 135.0, 57.9, 135.0);
    ctx1.bezierCurveTo(54.3, 135.1, 51.4, 136.2, 49.4, 138.3);
    ctx1.bezierCurveTo(48.8, 138.8, 48.4, 139.3, 48.1, 139.9);
    ctx1.bezierCurveTo(47.7, 139.3, 47.3, 138.8, 46.8, 138.3);
    ctx1.bezierCurveTo(44.7, 136.2, 41.8, 135.1, 38.2, 135.0);
    ctx1.bezierCurveTo(38.2, 135.0, 38.0, 135.0, 38.0, 135.0);
    ctx1.bezierCurveTo(37.9, 135.0, 37.7, 135.0, 37.7, 135.0);
    ctx1.bezierCurveTo(34.1, 135.1, 31.2, 136.2, 29.1, 138.3);
    ctx1.bezierCurveTo(26.0, 141.5, 26.1, 145.7, 26.1, 145.9);
    ctx1.lineTo(26.1, 164.2);
    ctx1.lineTo(29.6, 164.2);
    ctx1.lineTo(29.6, 145.9);
    ctx1.bezierCurveTo(29.6, 145.8, 29.6, 142.8, 31.7, 140.7);
    ctx1.bezierCurveTo(33.1, 139.3, 35.2, 138.5, 38.0, 138.5);
    ctx1.bezierCurveTo(40.7, 138.5, 42.8, 139.3, 44.2, 140.7);
    ctx1.bezierCurveTo(46.1, 142.7, 46.3, 145.4, 46.3, 145.8);
    ctx1.bezierCurveTo(46.3, 145.9, 46.3, 145.9, 46.3, 145.9);
//    ctx1.lineTo(46.3, 164.2);
    ctx1.lineTo(46.3, 164.2);
//    ctx1.lineTo(49.8, 164.2);
    ctx1.lineTo(49.8, 164.2);
    ctx1.lineTo(49.8, 145.9);
    ctx1.bezierCurveTo(49.8, 145.9, 49.8, 145.8, 49.8, 145.8);
    ctx1.bezierCurveTo(49.8, 145.3, 50.0, 142.6, 51.9, 140.7);
    ctx1.bezierCurveTo(53.3, 139.3, 55.4, 138.5, 58.2, 138.5);
    ctx1.bezierCurveTo(60.9, 138.5, 63.0, 139.3, 64.4, 140.7);
    ctx1.bezierCurveTo(66.5, 142.8, 66.5, 145.8, 66.5, 145.9);
    ctx1.lineTo(66.5, 164.2);
    ctx1.lineTo(70.1, 164.2);
    ctx1.lineTo(70.1, 145.9);
    ctx1.bezierCurveTo(70.1, 145.7, 70.1, 141.5, 67.0, 138.3);


    // E
    var ctx2 = new THREE.Shape();
    ctx2.moveTo(77.7, 151.1);
    ctx2.bezierCurveTo(78.2, 157.5, 82.8, 161.5, 88.6, 161.5);
    ctx2.bezierCurveTo(92.8, 161.5, 96.5, 159.3, 98.4, 155.2);
    ctx2.lineTo(102.6, 155.2);
    ctx2.bezierCurveTo(99.9, 161.6, 95.0, 165.0, 88.8, 165.0);
    ctx2.bezierCurveTo(80.2, 165.0, 73.9, 158.0, 73.9, 150.0);
    ctx2.bezierCurveTo(73.9, 141.5, 80.0, 135.0, 88.9, 135.0);
    ctx2.bezierCurveTo(97.4, 135.0, 103.5, 141.3, 103.5, 150.9);
    ctx2.bezierCurveTo(103.5, 151.0, 103.5, 151.0, 103.5, 151.1);
    ctx2.lineTo(77.7, 151.1);

    var ctx2Subtract = new THREE.Path();
    ctx2Subtract.moveTo(88.4, 138.4);
    ctx2Subtract.bezierCurveTo(83.0, 138.4, 78.7, 142.0, 77.8, 148.1);
    ctx2Subtract.lineTo(99.4, 148.1);
    ctx2Subtract.bezierCurveTo(98.0, 141.7, 94.3, 138.4, 88.4, 138.4);
    ctx2.holes.push(ctx2Subtract);

    // Z
    var ctx3 = new THREE.Shape();
    ctx3.moveTo(104.5, 164.2);
    ctx3.lineTo(104.5, 160.8);
    ctx3.lineTo(119.3, 139.2);
    ctx3.lineTo(106.1, 139.2);
    ctx3.lineTo(106.1, 135.8);
    ctx3.lineTo(123.4, 135.8);
    ctx3.lineTo(123.4, 139.7);
    ctx3.lineTo(108.8, 160.6);
    ctx3.lineTo(124.2, 160.6);
    ctx3.lineTo(124.2, 164.2);
    ctx3.lineTo(104.5, 164.2);


    // Second Z
    var ctx4 = new THREE.Shape();
    ctx4.moveTo(127.2, 164.2);
    ctx4.lineTo(127.2, 160.8);
    ctx4.lineTo(142.0, 139.2);
    ctx4.lineTo(128.8, 139.2);
    ctx4.lineTo(128.8, 135.8);
    ctx4.lineTo(146.1, 135.8);
    ctx4.lineTo(146.1, 139.7);
    ctx4.lineTo(131.5, 160.6);
    ctx4.lineTo(146.9, 160.6);
    ctx4.lineTo(146.9, 164.2);
    ctx4.lineTo(127.2, 164.2);

    //A
    var ctx5 = new THREE.Shape();
    ctx5.moveTo(177.7, 150.0);
    ctx5.bezierCurveTo(177.7, 141.7, 170.9, 135.0, 162.6, 135.0);
    ctx5.bezierCurveTo(154.3, 135.0, 147.6, 141.7, 147.6, 150.0);
    ctx5.bezierCurveTo(147.6, 158.3, 154.3, 165.0, 162.6, 165.0);
    ctx5.bezierCurveTo(167.2, 165.0, 171.2, 163.0, 174.0, 159.8);
    ctx5.lineTo(174.0, 164.2);
    ctx5.lineTo(177.7, 164.2);
//    ctx5.lineTo(177.7, 150.0);
    ctx5.lineTo(177.7, 150.0);

    var ctx5Subtract = new THREE.Path();
    ctx5Subtract.moveTo(162.6, 161.3);
    ctx5Subtract.bezierCurveTo(156.4, 161.3, 151.3, 156.2, 151.3, 150.0);
    ctx5Subtract.bezierCurveTo(151.3, 143.8, 156.4, 138.7, 162.6, 138.7);
    ctx5Subtract.bezierCurveTo(168.9, 138.7, 173.9, 143.8, 173.9, 150.0);
    ctx5Subtract.bezierCurveTo(173.9, 156.2, 168.9, 161.3, 162.6, 161.3);
    ctx5.holes.push(ctx5Subtract);

    var ctx6 = new THREE.Shape();
    ctx6.moveTo(202.3, 138.3);
    ctx6.bezierCurveTo(200.2, 136.2, 197.3, 135.1, 193.7, 135.0);
    ctx6.bezierCurveTo(193.7, 135.0, 193.5, 135.0, 193.4, 135.0);
    ctx6.bezierCurveTo(193.4, 135.0, 193.2, 135.0, 193.2, 135.0);
    ctx6.bezierCurveTo(189.6, 135.1, 186.7, 136.2, 184.6, 138.3);
    ctx6.bezierCurveTo(181.5, 141.5, 181.6, 145.7, 181.6, 145.9);
    ctx6.lineTo(181.6, 164.2);
    ctx6.lineTo(185.1, 164.2);
    ctx6.lineTo(185.1, 145.9);
    ctx6.bezierCurveTo(185.1, 145.8, 185.1, 142.8, 187.2, 140.7);
    ctx6.bezierCurveTo(188.6, 139.3, 190.7, 138.5, 193.4, 138.5);
    ctx6.bezierCurveTo(196.2, 138.5, 198.3, 139.3, 199.7, 140.7);
    ctx6.bezierCurveTo(201.8, 142.8, 201.8, 145.8, 201.8, 145.9);
    ctx6.lineTo(201.8, 164.2);
    ctx6.lineTo(205.3, 164.2);
    ctx6.lineTo(205.3, 145.9);
    ctx6.bezierCurveTo(205.3, 145.7, 205.4, 141.5, 202.3, 138.3);

    // I
    var ctx7 = new THREE.Shape();
    ctx7.moveTo(209.2, 135.8);
    ctx7.lineTo(212.9, 135.8);
    ctx7.lineTo(212.9, 164.2);
    ctx7.lineTo(209.2, 164.2);
    ctx7.lineTo(209.2, 135.8);

    // N
    var ctx8 = new THREE.Shape();
    ctx8.moveTo(237.5, 138.3);
    ctx8.bezierCurveTo(235.4, 136.2, 232.5, 135.1, 228.9, 135.0);
    ctx8.bezierCurveTo(228.9, 135.0, 228.7, 135.0, 228.7, 135.0);
    ctx8.bezierCurveTo(228.6, 135.0, 228.4, 135.0, 228.4, 135.0);
    ctx8.bezierCurveTo(224.8, 135.1, 221.9, 136.2, 219.8, 138.3);
    ctx8.bezierCurveTo(216.7, 141.5, 216.8, 145.7, 216.8, 145.9);
    ctx8.lineTo(216.8, 164.2);
    ctx8.lineTo(220.3, 164.2);
    ctx8.lineTo(220.3, 145.9);
    ctx8.bezierCurveTo(220.3, 145.8, 220.3, 142.8, 222.4, 140.7);
    ctx8.bezierCurveTo(223.8, 139.3, 225.9, 138.5, 228.7, 138.5);
    ctx8.bezierCurveTo(231.4, 138.5, 233.5, 139.3, 234.9, 140.7);
    ctx8.bezierCurveTo(237.0, 142.8, 237.0, 145.8, 237.0, 145.9);
    ctx8.lineTo(237.0, 164.2);
    ctx8.lineTo(240.5, 164.2);
    ctx8.lineTo(240.5, 145.9);
    ctx8.bezierCurveTo(240.5, 145.7, 240.6, 141.5, 237.5, 138.3);

    // E
    var ctx9 = new THREE.Shape();
    ctx9.moveTo(248.2, 151.1);
    ctx9.bezierCurveTo(248.7, 157.5, 253.2, 161.5, 259.1, 161.5);
    ctx9.bezierCurveTo(263.3, 161.5, 267.0, 159.3, 268.9, 155.2);
    ctx9.lineTo(273.0, 155.2);
    ctx9.bezierCurveTo(270.4, 161.6, 265.4, 165.0, 259.2, 165.0);
    ctx9.bezierCurveTo(250.7, 165.0, 244.4, 158.0, 244.4, 150.0);
    ctx9.bezierCurveTo(244.4, 141.5, 250.5, 135.0, 259.4, 135.0);
    ctx9.bezierCurveTo(267.8, 135.0, 273.9, 141.3, 273.9, 150.9);
    ctx9.bezierCurveTo(273.9, 151.0, 273.9, 151.0, 273.9, 151.1);
    ctx9.lineTo(248.2, 151.1);

    var ctx9Subtract = new THREE.Path();
    ctx9Subtract.moveTo(258.9, 138.4);
    ctx9Subtract.bezierCurveTo(253.4, 138.4, 249.2, 142.0, 248.3, 148.1);
    ctx9Subtract.lineTo(269.9, 148.1);
    ctx9Subtract.bezierCurveTo(268.5, 141.7, 264.8, 138.4, 258.9, 138.4);

    ctx9.holes.push(ctx9Subtract);

    var ctx10 = new THREE.Shape();
    ctx10.moveTo(91.1, 180.5);
    ctx10.lineTo(92.4, 180.5);
    ctx10.lineTo(95.7, 189.0);
    ctx10.lineTo(99.1, 180.5);
    ctx10.lineTo(100.4, 180.5);
    ctx10.lineTo(100.4, 190.2);
    ctx10.lineTo(99.5, 190.2);
//    ctx10.lineTo(99.5, 181.9);
    ctx10.lineTo(99.5, 181.9);
    ctx10.lineTo(96.2, 190.2);
    ctx10.lineTo(95.3, 190.2);
//    ctx10.lineTo(92.0, 181.9);
    ctx10.lineTo(92.0, 181.9);
    ctx10.lineTo(92.0, 190.2);
    ctx10.lineTo(91.1, 190.2);
    ctx10.lineTo(91.1, 180.5);

    var ctx11 = new THREE.Shape();
    ctx11.moveTo(122.0, 180.5);
    ctx11.lineTo(128.7, 180.5);
    ctx11.lineTo(128.7, 181.3);
    ctx11.lineTo(122.9, 181.3);
    ctx11.lineTo(122.9, 184.8);
    ctx11.lineTo(128.3, 184.8);
    ctx11.lineTo(128.3, 185.6);
    ctx11.lineTo(122.9, 185.6);
    ctx11.lineTo(122.9, 189.4);
    ctx11.lineTo(128.7, 189.4);
    ctx11.lineTo(128.7, 190.2);
    ctx11.lineTo(122.0, 190.2);
    ctx11.lineTo(122.0, 180.5);

    var ctx12 = new THREE.Shape();
    ctx12.moveTo(149.7, 180.5);
    ctx12.lineTo(153.0, 180.5);
    ctx12.bezierCurveTo(155.9, 180.6, 157.5, 182.2, 157.5, 185.4);
    ctx12.bezierCurveTo(157.5, 188.5, 155.9, 190.1, 153.0, 190.2);
    ctx12.lineTo(149.7, 190.2);
    ctx12.lineTo(149.7, 180.5);

    var ctx12Subtract = new THREE.Path();
    ctx12Subtract.moveTo(150.6, 189.4);
    ctx12Subtract.lineTo(152.6, 189.4);
    ctx12Subtract.bezierCurveTo(155.3, 189.4, 156.5, 188.2, 156.5, 185.4);
    ctx12Subtract.bezierCurveTo(156.5, 182.5, 155.3, 181.3, 152.6, 181.3);
    ctx12Subtract.lineTo(150.6, 181.3);
    ctx12Subtract.lineTo(150.6, 189.4);

    ctx12.holes.push(ctx12Subtract);

    var ctx13 = new THREE.Shape();
    ctx13.moveTo(178.7, 180.5);
    ctx13.lineTo(179.6, 180.5);
    ctx13.lineTo(179.6, 190.2);
    ctx13.lineTo(178.7, 190.2);
    ctx13.lineTo(178.7, 180.5);

    var ctx14 = new THREE.Shape();
    ctx14.moveTo(204.1, 180.5);
    ctx14.lineTo(205.2, 180.5);
    ctx14.lineTo(208.9, 190.2);
    ctx14.lineTo(208.0, 190.2);
    ctx14.lineTo(206.8, 187.2);
    ctx14.lineTo(202.4, 187.2);
    ctx14.lineTo(201.2, 190.2);
    ctx14.lineTo(200.3, 190.2);
    ctx14.lineTo(204.1, 180.5);

    var ctx14Subtract = new THREE.Shape();
    ctx14Subtract.moveTo(202.7, 186.4);
    ctx14Subtract.lineTo(206.5, 186.4);
    ctx14Subtract.lineTo(204.6, 181.5);
    ctx14Subtract.lineTo(202.7, 186.4);

    ctx14.holes.push(ctx14Subtract);

    function addShape(shape, extrudeSettings, color, x, y, z, rx, ry, rz, s) {

        var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
            color: color,
            shading: THREE.FlatShading
        }));

        mesh.position.set(x, y, z);
        mesh.rotation.set(rx, ry, rz);
        mesh.scale.set(s, s, s);

        parent.add(mesh);

    }

    function init() {
        scene.add(parent);
        addShape(ctx, extrudeSettings3, 0xadef, -173.45, 66.45, -10, 0, 3.14, 3.14, 1);
        addShape(ctx1, extrudeSettings2, 0xffffff, -173.45, 66.45, 1, 0, 3.14, 3.14, 1);
        addShape(ctx2, extrudeSettings2, 0xffffff, -173.45, 66.45, 1, 0, 3.14, 3.14, 1);
        addShape(ctx3, extrudeSettings2, 0xffffff, -173.45, 66.45, 1, 0, 3.14, 3.14, 1);
        addShape(ctx4, extrudeSettings2, 0xffffff, -173.45, 66.45, 1, 0, 3.14, 3.14, 1);
        addShape(ctx5, extrudeSettings2, 0xffffff, -173.45, 66.45, 1, 0, 3.14, 3.14, 1);
        addShape(ctx6, extrudeSettings2, 0xffffff, -173.45, 66.45, 1, 0, 3.14, 3.14, 1);
        addShape(ctx7, extrudeSettings2, 0xffffff, -173.45, 66.45, 1, 0, 3.14, 3.14, 1);
        addShape(ctx8, extrudeSettings2, 0xffffff, -173.45, 66.45, 1, 0, 3.14, 3.14, 1);
        addShape(ctx9, extrudeSettings2, 0xffffff, -173.45, 66.45, 1, 0, 3.14, 3.14, 1);
        addShape(ctx10, extrudeSettings2, 0x71bb, -173.45, 66.45, 1, 0, 3.14, 3.14, 1);
        addShape(ctx11, extrudeSettings2, 0x71bb, -173.45, 66.45, 1, 0, 3.14, 3.14, 1);
        addShape(ctx12, extrudeSettings2, 0x71bb, -173.45, 66.45, 1, 0, 3.14, 3.14, 1);
        addShape(ctx13, extrudeSettings2, 0x71bb, -173.45, 66.45, 1, 0, 3.14, 3.14, 1);
        addShape(ctx14, extrudeSettings2, 0x71bb, -173.45, 66.45, 1, 0, 3.14, 3.14, 1);

        parent.scale.multiplyScalar(0.05);
    }

    init();
}