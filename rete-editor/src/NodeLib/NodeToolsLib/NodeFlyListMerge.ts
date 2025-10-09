import {ClassicPreset} from 'rete';
import {flatten} from 'lodash';
import {SocketLib} from "../SocketLib";
import type {ReteEditorInterface} from "../../ReteEditorInterface";
import {callNoDialog} from "../NameSwal";
import {NodeParent} from "../NodeParent";
import type {NodeSerializationDataType} from "../../ReteSerializationTypeDef";
import {NODE_WIDTH} from "../NodeConstantConfig";

export class NodeFlyListMerge extends NodeParent {
	static nodeTypeStatic: string = 'NodeFlyListMerge';
	nodeType: string = 'NodeFlyListMerge';
	width = NODE_WIDTH;
	height!: number;

	needSkipBuffer = false;

	_labelPrefix: string = '【无人机端口合并器】';

	constructor(label: string, id?: string) {
		super(label);
		this.labelName = label;
		this.id = id ?? this.id;
		this.addInput('flyPortList', new ClassicPreset.Input(SocketLib.flyPort, '无人机端口列表', true));
		this.addOutput('flyPortGroup', new ClassicPreset.Output(SocketLib.flyPort, '无人机端口组', true));
	}

	data(inputs: { flyPortList?: (string | string[])[] }): { flyPortGroup: string[] } {
		const flyPortList = flatten(inputs.flyPortList ?? []).filter(v => !!v) as string[];
		const flyPortGroup = Array.from(new Set(flyPortList));
		return {flyPortGroup};
	}

	static async create(editor: ReteEditorInterface) {
		return callNoDialog(editor, () => new NodeFlyListMerge(''));
	}

	serialization(): NodeSerializationDataType {
		return {
			...super.serialization(),
			nodeTypeStatic: NodeFlyListMerge.nodeTypeStatic,
		};
	}

	static deserialize(data: NodeSerializationDataType): NodeParent {
		if (data.nodeTypeStatic !== NodeFlyListMerge.nodeTypeStatic) throw new Error("nodeTypeStatic not match");
		return new NodeFlyListMerge(data.labelName, data.id);
	}

	clone() {
		return new NodeFlyListMerge(this.labelName);
	}
}

