import {ClassicPreset, getUID} from 'rete';
import {SocketLib} from "./SocketLib";
import type {ReteEditorInterface} from "../ReteEditorInterface";
import {nameDialog} from "./NameSwal";
import {NodeParent} from "./NodeParent";
import type {NodeSerializationDataType} from "../ReteSerializationTypeDef";
import {NODE_WIDTH} from "./NodeConstantConfig";
import type {Control} from "rete/_types/presets/classic";

export class NodeScore extends NodeParent {
	static nodeTypeStatic: string = 'NodeScore';
	nodeType: string = 'NodeScore';
	width = NODE_WIDTH;
	height!: number;

	needSkipBuffer = true;

	_labelPrefix: string = '最终成绩节点: ';

	constructor(label: string, id?: string) {
		super(label);
		this.labelName = label;
		this.id = id ?? this.id;
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.normalLogic, '输入'));
		// this.addOutput('score', new ClassicPreset.Output(SocketLib.score, '成绩'));
		this.addControl('messageReadMe', {
			id: getUID(),
			index: -1,
			textSignal: '最终记录的成绩',
			isCustomMessageControl: true,
			needBorder: true,
		} as Control);
	}

	data(inputs: { inputValue?: number[] }): { score: number } {
		return {score: inputs.inputValue?.[0] ?? 0};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '最终成绩节点 名称', (name) => new NodeScore(name));
	}

	serialization(): NodeSerializationDataType {
		return {
			...super.serialization(),
			nodeTypeStatic: NodeScore.nodeTypeStatic,
		};
	}

	static deserialize(data: NodeSerializationDataType): NodeParent {
		if (data.nodeTypeStatic !== NodeScore.nodeTypeStatic) throw new Error("nodeTypeStatic not match");
		return new NodeScore(data.labelName, data.id);
	}

	static isNodeScore(node: NodeParent): node is NodeScore {
		return !!(node as NodeScore).nodeType && (node as NodeScore).nodeType === NodeScore.nodeTypeStatic;
	}
}

export const NodeMenuScore = (editor: ReteEditorInterface): [string, () => Promise<NodeScore>] => {
	return [
		"最终成绩节点", async () => NodeScore.create(editor),
	] as const;
};
