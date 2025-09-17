import {ClassicPreset} from 'rete';
import {SocketLib} from "./SocketLib";
import type {ReteEditorInterface} from "../ReteEditorInterface";
import {nameDialog} from "./NameSwal";
import {NodeParent, type NodeSerializationDataType} from "./NodeParent";

export class NodeLatch extends NodeParent {
	static nodeTypeStatic: string = 'NodeLatch';
	nodeType: string = 'NodeLatch';
	width = 200;
	height!: number;

	needSkipBuffer = false;

	_labelPrefix: string = '碰撞锁存器: ';

	constructor(label: string, id?: string) {
		super(label);
		this.labelName = label;
		this.id = id ?? this.id;
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.sensorOutput, '碰撞', false));
		this.addOutput('latchState', new ClassicPreset.Output(SocketLib.normal, '是否已碰撞', true));
	}

	latchState = 0;

	data(inputs: { inputValue?: number[] }): { latchState: number } {
		if (inputs.inputValue) {
			const inputValue = inputs.inputValue[0];
			if (inputValue) {
				this.latchState = inputValue;
			}
		}
		return {latchState: this.latchState};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '碰撞锁存器 名称', (name) => new NodeLatch(name));
	}

	serialization(): NodeSerializationDataType {
		return {
			...super.serialization(),
			nodeTypeStatic: NodeLatch.nodeTypeStatic,
		};
	}

	static deserialize(data: NodeSerializationDataType): NodeParent {
		if (data.nodeTypeStatic !== NodeLatch.nodeTypeStatic) throw new Error("nodeTypeStatic not match");
		return new NodeLatch(data.labelName, data.id);
	}
}

export const NodeMenuLatch = (editor: ReteEditorInterface): [string, () => Promise<NodeLatch>] => {
	return [
		"碰撞锁存器", async () => NodeLatch.create(editor),
	] as const;
};
