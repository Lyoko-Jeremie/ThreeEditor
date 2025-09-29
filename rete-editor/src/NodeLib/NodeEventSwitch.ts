import {ClassicPreset} from 'rete';
import {type SensorOutputCollisionData, SocketLib} from "./SocketLib";
import type {ReteEditorInterface} from "../ReteEditorInterface";
import {nameDialog} from "./NameSwal";
import {NodeParent} from "./NodeParent";
import type {NodeSerializationDataType} from "../ReteSerializationTypeDef";

export class NodeEventSuppressor extends NodeParent {
	static nodeTypeStatic: string = 'NodeEventSuppressor';
	nodeType: string = 'NodeEventSuppressor';
	width = 200;
	height!: number;

	needSkipBuffer = false;

	_labelPrefix: string = '碰撞事件抑制器: ';

	constructor(label: string, id?: string) {
		super(label);
		this.labelName = label;
		this.id = id ?? this.id;
		this.addInput('inputSuppress', new ClassicPreset.Input(SocketLib.normalLogic, '是否抑制', false));
		this.addInput('inputEvent', new ClassicPreset.Input(SocketLib.sensorOutput, '碰撞事件', false));
		this.addOutput('outputEvent', new ClassicPreset.Output(SocketLib.sensorOutput, '碰撞事件', true));
	}

	data(inputs: { inputSuppress?: number[], inputEvent?: SensorOutputCollisionData[] }): {
		outputEvent: SensorOutputCollisionData
	} {
		if (inputs.inputSuppress && inputs.inputEvent && inputs.inputEvent.length === 1) {
			if (!!inputs.inputSuppress[0]) {
				return {outputEvent: inputs.inputEvent[0]!};
			}
		}
		return {
			outputEvent: {
				id: -1,
				isStart: false,
			} satisfies SensorOutputCollisionData,
		};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '碰撞事件抑制器 名称', (name) => new NodeEventSuppressor(name));
	}

	serialization(): NodeSerializationDataType {
		return {
			...super.serialization(),
			nodeTypeStatic: NodeEventSuppressor.nodeTypeStatic,
		};
	}

	static deserialize(data: NodeSerializationDataType): NodeParent {
		if (data.nodeTypeStatic !== NodeEventSuppressor.nodeTypeStatic) throw new Error("nodeTypeStatic not match");
		return new NodeEventSuppressor(data.labelName, data.id);
	}
}

export const NodeMenuEventSuppressor = (editor: ReteEditorInterface): [string, () => Promise<NodeEventSuppressor>][] => {
	return [
		["碰撞事件抑制器", async () => NodeEventSuppressor.create(editor),],
	] as const;
};
