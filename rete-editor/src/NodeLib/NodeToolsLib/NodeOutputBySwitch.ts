import {ClassicPreset, getUID} from 'rete';
import {type SensorOutputCollisionData, SocketLib} from "../SocketLib";
import type {ReteEditorInterface} from "../../ReteEditorInterface";
import {callNoDialog} from "../NameSwal";
import {NodeParent, type NodeStateFull} from "../NodeParent";
import type {NodeSerializationDataType} from "../../ReteSerializationTypeDef";
import {NODE_WIDTH} from "../NodeConstantConfig";
import type {Control} from "rete/_types/presets/classic";

export class NodeLatchOutputBySwitch extends NodeParent implements NodeStateFull {
	static nodeTypeStatic: string = 'NodeLatchOutputBySwitch';
	nodeType: string = 'NodeLatchOutputBySwitch';
	width = NODE_WIDTH;
	height!: number;

	needSkipBuffer: true = true;

	_labelPrefix: string = '【碰撞事件过滤锁存器】';

	constructor(label: string, id?: string) {
		super(label);
		this.labelName = label;
		this.id = id ?? this.id;
		this.addInput('inputSuppress', new ClassicPreset.Input(SocketLib.normalLogic, '是否抑制', false));
		this.addInput('inputEvent', new ClassicPreset.Input(SocketLib.sensorOutput, '碰撞事件', false));
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.normalLogic, '是否已碰撞', true));
		this.addControl('messageReadMe', {
			id: getUID(),
			index: -1,
			textSignal: '过滤碰撞事件并锁存',
			isCustomMessageControl: true,
			needBorder: true,
		} as Control);
	}

	latchState = 0;

	data(inputs: { inputSuppress?: number[], inputEvent?: SensorOutputCollisionData[] }): { outputValue: number } {
		if (inputs.inputSuppress && inputs.inputEvent && inputs.inputEvent.length === 1) {
			if (this.latchState === 0) {
				if (!inputs.inputSuppress[0] && inputs.inputEvent[0]!.isStart) {
					this.latchState = 1;
				}
			}
		}
		return {outputValue: this.latchState};
	}

	resetState() {
		this.latchState = 0;
	}

	static async create(editor: ReteEditorInterface) {
		// const n = new NodeLatchOutputBySwitch('');
		// runLater(async () => {
		// 	await editor.updateOneNodeSize(n);
		// 	await editor.updateMinimap();
		// }, 100).catch(e => console.error(e));
		// return n;
		return callNoDialog(editor, () => new NodeLatchOutputBySwitch(''));
		// return nameDialog(editor, '碰撞事件过滤锁存器 名称', (name) => new NodeLatchOutputBySwitch(name));
	}

	serialization(): NodeSerializationDataType {
		return {
			...super.serialization(),
			nodeTypeStatic: NodeLatchOutputBySwitch.nodeTypeStatic,
		};
	}

	static deserialize(data: NodeSerializationDataType): NodeParent {
		if (data.nodeTypeStatic !== NodeLatchOutputBySwitch.nodeTypeStatic) throw new Error("nodeTypeStatic not match");
		return new NodeLatchOutputBySwitch(data.labelName, data.id);
	}

	clone() {
		return new NodeLatchOutputBySwitch(this.labelName);
	}
}

