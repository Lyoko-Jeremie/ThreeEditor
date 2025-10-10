import * as THREE from 'three';
import { UIRow } from './libs/ui.js';
import { AddObjectCommand } from './commands/AddObjectCommand.js';

function factoryFunc( editor, strings, textContent, onClick ) {

	const option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( textContent );
	option.onClick( onClick );

	return option;

}

function getUserData() {

	return {
		collisionType: 'simple_or_BoundingBox',
		isFly: true,
	};

}

export function menuAddFly( templateSubmenu, editor, strings ) {

	const flyModelList = [
		{ title: '无人机 1', file: 'FH0A.glb.json', resizeX: 0.006, resizeY: 0.006, resizeZ: 0.006 },
	];

	for ( const f of flyModelList ) {

		( function () {

			templateSubmenu.add( factoryFunc( editor, strings, f.title /*strings.getKey( 'menubar/add/mesh/box' )*/, function () {

				const loader = new THREE.ObjectLoader();
				loader.load( 'fly-model/' + f.file, function ( m ) {

					m.name = f.title;

					m.userData = getUserData();
					m.scale.set( f.resizeX, f.resizeY, f.resizeZ );

					editor.execute( new AddObjectCommand( editor, m ) );

				} );

			} ) );

		} )();

	}

}

