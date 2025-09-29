import {ClassicPreset} from 'rete';
import {type SensorOutputCollisionData, SocketLib} from "./SocketLib";
import type {ReteEditorInterface} from "../ReteEditorInterface";
import {nameDialog} from "./NameSwal";
import {NodeParent, type NodeStateFull} from "./NodeParent";
import type {NodeSerializationDataType} from "../ReteSerializationTypeDef";

export class NodeLatch extends NodeParent implements NodeStateFull {
	static nodeTypeStatic: string = 'NodeLatch';
	nodeType: string = 'NodeLatch';
	width = 200;
	height!: number;

	needSkipBuffer = false;

	_labelPrefix: string = '碰撞事件锁存器: ';

	constructor(label: string, id?: string) {
		super(label);
		this.labelName = label;
		this.id = id ?? this.id;
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.sensorOutput, '碰撞事件输入', false));
		this.addOutput('latchState', new ClassicPreset.Output(SocketLib.normalLogic, '逻辑输出', true));
	}

	latchState = 0;

	data(inputs: { inputValue?: SensorOutputCollisionData[] }): { latchState: number } {
		if (inputs.inputValue) {
			const inputValue = inputs.inputValue[0];
			if (inputValue && inputValue.isStart && this.latchState === 0) {
				this.latchState = 1;
			}
		}
		return {latchState: this.latchState};
	}

	resetState() {
		this.latchState = 0;
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '碰撞事件锁存器 名称', (name) => new NodeLatch(name));
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

	clone() {
		return new NodeLatch(this.labelName);
	}
}

export const NodeMenuLatch = (editor: ReteEditorInterface): [string, () => Promise<NodeLatch>][] => {
	return [
		["碰撞事件锁存器", async () => NodeLatch.create(editor),],
	] as const;
};
