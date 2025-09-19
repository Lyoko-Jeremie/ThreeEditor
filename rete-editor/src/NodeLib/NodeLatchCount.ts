import {ClassicPreset} from 'rete';
import {SocketLib} from "./SocketLib";
import type {ReteEditorInterface} from "../ReteEditorInterface";
import {nameDialog} from "./NameSwal";
import {NodeParent, type NodeSerializationDataType} from "./NodeParent";
import {NodeLatchFlyCombine} from "./NodeLatch";

export class NodeLatchCount extends NodeParent {
	static nodeTypeStatic: string = 'NodeLatchCount';
	nodeType: string = 'NodeLatchCount';
	width = 200;
	height!: number;

	needSkipBuffer = false;

	_labelPrefix: string = '碰撞计数器: ';

	constructor(label: string, id?: string) {
		super(label);
		this.labelName = label;
		this.id = id ?? this.id;
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.sensorOutput, '碰撞', false));
		this.addOutput('latchCountState', new ClassicPreset.Output(SocketLib.normalLogic, '已碰撞次数', true));
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
		if (data.nodeTypeStatic !== NodeLatchCount.nodeTypeStatic) throw new Error("nodeTypeStatic not match");
		return new NodeLatchCount(data.labelName, data.id);
	}
}

export class NodeLatchCountFly extends NodeParent {
	static nodeTypeStatic: string = 'NodeLatchCountFly';
	nodeType: string = 'NodeLatchCountFly';
	width = 200;
	height!: number;

	needSkipBuffer = false;

	_labelPrefix: string = '无人机碰撞计数器: ';

	constructor(label: string, id?: string) {
		super(label);
		this.labelName = label;
		this.id = id ?? this.id;
		this.addInput('inputFlyValue', new ClassicPreset.Input(SocketLib.sensorOutputFly, '无人机', false));
		this.addInput('controlFlyValue', new ClassicPreset.Input(SocketLib.flyPort, '无人机端口', false));
		this.addOutput('latchCountState', new ClassicPreset.Output(SocketLib.normalLogic, '已碰撞次数', true));
	}

	latchCountState = 0;
	controlFlyValue = '';

	data(inputs: { inputFlyValue?: string[] }): { latchCountState: number } {
		if (inputs.inputFlyValue && inputs.inputFlyValue.length > 0 && inputs.inputFlyValue[0] === this.controlFlyValue) {
			this.latchCountState++;
		}
		return {latchCountState: this.latchCountState};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '无人机碰撞计数器 名称', (name) => new NodeLatchCountFly(name));
	}

	serialization(): NodeSerializationDataType {
		return {
			...super.serialization(),
			nodeTypeStatic: NodeLatchCountFly.nodeTypeStatic,
		};
	}

	static deserialize(data: NodeSerializationDataType): NodeParent {
		if (data.nodeTypeStatic !== NodeLatchCountFly.nodeTypeStatic) throw new Error("nodeTypeStatic not match");
		return new NodeLatchCountFly(data.labelName, data.id);
	}
}

export class NodeLatchCountFlyCombine extends NodeParent {
	static nodeTypeStatic: string = 'NodeLatchCountFlyCombine';
	nodeType: string = 'NodeLatchCountFlyCombine';
	width = 200;
	height!: number;

	needSkipBuffer = false;

	_labelPrefix: string = '无人机碰撞联合计数器: ';

	constructor(label: string, id?: string) {
		super(label);
		this.labelName = label;
		this.id = id ?? this.id;
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.sensorOutput, '碰撞', false));
		this.addInput('inputFlyValue', new ClassicPreset.Input(SocketLib.sensorOutputFly, '无人机', false));
		this.addInput('controlFlyValue', new ClassicPreset.Input(SocketLib.flyPort, '无人机端口', false));
		this.addOutput('latchCountState', new ClassicPreset.Output(SocketLib.normalLogic, '已碰撞次数', true));
	}

	latchCountState = 0;
	controlFlyValue = '';

	data(inputs: { inputValue?: number[], inputFlyValue?: string[] }): { latchCountState: number } {
		if (inputs.inputValue && inputs.inputFlyValue && inputs.inputFlyValue.length > 0 && inputs.inputFlyValue[0] === this.controlFlyValue) {
			const inputValue = inputs.inputValue[0];
			if (inputValue) {
				this.latchCountState++;
			}
		}
		return {latchCountState: this.latchCountState};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '无人机碰撞联合计数器 名称', (name) => new NodeLatchCountFly(name));
	}

	serialization(): NodeSerializationDataType {
		return {
			...super.serialization(),
			nodeTypeStatic: NodeLatchCountFly.nodeTypeStatic,
		};
	}

	static deserialize(data: NodeSerializationDataType): NodeParent {
		if (data.nodeTypeStatic !== NodeLatchCountFly.nodeTypeStatic) throw new Error("nodeTypeStatic not match");
		return new NodeLatchCountFly(data.labelName, data.id);
	}
}

export const NodeMenuLatchCount = (editor: ReteEditorInterface): [string, () => Promise<NodeLatchCount | NodeLatchCountFly | NodeLatchCountFlyCombine>][] => {
	return [
		["碰撞计数器", async () => NodeLatchCount.create(editor)],
		["无人机碰撞计数器", async () => NodeLatchCountFly.create(editor)],
		["无人机碰撞联合计数器", async () => NodeLatchCountFlyCombine.create(editor)],
	] as const;
};
