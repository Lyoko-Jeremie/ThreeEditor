import * as THREE from 'three';
import { UIRow } from './libs/ui.js';
import { AddObjectCommand } from './commands/AddObjectCommand.js';
import { LibModel_Flag } from './Menubar.Add.Model.Lib.js';

function modelLibLoadFactory( keyName, modelData, meshName, color ) {

	return function ( editor, strings ) {

		const option = new UIRow();
		option.setClass( 'option' );
		option.setTextContent( strings.getKey( keyName ) );
		option.onClick( function () {

			const loader = new THREE.ObjectLoader();
			loader.parse( modelData, function ( m ) {

				const mesh = new THREE.Mesh( m.geometry, new THREE.MeshStandardMaterial( { color: color } ) );
				mesh.name = meshName;

				editor.execute( new AddObjectCommand( editor, mesh ) );

				m.clear();

			} );

		} );
		return option;

	};

}

export const bottomModelLibFlag = modelLibLoadFactory( 'menubar/add/model_lib/flag', LibModel_Flag, 'LibModel_Flag', '#2194ce' );
