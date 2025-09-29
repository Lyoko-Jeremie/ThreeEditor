import {ClassicPreset} from 'rete';
import {SocketLib} from "./SocketLib";
import type {ReteEditorInterface} from "../ReteEditorInterface";
import {nameDialog} from "./NameSwal";
import {NodeParent, type NodeStateFull} from "./NodeParent";
import type {NodeSerializationDataType} from "../ReteSerializationTypeDef";

export class NodeEndCheck extends NodeParent implements NodeStateFull {
	static nodeTypeStatic: string = 'NodeEndCheck';
	nodeType: string = 'NodeEndCheck';
	width = 200;
	height!: number;

	needSkipBuffer = true;

	_labelPrefix: string = '成绩完成检测节点: ';

	constructor(label: string, id?: string) {
		super(label);
		this.labelName = label;
		this.id = id ?? this.id;
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.normalLogic, '逻辑计数输入', false));
		this.addInput('inputCompleteRequestValue', new ClassicPreset.Input(SocketLib.normalLogic, '完成所需的计数常量', false));
		this.addOutput('isComplete', new ClassicPreset.Output(SocketLib.score, '是否完成', false));
	}

	isComplete: 0 | 1 = 0;

	data(inputs: { inputValue?: number[], inputCompleteRequestValue?: number[] }): { isComplete: 0 | 1 } {
		if (!inputs.inputValue || inputs.inputValue.length !== 1) {
			return {isComplete: this.isComplete};
		}
		if (!inputs.inputCompleteRequestValue || inputs.inputCompleteRequestValue.length !== 1) {
			return {isComplete: this.isComplete};
		}
		const inputValue = inputs.inputValue[0];
		const inputCompleteRequestValue = inputs.inputCompleteRequestValue[0];
		if (this.isComplete === 0 && inputValue === inputCompleteRequestValue) {
			this.isComplete = 1;
		}
		return {isComplete: this.isComplete};
	}

	resetState() {
		this.isComplete = 0;
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '成绩完成检测节点 名称', (name) => new NodeEndCheck(name));
	}

	serialization(): NodeSerializationDataType {
		return {
			...super.serialization(),
			nodeTypeStatic: NodeEndCheck.nodeTypeStatic,
		};
	}

	static deserialize(data: NodeSerializationDataType): NodeParent {
		if (data.nodeTypeStatic !== NodeEndCheck.nodeTypeStatic) throw new Error("nodeTypeStatic not match");
		return new NodeEndCheck(data.labelName, data.id);
	}

	static isNodeEndCheck(node: NodeParent): node is NodeEndCheck {
		return !!(node as NodeEndCheck).nodeType && (node as NodeEndCheck).nodeType === NodeEndCheck.nodeTypeStatic;
	}
}

export const NodeMenuEndCheck = (editor: ReteEditorInterface): [string, () => Promise<NodeEndCheck>] => {
	return [
		"成绩完成检测节点", async () => NodeEndCheck.create(editor),
	] as const;
};

