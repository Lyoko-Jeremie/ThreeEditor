import {ClassicPreset} from 'rete';
import {SocketLib} from "./SocketLib";
import {NodeParent, type NodeSerializationDataType} from "./NodeParent";

export class NodeSensor extends NodeParent {
	static nodeTypeStatic: string = 'NodeSensor';
	nodeType: string = 'NodeSensor';
	width = 200;
	height!: number;

	needSkipBuffer = true;

	_labelPrefix: string = '碰撞传感器: ';

	constructor(label: string, id: string) {
		super(label);
		this.labelName = label;
		this.id = id;
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.sensorOutput, '正在碰撞中', true));
		this.addOutput('outputFlyValue', new ClassicPreset.Output(SocketLib.sensorOutputFly, '无人机 keyName', true));
	}

	outputValue: 0 | 1 = 0;
	outputFlyValue: string = '';

	data(): { outputValue: 0 | 1; outputFlyValue: string } {
		return {outputValue: this.outputValue,  outputFlyValue: this.outputFlyValue};
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
