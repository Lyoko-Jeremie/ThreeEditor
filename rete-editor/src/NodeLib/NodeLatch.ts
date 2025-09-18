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
		this.addOutput('latchState', new ClassicPreset.Output(SocketLib.normalLogic, '是否已碰撞', true));
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

export class NodeLatchFly extends NodeParent {
	static nodeTypeStatic: string = 'NodeLatchFly';
	nodeType: string = 'NodeLatchFly';
	width = 200;
	height!: number;

	needSkipBuffer = false;

	_labelPrefix: string = '无人机碰撞锁存器: ';

	constructor(label: string, id?: string) {
		super(label);
		this.labelName = label;
		this.id = id ?? this.id;
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.sensorOutput, '碰撞', false));
		this.addInput('inputFlyValue', new ClassicPreset.Input(SocketLib.sensorOutputFly, '无人机', false));
		this.addInput('controlFlyValue', new ClassicPreset.Input(SocketLib.flyPort, '无人机端口', false));
		// this.addControl('controlFlyValue', new ClassicPreset.InputControl('text', {
		// 	change: (v) => {
		// 		this.controlFlyValue = v;
		// 	},
		// 	initial: this.controlFlyValue,
		// }));
		this.addOutput('latchState', new ClassicPreset.Output(SocketLib.normalLogic, '是否已碰撞', true));
	}

	latchState = 0;
	controlFlyValue = '';

	data(inputs: { inputValue?: number[], inputFlyValue?: string[] }): { latchState: number } {
		if (inputs.inputValue && inputs.inputFlyValue && inputs.inputFlyValue.length > 0 && inputs.inputFlyValue[0] === this.controlFlyValue) {
			const inputValue = inputs.inputValue[0];
			if (inputValue) {
				this.latchState = inputValue;
			}
		}
		return {latchState: this.latchState};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '无人机碰撞锁存器 名称', (name) => new NodeLatchFly(name));
	}

	serialization(): NodeSerializationDataType {
		return {
			...super.serialization(),
			nodeTypeStatic: NodeLatchFly.nodeTypeStatic,
		};
	}

	static deserialize(data: NodeSerializationDataType): NodeParent {
		if (data.nodeTypeStatic !== NodeLatchFly.nodeTypeStatic) throw new Error("nodeTypeStatic not match");
		return new NodeLatchFly(data.labelName, data.id);
	}
}

export const NodeMenuLatch = (editor: ReteEditorInterface): [string, () => Promise<NodeLatch>][] => {
	return [
		["碰撞锁存器", async () => NodeLatch.create(editor),],
		["无人机碰撞锁存器", async () => NodeLatchFly.create(editor),],
	] as const;
};
