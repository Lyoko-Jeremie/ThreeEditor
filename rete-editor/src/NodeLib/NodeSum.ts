import {ClassicPreset} from 'rete';
import {SocketLib} from "./SocketLib";
import {nameDialog} from "./NameSwal";
import type {ReteEditorInterface} from "../ReteEditorInterface";
import {NodeParent} from "./NodeParent";
import type {NodeSerializationDataType} from "../ReteSerializationTypeDef";

export class NodeSum extends NodeParent {
	static nodeTypeStatic: string = 'NodeSum';
	nodeType: string = 'NodeSum';
	width = 200;
	height!: number;

	needSkipBuffer = true;

	_labelPrefix: string = '求和计算器: ';

	constructor(label: string, id?: string) {
		super(label);
		this.labelName = label;
		this.id = id ?? this.id;
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.normalLogic, '输入', true));
		this.addOutput('outputSum', new ClassicPreset.Output(SocketLib.normalLogic, '求和', true));
	}

	data(inputs: { inputValue?: number[] }): { outputSum: number } {
		return {outputSum: inputs.inputValue?.reduce((a, b) => a + b, 0) ?? 0};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '求和计算器 名称', (name) => new NodeSum(name));
	}

	serialization(): NodeSerializationDataType {
		return {
			...super.serialization(),
			nodeTypeStatic: NodeSum.nodeTypeStatic,
		};
	}

	static deserialize(data: NodeSerializationDataType): NodeParent {
		if (data.nodeTypeStatic !== NodeSum.nodeTypeStatic) throw new Error("nodeTypeStatic not match");
		return new NodeSum(data.labelName, data.id);
	}
}

export const NodeMenuSum = (editor: ReteEditorInterface): [string, () => Promise<NodeSum>] => {
	return [
		"求和计算器", async () => NodeSum.create(editor),
	] as const;
};
