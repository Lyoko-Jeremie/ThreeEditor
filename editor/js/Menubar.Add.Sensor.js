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

function getMaterial() {

	const material = new THREE.MeshStandardMaterial();
	// material.wireframe = true;
	material.transparent = true;
	material.opacity = 0.2;
	return material;

}

function getUserData() {

	return {
		// TODO
	};

}

export function menuAddSensorSimple( templateSubmenu, editor, strings ) {

	// Mesh / Box
	templateSubmenu.add( factoryFunc( editor, strings, strings.getKey( 'menubar/add/mesh/box' ), function () {

		const geometry = new THREE.BoxGeometry( 1, 1, 1, 1, 1, 1 );
		const mesh = new THREE.Mesh( geometry, getMaterial() );
		mesh.name = 'Box';

		mesh.userData = getUserData();

		editor.execute( new AddObjectCommand( editor, mesh ) );

	} ) );

	// Mesh / Sphere
	templateSubmenu.add( factoryFunc( editor, strings, strings.getKey( 'menubar/add/mesh/sphere' ), function () {

		const geometry = new THREE.SphereGeometry( 1, 32, 16, 0, Math.PI * 2, 0, Math.PI );
		const mesh = new THREE.Mesh( geometry, getMaterial() );
		mesh.name = 'Sphere';

		mesh.userData = getUserData();

		editor.execute( new AddObjectCommand( editor, mesh ) );

	} ) );

	// Mesh / Sphere
	templateSubmenu.add( factoryFunc( editor, strings, strings.getKey( 'menubar/add/mesh/sphere' ), function () {


		const geometry = new THREE.CylinderGeometry( 1, 1, 1, 32, 1, false, 0, Math.PI * 2 );
		const mesh = new THREE.Mesh( geometry, getMaterial() );
		mesh.name = 'Cylinder';

		mesh.userData = getUserData();

		editor.execute( new AddObjectCommand( editor, mesh ) );

	} ) );

}

