import {ClassicPreset, getUID} from 'rete';
import {SocketLib} from "./SocketLib";
import {NodeParent} from "./NodeParent";
import type {Control} from "rete/_types/presets/classic";
import type {ReteEditorInterface} from "../ReteEditorInterface";
import {nameDialog} from "./NameSwal";
import type {NodeSerializationDataType} from "../ReteSerializationTypeDef";
import {NODE_WIDTH} from "./NodeConstantConfig";
import {signal} from '../CustomTemplateSignal';

export type NodeFlyPortInnerData = {
	inputFlyConstValue?: string,
};

export class NodeFlyPort extends NodeParent {
	static nodeTypeStatic: string = 'NodeFlyPort';
	nodeType: string = 'NodeFlyPort';
	width = NODE_WIDTH;
	height!: number;

	styles() {
		return `input { color: black; }`;
	}

	needSkipBuffer = true;

	_labelPrefix: string = '无人机端口节点: ';

	constructor(label: string, id?: string, innerData?: NodeFlyPortInnerData) {
		super(label);
		this.labelName = label;
		this.id = id ?? this.id;
		this.inputFlyConstValue = innerData?.inputFlyConstValue ?? '';
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.flyPort, '无人机端口', true));
		// this.addControl('inputValue', new ClassicPreset.InputControl('number', {
		// 	initial: 0,
		// 	change: (v) => (this.inputValue = v)
		// }));
		this.addControl('inputFlyConstValue', {
			id: getUID(),
			index: 0,
			initial: this.inputFlyConstValue,
			change: (v: string) => {
				this.inputFlyConstValue = v;
				console.log('NodeFlyPort change', v);
			},
			isCustomTextInput: true,
			readonly: false,
		} as Control);
		this.addControl('messageReadMe', {
			id: getUID(),
			index: -1,
			textSignal: signal('无人机端口：'),
			isCustomMessageControl: true,
		} as Control);
	}

	inputFlyConstValue = '';

	data(): { outputValue: string } {
		return {outputValue: this.inputFlyConstValue};
	}

	static isNodeFlyPort(node: NodeParent): node is NodeFlyPort {
		return !!(node as NodeFlyPort).nodeType && (node as NodeFlyPort).nodeType === NodeFlyPort.nodeTypeStatic;
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '无人机端口 名称', (name) => new NodeFlyPort(name));
	}

	serialization(): NodeSerializationDataType<NodeFlyPortInnerData> {
		return {
			...super.serialization(),
			nodeTypeStatic: NodeFlyPort.nodeTypeStatic,
			inputFlyConstValue: this.inputFlyConstValue,
		};
	}

	static deserialize(data: NodeSerializationDataType<NodeFlyPortInnerData>): NodeParent {
		if (data.nodeTypeStatic !== NodeFlyPort.nodeTypeStatic) throw new Error("nodeTypeStatic not match");
		return new NodeFlyPort(data.labelName, data.id, data);
	}

	clone() {
		return new NodeFlyPort(this.labelName, undefined, {inputFlyConstValue: this.inputFlyConstValue});
	}
}

export const NodeMenuFly = (editor: ReteEditorInterface): [string, () => Promise<NodeFlyPort>][] => {
	return [
		["无人机端口", async () => NodeFlyPort.create(editor)],
	] as const;
};

