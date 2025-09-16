import {ClassicPreset} from 'rete';
import {SocketLib} from "./SocketLib";
import type {NeedSkipBuffer} from "./OpInterface";

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
}

