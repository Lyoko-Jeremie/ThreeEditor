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


export function menuAddSensorLib( templateSubmenu, editor, strings ) {

}

