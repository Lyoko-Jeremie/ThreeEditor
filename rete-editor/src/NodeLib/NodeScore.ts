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
		super('最终成绩节点: ' + label);
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.normal, '输入'));
		this.addOutput('score', new ClassicPreset.Output(SocketLib.score, '成绩'));
	}

	data(inputs: { inputValue?: number[] }): { score: number } {
		return {score: inputs.inputValue?.[0] ?? 0};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '最终成绩节点 名称', (name) => new NodeScore(name));
	}
}

export const NodeMenuScore = (editor: ReteEditorInterface): [string, () => Promise<NodeScore>] => {
	return [
		"最终成绩节点", async () => NodeScore.create(editor),
	] as const;
};
