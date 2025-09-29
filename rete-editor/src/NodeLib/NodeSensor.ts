import {ClassicPreset} from 'rete';
import {type SensorOutputCollisionData, type SensorOutputFlyCollisionData, SocketLib} from "./SocketLib";
import {NodeParent} from "./NodeParent";
import type {NodeSerializationDataType} from "../ReteSerializationTypeDef";
import {NODE_WIDTH} from "./NodeConstantConfig";

export class NodeSensor extends NodeParent {
	static nodeTypeStatic: string = 'NodeSensor';
	nodeType: string = 'NodeSensor';
	width = NODE_WIDTH;
	height!: number;

	needSkipBuffer = true;

	_labelPrefix: string = '碰撞检测器: ';

	constructor(label: string, id: string) {
		super(label);
		this.labelName = label;
		this.id = id;
		this.addOutput('outputCollision', new ClassicPreset.Output(SocketLib.sensorOutput, '碰撞事件', true));
		this.addOutput('outputFlyCollision', new ClassicPreset.Output(SocketLib.sensorOutputFly, '无人机碰撞事件', true));
	}

	// 0 无碰撞， number 碰撞 id
	outputCollision: SensorOutputCollisionData = undefined;
	// 无人机端口字符串 keyName
	outputFlyCollision: SensorOutputFlyCollisionData = undefined;

	data(): { outputCollision: SensorOutputCollisionData; outputFlyCollision: SensorOutputFlyCollisionData } {
		return {outputCollision: this.outputCollision, outputFlyCollision: this.outputFlyCollision};
	}

	// call this when every tick
	cleanCollision() {
		this.outputCollision = undefined;
		this.outputFlyCollision = undefined;
	}

	collisionStart(id: number, flyKeyName: string) {
		const isStart = true;
		this.outputCollision = {
			id: id,
			isStart: isStart,
		};
		this.outputFlyCollision = {
			isStart: isStart,
			id: id,
			fly: flyKeyName,
		};
	}

	collisionEnd(id: number, flyKeyName: string) {
		const isStart = false;
		this.outputCollision = {
			id: id,
			isStart: isStart,
		};
		this.outputFlyCollision = {
			isStart: isStart,
			id: id,
			fly: flyKeyName,
		};
	}

	serialization(): NodeSerializationDataType {
		return {
			...super.serialization(),
			nodeTypeStatic: NodeSensor.nodeTypeStatic,
		};
	}

	static deserialize(data: NodeSerializationDataType): NodeParent {
		if (data.nodeTypeStatic !== NodeSensor.nodeTypeStatic) throw new Error("nodeTypeStatic not match");
		return new NodeSensor(data.labelName, data.id);
	}

	static isNodeSensor(node: NodeParent): node is NodeSensor {
		return !!(node as NodeSensor).nodeType && (node as NodeSensor).nodeType === NodeSensor.nodeTypeStatic;
	}
}
