import {NodeParent} from "./NodeParent";
import {ClassicPreset} from "rete";
import {type SensorOutputCollisionData, type SensorOutputFlyCollisionData, SocketLib} from "./SocketLib";
import type {ReteEditorInterface} from "../ReteEditorInterface";
import {nameDialog} from "./NameSwal";
import type {NodeSerializationDataType} from "../ReteSerializationTypeDef";

export class NodeFlyToSensor extends NodeParent {
	static nodeTypeStatic: string = 'NodeFlyToSensor';
	nodeType: string = 'NodeFlyToSensor';
	width = 200;
	height!: number;

	needSkipBuffer = true;

	_labelPrefix: string = '无人机转传感器事件: ';

	constructor(label: string, id?: string) {
		super(label);
		this.labelName = label;
		this.id = id ?? this.id;
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.sensorOutputFly, '输入无人机事件', false));
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.sensorOutput, '输出传感器事件', true));
	}

	data(inputs: { inputValue?: SensorOutputFlyCollisionData[] }): { outputValue: SensorOutputCollisionData } {
		if (!inputs.inputValue || inputs.inputValue.length === 0) {
			return {
				outputValue: {
					id: -1,
					isStart: false,
				} satisfies SensorOutputCollisionData,
			}
		}
		const v = inputs.inputValue[0]!;
		return {
			outputValue: {
				id: v.id,
				isStart: v.isStart,
			} satisfies SensorOutputCollisionData,
		};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '无人机事件到传感器事件转换器 名称', (name) => new NodeFlyToSensor(name));
	}

	serialization(): NodeSerializationDataType {
		return {
			...super.serialization(),
			nodeTypeStatic: NodeFlyToSensor.nodeTypeStatic,
		};
	}

	static deserialize(data: NodeSerializationDataType): NodeParent {
		if (data.nodeTypeStatic !== NodeFlyToSensor.nodeTypeStatic) throw new Error("nodeTypeStatic not match");
		return new NodeFlyToSensor(data.labelName, data.id);
	}
}

export const NodeMenuFlyToSensor = (editor: ReteEditorInterface): [string, () => Promise<NodeFlyToSensor>][] => {
	return [
		["无人机转事件", async () => NodeFlyToSensor.create(editor),],
	] as const;
};
