import {ClassicPreset} from 'rete';
import {SocketLib} from "./SocketLib";
import {nameDialog} from "./NameSwal";
import type {ReteEditorInterface} from "../ReteEditorInterface";
import {NodeParent} from "./NodeParent";

export class NodeSum extends NodeParent {
	nodeType: string = 'NodeSum';
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string, id?: string) {
		super('求和计算器: ' + label);
		this.id = id ?? this.id;
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.normal, '输入', true));
		this.addOutput('outputSum', new ClassicPreset.Output(SocketLib.normal, '求和', true));
	}

	data(inputs: { inputValue?: number[] }): { outputSum: number } {
		return {outputSum: inputs.inputValue?.reduce((a, b) => a + b, 0) ?? 0};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '求和计算器 名称', (name) => new NodeSum(name));
	}

	serialization(): Record<string, any> {
		return super.serialization();
	}
}

export const NodeMenuSum = (editor: ReteEditorInterface): [string, () => Promise<NodeSum>] => {
	return [
		"求和计算器", async () => NodeSum.create(editor),
	] as const;
};
