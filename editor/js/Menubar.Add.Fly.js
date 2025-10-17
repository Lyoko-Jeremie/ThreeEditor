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

/**
 * @return {{collisionType: string, isFly: boolean, flyPort: string, flyType: string}}
 */
function getUserData() {

	return {
		collisionType: 'simple_or_BoundingBox',
		isFly: true,
		flyPort: 'NoFlyPort',
		flyType: '',
	};

}

export function menuAddFly( templateSubmenu, editor, strings ) {

	const flyModelList = [
		{ title: '无人机 1', file: 'FH0A.glb.json', flyType: 'FH0A', resizeX: 0.01, resizeY: 0.01, resizeZ: 0.01 },
		// { title: '无人机 1', file: 'FH0A.glb.json', flyType: 'Owl01', resizeX: 0.01, resizeY: 0.01, resizeZ: 0.01 },
		// { title: '无人机 1', file: 'FH0A.glb.json', flyType: 'TelloTT', resizeX: 0.01, resizeY: 0.01, resizeZ: 0.01 },
	];

	for ( const f of flyModelList ) {

		( function () {

			templateSubmenu.add( factoryFunc( editor, strings, f.title /*strings.getKey( 'menubar/add/mesh/box' )*/, function () {

				// dialog to input FlyPort
				window.inputDialog( '请输入飞行端口名称', '', 'NoFlyPort' )
					.then( p => {

						if ( typeof p === 'string' && p.length > 0 ) {

							const loader = new THREE.ObjectLoader();
							loader.load( 'fly-model/' + f.file, function ( m ) {

								m.name = f.title;

								m.userData = getUserData();
								m.userData.flyType = f.flyType;
								m.userData.flyPort = p;

								m.scale.set( f.resizeX, f.resizeY, f.resizeZ );

								editor.execute( new AddObjectCommand( editor, m ) );

							} );

						}

					} ).catch( err => console.log( err ) );


			} ) );

		} )();

	}

}

