import {ClassicPreset} from 'rete';
import {SocketLib} from "./SocketLib";
import type {ReteEditorInterface} from "../ReteEditorInterface";
import {nameDialog} from "./NameSwal";
import {NodeParent, type NodeSerializationDataType} from "./NodeParent";

export class NodeLatchCount extends NodeParent {
	static nodeTypeStatic: string = 'NodeLatchCount';
	nodeType: string = 'NodeLatchCount';
	width = 200;
	height!: number;

	needSkipBuffer = false;

	constructor(label: string, id?: string) {
		super('碰撞计数器: ' + label);
		this.id = id ?? this.id;
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.sensorOutput, '正在碰撞', false));
		this.addOutput('latchCountState', new ClassicPreset.Output(SocketLib.normal, '状态', true));
	}

	latchCountState = 0;

	data(inputs: { inputValue?: number[] }): { latchCountState: number } {
		if (inputs.inputValue) {
			const inputValue = inputs.inputValue[0];
			if (inputValue) {
				this.latchCountState++;
			}
		}
		return {latchCountState: this.latchCountState};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '碰撞计数器 名称', (name) => new NodeLatchCount(name));
	}

	serialization(): NodeSerializationDataType {
		return {
			...super.serialization(),
			nodeTypeStatic: NodeLatchCount.nodeTypeStatic,
		};
	}

	static deserialize(data: NodeSerializationDataType): NodeParent {
		if (data.nodeTypeStatic !== this.nodeTypeStatic) throw new Error("nodeTypeStatic not match");
		return new NodeLatchCount(data.label, data.id);
	}
}

export const NodeMenuLatchCount = (editor: ReteEditorInterface): [string, () => Promise<NodeLatchCount>] => {
	return [
		"碰撞计数器", async () => NodeLatchCount.create(editor),
	] as const;
};
