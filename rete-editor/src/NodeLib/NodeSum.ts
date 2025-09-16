import {ClassicPreset} from 'rete';
import {SocketLib} from "./SocketLib";
import type {NeedSkipBuffer} from "./OpInterface";
import {nameDialog} from "./NameSwal";
import type {ReteEditorInterface} from "../ReteEditorInterface";

export class NodeSum extends ClassicPreset.Node implements NeedSkipBuffer {
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string) {
		super('求和计算器: ' + label);
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.normal, '输入', true));
		this.addOutput('outputSum', new ClassicPreset.Output(SocketLib.normal, '求和', true));
	}

	data(inputs: { inputValue?: number[] }): { outputSum: number } {
		return {outputSum: inputs.inputValue?.reduce((a, b) => a + b, 0) ?? 0};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '求和计算器 名称', (name) => new NodeSum(name));
	}
}

export const NodeMenuSum = (editor: ReteEditorInterface): [string, () => Promise<NodeSum>] => {
	return [
		"求和计算器", async () => NodeSum.create(editor),
	] as const;
};
