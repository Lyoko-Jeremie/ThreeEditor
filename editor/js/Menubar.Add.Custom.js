import * as THREE from 'three';
import { UIRow } from './libs/ui.js';
import { AddObjectCommand } from './commands/AddObjectCommand.js';

export function bottomRectanglePipePanel( editor, strings ) {

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
		m.name = 'bottomRectanglePipePanel';
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
		mesh.name = 'bottomRectanglePipePanel';

		editor.execute( new AddObjectCommand( editor, mesh ) );

	} );
	return option;

}


export function bottomRectanglePipe( editor, strings ) {

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
		m.name = 'bottomRectanglePipe';
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
		mesh.name = 'bottomRectanglePipe';

		editor.execute( new AddObjectCommand( editor, mesh ) );

	} );
	return option;

}
