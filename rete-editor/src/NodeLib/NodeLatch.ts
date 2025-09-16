import {ClassicPreset} from 'rete';
import {SocketLib} from "./SocketLib";
import type {NeedSkipBuffer} from "./OpInterface";
import type {ReteEditorInterface} from "../ReteEditorInterface";
import {nameDialog} from "./NameSwal";

export class NodeLatch extends ClassicPreset.Node  implements NeedSkipBuffer {
	width = 200;
	height!: number;

	needSkipBuffer = false;

	constructor(label: string) {
		super('碰撞锁存器: ' + label);
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.sensorOutput, '正在碰撞', false));
		this.addOutput('latchState', new ClassicPreset.Output(SocketLib.normal, '状态', true));
	}

	latchState = 0;

	data(inputs: { inputValue?: number[] }): { latchState: number } {
		if (inputs.inputValue) {
			const inputValue = inputs.inputValue[0];
			if (inputValue) {
				this.latchState = inputValue;
			}
		}
		return {latchState: this.latchState};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '碰撞锁存器 名称', (name) => new NodeLatch(name));
	}
}
