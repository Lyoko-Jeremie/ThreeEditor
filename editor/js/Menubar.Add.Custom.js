import * as THREE from 'three';
import { UIRow } from './libs/ui.js';
import { AddObjectCommand } from './commands/AddObjectCommand.js';

export function buttonRectanglePipePanel( editor, strings ) {

	const x = 10;
	const y = 10;

	const createPipe = ( len, rectanglePipePanel ) => {

		const geometry = new THREE.CylinderGeometry(
			rectanglePipePanel.radius,
			rectanglePipePanel.radius,
			len,
			rectanglePipePanel.radialSegments,
			3,
			false,
			0,
			Math.PI * 2,
		);
		const m = new THREE.Mesh( geometry, rectanglePipePanel.material );
		m.name = 'buttonRectanglePipePanel';
		return m;

	};


	const option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/add/template/RectanglePipePanel' ) );
	option.onClick( function () {

		const mesh = new THREE.Group();

		const rectanglePipePanelConfig = {
			radius: 0.5,
			radialSegments: 8,
			material: new THREE.MeshStandardMaterial( { color: '#2194ce' } ),
		};

		const A1 = createPipe( x, rectanglePipePanelConfig );
		A1.position.y = - y / 2;
		const A2 = createPipe( x, rectanglePipePanelConfig );
		A2.position.y = y / 2;
		const B1 = createPipe( y, rectanglePipePanelConfig );
		B1.position.x = - x / 2;
		const B2 = createPipe( y, rectanglePipePanelConfig );
		B2.position.x = x / 2;
		A1.rotateZ( Math.PI / 2 );
		A2.rotateZ( Math.PI / 2 );

		mesh.add( A1, A2, B1, B2 );
		mesh.name = 'buttonRectanglePipePanel';

		editor.execute( new AddObjectCommand( editor, mesh ) );

	} );
	return option;

}


export function buttonRectanglePipe( editor, strings ) {

	const x = 10;
	const y = 10;
	const z = 10;


	const createPipe = ( len, rectanglePipeConfig ) => {

		const geometry = new THREE.CylinderGeometry(
			rectanglePipeConfig.radius,
			rectanglePipeConfig.radius,
			len,
			rectanglePipeConfig.radialSegments,
			1,
			false,
			0,
			Math.PI * 2,
		);
		const m = new THREE.Mesh( geometry, rectanglePipeConfig.material );
		m.name = 'buttonRectanglePipe';
		return m;

	};


	const option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/add/template/RectanglePipe' ) );
	option.onClick( function () {

		const mesh = new THREE.Group();

		const rectanglePipeConfig = {
			x: x,
			y: y,
			z: z,
			radius: 0.5,
			radialSegments: 8,
			material: new THREE.MeshStandardMaterial( { color: '#ff9d9d' } ),
		};

		const A1 = createPipe( rectanglePipeConfig.x, rectanglePipeConfig );
		const A2 = createPipe( rectanglePipeConfig.x, rectanglePipeConfig );
		const A3 = createPipe( rectanglePipeConfig.x, rectanglePipeConfig );
		const A4 = createPipe( rectanglePipeConfig.x, rectanglePipeConfig );
		A1.position.x = - rectanglePipeConfig.x / 2;
		A2.position.x = - rectanglePipeConfig.x / 2;
		A3.position.x = rectanglePipeConfig.x / 2;
		A4.position.x = rectanglePipeConfig.x / 2;
		A1.position.z = - rectanglePipeConfig.z / 2;
		A2.position.z = rectanglePipeConfig.z / 2;
		A3.position.z = - rectanglePipeConfig.z / 2;
		A4.position.z = rectanglePipeConfig.z / 2;
		const B1 = createPipe( rectanglePipeConfig.y, rectanglePipeConfig );
		const B2 = createPipe( rectanglePipeConfig.y, rectanglePipeConfig );
		const B3 = createPipe( rectanglePipeConfig.y, rectanglePipeConfig );
		const B4 = createPipe( rectanglePipeConfig.y, rectanglePipeConfig );
		B1.position.y = - rectanglePipeConfig.y / 2;
		B2.position.y = - rectanglePipeConfig.y / 2;
		B3.position.y = rectanglePipeConfig.y / 2;
		B4.position.y = rectanglePipeConfig.y / 2;
		B1.position.z = - rectanglePipeConfig.z / 2;
		B2.position.z = rectanglePipeConfig.z / 2;
		B3.position.z = - rectanglePipeConfig.z / 2;
		B4.position.z = rectanglePipeConfig.z / 2;
		B1.rotateZ( Math.PI / 2 );
		B2.rotateZ( Math.PI / 2 );
		B3.rotateZ( Math.PI / 2 );
		B4.rotateZ( Math.PI / 2 );
		const C1 = createPipe( rectanglePipeConfig.z, rectanglePipeConfig );
		const C2 = createPipe( rectanglePipeConfig.z, rectanglePipeConfig );
		const C3 = createPipe( rectanglePipeConfig.z, rectanglePipeConfig );
		const C4 = createPipe( rectanglePipeConfig.z, rectanglePipeConfig );
		C1.position.x = - rectanglePipeConfig.x / 2;
		C2.position.x = - rectanglePipeConfig.x / 2;
		C3.position.x = rectanglePipeConfig.x / 2;
		C4.position.x = rectanglePipeConfig.x / 2;
		C1.position.y = - rectanglePipeConfig.y / 2;
		C2.position.y = rectanglePipeConfig.y / 2;
		C3.position.y = - rectanglePipeConfig.y / 2;
		C4.position.y = rectanglePipeConfig.y / 2;
		C1.rotateX( Math.PI / 2 );
		C2.rotateX( Math.PI / 2 );
		C3.rotateX( Math.PI / 2 );
		C4.rotateX( Math.PI / 2 );

		mesh.add(
			A1, A2, A3, A4,
			B1, B2, B3, B4,
			C1, C2, C3, C4,
		);
		mesh.name = 'buttonRectanglePipe';

		editor.execute( new AddObjectCommand( editor, mesh ) );

	} );
	return option;

}


export function buttonTwoCircle( editor, strings ) {

	const i1 = 3;
	const r1 = 4;
	const y1 = i1 + r1;
	const i2 = 2;
	const i2y = i1 + r1 * 2;
	const r2 = 3;
	const y2 = i1 + r1 * 2 + i2 + r2;

	const createPipe = ( len, pipeConf ) => {

		const geometry = new THREE.CylinderGeometry(
			pipeConf.radius,
			pipeConf.radius,
			len,
			pipeConf.radialSegments,
			3,
			false,
			0,
			Math.PI * 2,
		);
		const m = new THREE.Mesh( geometry, pipeConf.material );
		m.name = 'TwoCirclePipe';
		return m;

	};

	const createCircle = ( circleConf ) => {

		const geometry = new THREE.TorusGeometry(
			circleConf.radius,
			circleConf.tube,
			circleConf.radialSegments,
			circleConf.tubularSegments,
			Math.PI * 2,
		);
		const m = new THREE.Mesh( geometry, circleConf.material );
		m.name = 'TwoCircleRing';
		return m;

	};


	const option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/add/template/TwoCircle' ) );
	option.onClick( function () {

		const mesh = new THREE.Group();

		const material = new THREE.MeshStandardMaterial( { color: '#ff80bf' } );

		const pipeConf = {
			radius: 0.2,
			radialSegments: 8,
			material: material,
		};

		const circleConf = {
			radialSegments: 8,
			tube: 0.2,
			tubularSegments: 32,
			material: material,
		};

		const I1 = createPipe( i1, pipeConf );
		I1.position.y = i1 / 2;
		const I2 = createPipe( i2, pipeConf );
		I2.position.y = i2y + i2 / 2;
		const R1 = createCircle( { ...circleConf, radius: r1 } );
		R1.position.y = y1;
		const R2 = createCircle( { ...circleConf, radius: r2 } );
		R2.position.y = y2;

		mesh.add( I1, I2, R1, R2 );
		mesh.name = 'TwoCircle';

		editor.execute( new AddObjectCommand( editor, mesh ) );

	} );
	return option;

}

