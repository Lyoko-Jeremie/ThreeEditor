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
			material: new THREE.MeshStandardMaterial( { color: 0x2194ce } ),
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
