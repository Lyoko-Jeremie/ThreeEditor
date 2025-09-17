import {ClassicPreset} from 'rete';
import {SocketLib} from "./SocketLib";
import {NodeParent, type NodeSerializationDataType} from "./NodeParent";

export class NodeSensor extends NodeParent {
	static nodeTypeStatic: string = 'NodeSensor';
	nodeType: string = 'NodeSensor';
	width = 200;
	height!: number;

	needSkipBuffer = true;

	_labelName: string;

	constructor(label: string, id: string) {
		super('碰撞传感器: ' + label);
		this._labelName = label;
		this.id = id;
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.sensorOutput, '正在碰撞', true));
	}

	set labelName(labelName: string) {
		this._labelName = labelName;
		this.label = '碰撞传感器: ' + labelName;
	}

	get labelName() {
		return this._labelName;
	}

	outputValue: 0 | 1 = 0;

	data(): { outputValue: number } {
		return {outputValue: this.outputValue};
	}

	serialization(): NodeSerializationDataType {
		return {
			...super.serialization(),
			nodeTypeStatic: NodeSensor.nodeTypeStatic,
		};
	}

	static deserialize(data: NodeSerializationDataType): NodeParent {
		if (data.nodeTypeStatic !== this.nodeTypeStatic) throw new Error("nodeTypeStatic not match");
		return new NodeSensor(data.label, data.id);
	}

	static isNodeSensor(node: NodeParent): node is NodeSensor {
		return !!(node as NodeSensor).nodeType && (node as NodeSensor).nodeType === NodeSensor.nodeTypeStatic;
	}
}
