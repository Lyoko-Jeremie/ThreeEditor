import {ClassicPreset} from 'rete';
import {SocketLib} from "./SocketLib";
import {NodeParent} from "./NodeParent";

export class NodeSensor extends NodeParent {
	nodeType: string = 'NodeSensor';
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string, id: string) {
		super('碰撞传感器: ' + label);
		this.id = id;
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.sensorOutput, '正在碰撞', true));
	}

	outputValue: 0 | 1 = 0;

	data(): { outputValue: number } {
		return {outputValue: this.outputValue};
	}
}
