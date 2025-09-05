import * as THREE from 'three';
import { UIRow } from './libs/ui.js';
import { AddObjectCommand } from './commands/AddObjectCommand.js';
import {
	LibModel_Area,
	LibModel_BigRing,
	LibModel_CrossRing,
	LibModel_Flag,
	LibModel_HollowCylinder, LibModel_Rect, LibModel_SmallRing
} from './Menubar.Add.Model.Lib.js';

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

export const bottomModelLibFlag = modelLibLoadFactory( 'menubar/add/model_lib/Flag', LibModel_Flag, 'LibModel_Flag', '#2194ce' );
export const bottomModelLibHollowCylinder = modelLibLoadFactory( 'menubar/add/model_lib/HollowCylinder', LibModel_HollowCylinder, 'LibModel_HollowCylinder', '#2194ce' );
export const bottomModelLibBigRing = modelLibLoadFactory( 'menubar/add/model_lib/BigRing', LibModel_BigRing, 'LibModel_BigRing', '#2194ce' );
export const bottomModelLibCrossRing = modelLibLoadFactory( 'menubar/add/model_lib/CrossRing', LibModel_CrossRing, 'LibModel_CrossRing', '#2194ce' );
export const bottomModelLibSmallRing = modelLibLoadFactory( 'menubar/add/model_lib/SmallRing', LibModel_SmallRing, 'LibModel_SmallRing', '#2194ce' );
export const bottomModelLibRect = modelLibLoadFactory( 'menubar/add/model_lib/Rect', LibModel_Rect, 'LibModel_Rect', '#2194ce' );
export const bottomModelLibArea = modelLibLoadFactory( 'menubar/add/model_lib/Area', LibModel_Area, 'LibModel_Area', '#2194ce' );
