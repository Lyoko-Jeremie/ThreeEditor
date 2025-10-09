import {ClassicPreset} from 'rete';
import {
	type SensorOutputCollisionData,
	type SensorOutputFlyCollisionData,
	SocketLib
} from "./SocketLib";
import type {ReteEditorInterface} from "../ReteEditorInterface";
import {nameDialog} from "./NameSwal";
import {NodeParent, type NodeStateFull} from "./NodeParent";
import type {NodeSerializationDataType} from "../ReteSerializationTypeDef";
import {NODE_WIDTH} from "./NodeConstantConfig";
import {flatten} from 'lodash';


export class NodeCollisionCatch extends NodeParent implements NodeStateFull {
	static nodeTypeStatic: string = 'NodeCollisionCatch';
	nodeType: string = 'NodeCollisionCatch';
	width = NODE_WIDTH;
	height!: number;

	needSkipBuffer = false;

	_labelPrefix: string = '传感器事件捕获器: ';

	constructor(label: string, id?: string) {
		super(label);
		this.labelName = label;
		this.id = id ?? this.id;
		this.addInput('inputCollision', new ClassicPreset.Input(SocketLib.sensorOutput, '碰撞输入', false));
		this.addOutput('collisionState', new ClassicPreset.Output(SocketLib.normalLogic, '是否正在碰撞', true));
		this.addOutput('isStartEdge', new ClassicPreset.Output(SocketLib.sensorOutput, '正开始碰撞事件', true));
	}

	// +1 when collision start , -1 when collision end
	collisionRefCount = 0;

	data(inputs: { inputCollision?: SensorOutputCollisionData[] }): {
		collisionState: boolean,
		isStartEdge: SensorOutputCollisionData
	} {
		let isStartEdgeData: SensorOutputCollisionData = {id: -1, isStart: false};
		if (inputs.inputCollision) {
			const inputValue = inputs.inputCollision[0];
			if (inputValue && inputValue.id !== -1) {
				if (inputValue.isStart) {
					this.collisionRefCount++;
					isStartEdgeData = inputValue;
				} else if (!inputValue.isStart) {
					this.collisionRefCount = Math.max(0, this.collisionRefCount - 1);
				}
			}
		}
		return {collisionState: this.collisionRefCount !== 0, isStartEdge: isStartEdgeData};
	}

	resetState() {
		this.collisionRefCount = 0;
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '传感器事件捕获器 名称', (name) => new NodeCollisionCatch(name));
	}

	serialization(): NodeSerializationDataType {
		return {
			...super.serialization(),
			nodeTypeStatic: NodeCollisionCatch.nodeTypeStatic,
		};
	}

	static deserialize(data: NodeSerializationDataType): NodeParent {
		if (data.nodeTypeStatic !== NodeCollisionCatch.nodeTypeStatic) throw new Error("nodeTypeStatic not match");
		return new NodeCollisionCatch(data.labelName, data.id);
	}

	clone() {
		return new NodeCollisionCatch(this.labelName);
	}
}


export class NodeCollisionFlyCatch extends NodeParent implements NodeStateFull {
	static nodeTypeStatic: string = 'NodeCollisionFlyCatch';
	nodeType: string = 'NodeCollisionFlyCatch';
	width = NODE_WIDTH;
	height!: number;

	needSkipBuffer = false;

	_labelPrefix: string = '无人机事件捕获器: ';

	constructor(label: string, id?: string) {
		super(label);
		this.labelName = label;
		this.id = id ?? this.id;
		this.addInput('inputCollision', new ClassicPreset.Input(SocketLib.sensorOutputFly, '碰撞输入', false));
		this.addInput('controlFlyValue', new ClassicPreset.Input(SocketLib.flyPort, '无人机端口', false));
		this.addOutput('collisionState', new ClassicPreset.Output(SocketLib.normalLogic, '是否正在碰撞', true));
		this.addOutput('isStartEdge', new ClassicPreset.Output(SocketLib.sensorOutput, '正开始碰撞事件', true));
	}

	// +1 when collision start , -1 when collision end
	collisionRefCount = 0;

	data(inputs: { inputCollision?: SensorOutputFlyCollisionData[], controlFlyValue?: (string | string[])[] }): {
		collisionState: boolean,
		isStartEdge: SensorOutputCollisionData,
	} {
		let isStartEdgeData: SensorOutputCollisionData = {id: -1, isStart: false};
		if (inputs.inputCollision && inputs.controlFlyValue) {
			const inputValue = inputs.inputCollision[0];
			const portValue = flatten(inputs.controlFlyValue)[0];
			if (inputValue && portValue && inputValue.fly === portValue) {
				if (inputValue.isStart) {
					this.collisionRefCount++;
					isStartEdgeData = {
						id: inputValue.id,
						isStart: true,
					};
				} else if (!inputValue.isStart) {
					this.collisionRefCount = Math.max(0, this.collisionRefCount - 1);
				}
			}
		}
		return {collisionState: this.collisionRefCount !== 0, isStartEdge: isStartEdgeData};
	}

	resetState() {
		this.collisionRefCount = 0;
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '无人机事件捕获器 名称', (name) => new NodeCollisionFlyCatch(name));
	}

	serialization(): NodeSerializationDataType {
		return {
			...super.serialization(),
			nodeTypeStatic: NodeCollisionFlyCatch.nodeTypeStatic,
		};
	}

	static deserialize(data: NodeSerializationDataType): NodeParent {
		if (data.nodeTypeStatic !== NodeCollisionFlyCatch.nodeTypeStatic) throw new Error("nodeTypeStatic not match");
		return new NodeCollisionFlyCatch(data.labelName, data.id);
	}

	clone() {
		return new NodeCollisionFlyCatch(this.labelName);
	}
}


export class NodeCollisionCombineCatch extends NodeParent implements NodeStateFull {
	static nodeTypeStatic: string = 'NodeCollisionCombineCatch';
	nodeType: string = 'NodeCollisionCombineCatch';
	width = NODE_WIDTH;
	height!: number;

	needSkipBuffer = false;

	_labelPrefix: string = '联合事件捕获器: ';

	constructor(label: string, id?: string) {
		super(label);
		this.labelName = label;
		this.id = id ?? this.id;
		this.addInput('inputCollision', new ClassicPreset.Input(SocketLib.sensorOutput, '碰撞输入', false));
		this.addInput('inputFlyCollision', new ClassicPreset.Input(SocketLib.sensorOutputFly, '无人机碰撞输入', false));
		this.addInput('controlFlyValue', new ClassicPreset.Input(SocketLib.flyPort, '无人机端口', false));
		this.addOutput('collisionState', new ClassicPreset.Output(SocketLib.normalLogic, '是否正在碰撞', true));
		this.addOutput('isStartEdge', new ClassicPreset.Output(SocketLib.sensorOutput, '正开始碰撞事件', true));
	}

	// +1 when collision start , -1 when collision end
	collisionRefCount = 0;

	data(inputs: {
		inputCollision?: SensorOutputCollisionData[],
		inputFlyCollision?: SensorOutputFlyCollisionData[],
		controlFlyValue?: (string | string[])[]
	}): {
		collisionState: boolean,
		isStartEdge: SensorOutputCollisionData,
	} {
		let isStartEdgeData: SensorOutputCollisionData = {id: -1, isStart: false};
		if (inputs.inputCollision && inputs.controlFlyValue && inputs.inputFlyCollision) {
			const inputValue = inputs.inputCollision[0];
			const inputFlyValue = inputs.inputFlyCollision[0];
			const portValue = flatten(inputs.controlFlyValue)[0];
			if (inputValue && inputFlyValue && portValue && inputFlyValue.fly === portValue && inputValue.id !== -1 && inputFlyValue.id !== -1) {
				if (inputValue.isStart && inputFlyValue.isStart) {
					this.collisionRefCount++;
					isStartEdgeData = inputValue;
				} else if (!inputValue.isStart && !inputFlyValue.isStart) {
					this.collisionRefCount = Math.max(0, this.collisionRefCount - 1);
				}
			}
		}
		return {collisionState: this.collisionRefCount !== 0, isStartEdge: isStartEdgeData};
	}

	resetState() {
		this.collisionRefCount = 0;
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '联合事件捕获器 名称', (name) => new NodeCollisionCombineCatch(name));
	}

	serialization(): NodeSerializationDataType {
		return {
			...super.serialization(),
			nodeTypeStatic: NodeCollisionCombineCatch.nodeTypeStatic,
		};
	}

	static deserialize(data: NodeSerializationDataType): NodeParent {
		if (data.nodeTypeStatic !== NodeCollisionCombineCatch.nodeTypeStatic) throw new Error("nodeTypeStatic not match");
		return new NodeCollisionCombineCatch(data.labelName, data.id);
	}

	clone() {
		return new NodeCollisionCombineCatch(this.labelName);
	}
}


export const NodeMenuCollisionCatch = (editor: ReteEditorInterface): [string, () => Promise<NodeCollisionCatch | NodeCollisionFlyCatch | NodeCollisionCombineCatch>][] => {
	return [
		["传感器事件捕获器", async () => NodeCollisionCatch.create(editor)],
		["无人机事件捕获器", async () => NodeCollisionFlyCatch.create(editor)],
		["联合事件捕获器", async () => NodeCollisionCombineCatch.create(editor)],
	] as const;
};
