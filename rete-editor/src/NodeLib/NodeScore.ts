import {ClassicPreset} from 'rete';
import {SocketLib} from "./SocketLib";
import type {NeedSkipBuffer} from "./OpInterface";
import type {ReteEditorInterface} from "../ReteEditorInterface";
import {nameDialog} from "./NameSwal";

export class NodeScore extends ClassicPreset.Node implements NeedSkipBuffer {
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string) {
		super('求和计算器: ' + label);
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.normal, '输入'));
		this.addOutput('score', new ClassicPreset.Output(SocketLib.score, '成绩'));
	}

	data(inputs: { inputValue?: number[] }): { score: number } {
		return {score: inputs.inputValue?.[0] ?? 0};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '成绩计算器 名称', (name) => new NodeScore(name));
	}
}

