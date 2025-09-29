import {ClassicPreset} from 'rete';
import {SocketLib} from "./SocketLib";
import type {ReteEditorInterface} from "../ReteEditorInterface";
import {nameDialog} from "./NameSwal";
import {NodeParent, type NodeStateFull} from "./NodeParent";
import type {NodeSerializationDataType} from "../ReteSerializationTypeDef";
import {NODE_WIDTH} from './NodeConstantConfig';

export class NodeLogicLatch extends NodeParent implements NodeStateFull {
	static nodeTypeStatic: string = 'NodeLogicLatch';
	nodeType: string = 'NodeLogicLatch';
	width = NODE_WIDTH;
	height!: number;

	needSkipBuffer = false;

	_labelPrefix: string = '逻辑锁存器: ';

	constructor(label: string, id?: string) {
		super(label);
		this.labelName = label;
		this.id = id ?? this.id;
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.normalLogic, '逻辑输入', false));
		this.addOutput('latchState', new ClassicPreset.Output(SocketLib.normalLogic, '逻辑输出', true));
	}

	latchState = 0;

	data(inputs: { inputValue?: number[] }): { latchState: number } {
		if (inputs.inputValue) {
			const inputValue = inputs.inputValue[0];
			if (inputValue !== undefined && inputValue > 0 && this.latchState === 0) {
				this.latchState = 1;
			}
		}
		return {latchState: this.latchState};
	}

	resetState() {
		this.latchState = 0;
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '逻辑锁存器 名称', (name) => new NodeLogicLatch(name));
	}

	serialization(): NodeSerializationDataType {
		return {
			...super.serialization(),
			nodeTypeStatic: NodeLogicLatch.nodeTypeStatic,
		};
	}

	static deserialize(data: NodeSerializationDataType): NodeParent {
		if (data.nodeTypeStatic !== NodeLogicLatch.nodeTypeStatic) throw new Error("nodeTypeStatic not match");
		return new NodeLogicLatch(data.labelName, data.id);
	}

	clone() {
		return new NodeLogicLatch(this.labelName);
	}
}

export const NodeMenuLogicLatch = (editor: ReteEditorInterface): [string, () => Promise<NodeLogicLatch>][] => {
	return [
		["逻辑锁存器", async () => NodeLogicLatch.create(editor),],
	] as const;
};
