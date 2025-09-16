import {ClassicPreset} from 'rete';
import {SocketLib} from "./SocketLib";
import type {ReteEditorInterface} from "../ReteEditorInterface";
import {nameDialog} from "./NameSwal";
import {NodeParent, type SerializationDataType} from "./NodeParent";

export class NodeScore extends NodeParent {
	static nodeType: string = 'NodeScore';
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string, id?: string) {
		super('最终成绩节点: ' + label);
		this.id = id ?? this.id;
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.normal, '输入'));
		this.addOutput('score', new ClassicPreset.Output(SocketLib.score, '成绩'));
	}

	data(inputs: { inputValue?: number[] }): { score: number } {
		return {score: inputs.inputValue?.[0] ?? 0};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '最终成绩节点 名称', (name) => new NodeScore(name));
	}

	serialization(): SerializationDataType {
		return {
			...super.serialization(),
			nodeType: NodeScore.nodeType,
		};
	}

	static deserialize(data: SerializationDataType): NodeParent {
		if (data.nodeType !== this.nodeType) throw new Error("nodeType not match");
		return new NodeScore(data.label, data.id);
	}
}

export const NodeMenuScore = (editor: ReteEditorInterface): [string, () => Promise<NodeScore>] => {
	return [
		"最终成绩节点", async () => NodeScore.create(editor),
	] as const;
};
