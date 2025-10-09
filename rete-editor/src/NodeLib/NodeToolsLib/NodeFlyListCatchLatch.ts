import {ClassicPreset} from 'rete';
import {flatten, isEqual} from 'lodash';
import {type SensorOutputFlyCollisionData, SocketLib} from "../SocketLib";
import type {ReteEditorInterface} from "../../ReteEditorInterface";
import {callNoDialog} from "../NameSwal";
import {NodeParent, type NodeStateFull} from "../NodeParent";
import type {NodeSerializationDataType} from "../../ReteSerializationTypeDef";
import {NODE_WIDTH} from "../NodeConstantConfig";

export class NodeFlyListCatchLatch extends NodeParent implements NodeStateFull {
	static nodeTypeStatic: string = 'NodeFlyListCatchLatch';
	nodeType: string = 'NodeFlyListCatchLatch';
	width = NODE_WIDTH;
	height!: number;

	needSkipBuffer = false;

	_labelPrefix: string = '【无人机碰撞匹配器】';

	constructor(label: string, id?: string) {
		super(label);
		this.labelName = label;
		this.id = id ?? this.id;
		this.addInput('inputFlyEvent', new ClassicPreset.Input(SocketLib.sensorOutputFly, '无人机碰撞输入', false));
		this.addInput('flyPortList', new ClassicPreset.Input(SocketLib.flyPort, '无人机端口列表', true));
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.normalLogic, '是否全部碰撞完成', true));
	}

	collisionFly: string[] = [];

	data(inputs: { flyPortList?: (string | string[])[], inputFlyEvent?: SensorOutputFlyCollisionData[] }): {
		outputValue: number,
	} {
		const flyPortList = flatten(inputs.flyPortList ?? []);
		if (flyPortList.length === 0) {
			return {outputValue: 0};
		}
		if (inputs.inputFlyEvent && inputs.inputFlyEvent.length === 1) {
			const event = inputs.inputFlyEvent[0];
			if (event) {
				if (event.isStart && event.id !== -1 && !!event.fly) {
					if (flyPortList.indexOf(event.fly) !== -1 && this.collisionFly.indexOf(event.fly) === -1) {
						this.collisionFly.push(event.fly);
					}
				}
			}
		}
		const isSame = isEqual(flyPortList, this.collisionFly);
		return {outputValue: isSame ? 1 : 0};
	}

	resetState() {
		this.collisionFly = [];
	}

	static async create(editor: ReteEditorInterface) {
		return callNoDialog(editor, () => new NodeFlyListCatchLatch(''));
	}

	serialization(): NodeSerializationDataType {
		return {
			...super.serialization(),
			nodeTypeStatic: NodeFlyListCatchLatch.nodeTypeStatic,
		};
	}

	static deserialize(data: NodeSerializationDataType): NodeParent {
		if (data.nodeTypeStatic !== NodeFlyListCatchLatch.nodeTypeStatic) throw new Error("nodeTypeStatic not match");
		return new NodeFlyListCatchLatch(data.labelName, data.id);
	}

	clone() {
		return new NodeFlyListCatchLatch(this.labelName);
	}
}

