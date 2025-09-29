import {ClassicPreset} from 'rete';
import {type SensorOutputCollisionData, SocketLib} from "./SocketLib";
import type {ReteEditorInterface} from "../ReteEditorInterface";
import {nameDialog} from "./NameSwal";
import {NodeParent, type NodeStateFull} from "./NodeParent";
import type {NodeSerializationDataType} from "../ReteSerializationTypeDef";
import {NODE_WIDTH} from "./NodeConstantConfig";

export class NodeLatchCount extends NodeParent implements NodeStateFull {
	static nodeTypeStatic: string = 'NodeLatchCount';
	nodeType: string = 'NodeLatchCount';
	width = NODE_WIDTH;
	height!: number;

	needSkipBuffer = false;

	_labelPrefix: string = '碰撞事件计数器: ';

	constructor(label: string, id?: string) {
		super(label);
		this.labelName = label;
		this.id = id ?? this.id;
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.sensorOutput, '碰撞事件', false));
		this.addOutput('latchCountState', new ClassicPreset.Output(SocketLib.normalLogic, '已碰撞次数', true));
	}

	latchCountState = 0;

	data(inputs: { inputValue?: SensorOutputCollisionData[] }): { latchCountState: number } {
		if (inputs.inputValue) {
			const inputValue = inputs.inputValue[0];
			if (inputValue && inputValue.isStart) {
				this.latchCountState++;
			}
		}
		return {latchCountState: this.latchCountState};
	}

	resetState() {
		this.latchCountState = 0;
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '碰撞事件计数器 名称', (name) => new NodeLatchCount(name));
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

	clone() {
		return new NodeLatchCount(this.labelName);
	}
}

export const NodeMenuLatchCount = (editor: ReteEditorInterface): [string, () => Promise<NodeLatchCount>][] => {
	return [
		["碰撞事件计数器", async () => NodeLatchCount.create(editor)],
	] as const;
};
