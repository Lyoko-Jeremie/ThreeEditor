import {ClassicPreset, getUID} from 'rete';
import {SocketLib} from "./SocketLib";
import type {ReteEditorInterface} from "../ReteEditorInterface";
import {nameDialog} from "./NameSwal";
import type {Control} from "rete/_types/presets/classic";
import {NodeParent} from "./NodeParent";

export class NodeLogicAnd extends NodeParent {
	nodeType: string = 'NodeLogicAnd';
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string, id?: string) {
		super('逻辑与计算器: ' + label);
		this.id = id ?? this.id;
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.normal, '输入', true));
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.normal, '输出', true));
	}

	data(inputs: { inputValue?: number[] }): { outputValue: number } {
		return {outputValue: inputs.inputValue?.every(T => !!T) ? 1 : 0};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '逻辑与计算器 名称', (name) => new NodeLogicAnd(name));
	}

	serialization(): Record<string, any> {
		return super.serialization();
	}
}

export class NodeLogicOr extends NodeParent {
	nodeType: string = 'NodeLogicOr';
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string, id?: string) {
		super('逻辑或计算器: ' + label);
		this.id = id ?? this.id;
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.normal, '输入', true));
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.normal, '输出', true));
	}

	data(inputs: { inputValue?: number[] }): { outputValue: number } {
		return {outputValue: inputs.inputValue?.some(T => !!T) ? 1 : 0};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '逻辑或计算器 名称', (name) => new NodeLogicOr(name));
	}

	serialization(): Record<string, any> {
		return super.serialization();
	}
}

export class NodeLogicNot extends NodeParent {
	nodeType: string = 'NodeLogicNot';
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string, id?: string) {
		super('逻辑非计算器: ' + label);
		this.id = id ?? this.id;
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.normal, '输入', false));
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.normal, '输出', true));
	}

	data(inputs: { inputValue?: number[] }): { outputValue: number } {
		return {outputValue: inputs.inputValue?.[0] ? 0 : 1};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '逻辑非计算器 名称', (name) => new NodeLogicNot(name));
	}

	serialization(): Record<string, any> {
		return super.serialization();
	}
}

export class NodeLogicNand extends NodeParent {
	nodeType: string = 'NodeLogicNand';
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string, id?: string) {
		super('逻辑与非计算器: ' + label);
		this.id = id ?? this.id;
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.normal, '输入', true));
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.normal, '输出', true));
	}

	data(inputs: { inputValue?: number[] }): { outputValue: number } {
		return {outputValue: inputs.inputValue?.every(T => !!T) ? 0 : 1};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '逻辑与非计算器 名称', (name) => new NodeLogicNand(name));
	}

	serialization(): Record<string, any> {
		return super.serialization();
	}
}

export class NodeLogicNor extends NodeParent {
	nodeType: string = 'NodeLogicNor';
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string, id?: string) {
		super('逻辑或非计算器: ' + label);
		this.id = id ?? this.id;
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.normal, '输入', true));
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.normal, '输出', true));
	}

	data(inputs: { inputValue?: number[] }): { outputValue: number } {
		return {outputValue: inputs.inputValue?.some(T => !!T) ? 0 : 1};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '逻辑或非计算器 名称', (name) => new NodeLogicNor(name));
	}

	serialization(): Record<string, any> {
		return super.serialization();
	}
}

export class NodeLogicXor extends NodeParent {
	nodeType: string = 'NodeLogicXor';
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string, id?: string) {
		super('逻辑异或计算器: ' + label);
		this.id = id ?? this.id;
		this.addInput('inputValue1', new ClassicPreset.Input(SocketLib.normal, '输入1', false));
		this.addInput('inputValue2', new ClassicPreset.Input(SocketLib.normal, '输入2', false));
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.normal, '输出', true));
	}

	data(inputs: { inputValue1?: number[], inputValue2?: number[] }): { outputValue: number } {
		const v1 = inputs.inputValue1?.[0] ? 1 : 0;
		const v2 = inputs.inputValue2?.[0] ? 1 : 0;
		return {outputValue: (v1 + v2) % 2 === 1 ? 1 : 0};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '逻辑异或计算器 名称', (name) => new NodeLogicXor(name));
	}

	serialization(): Record<string, any> {
		return super.serialization();
	}
}

export class NodeLogicXnor extends NodeParent {
	nodeType: string = 'NodeLogicXnor';
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string, id?: string) {
		super('逻辑同或计算器: ' + label);
		this.id = id ?? this.id;
		this.addInput('inputValue1', new ClassicPreset.Input(SocketLib.normal, '输入1', false));
		this.addInput('inputValue2', new ClassicPreset.Input(SocketLib.normal, '输入2', false));
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.normal, '输出', true));
	}

	data(inputs: { inputValue1?: number[], inputValue2?: number[] }): { outputValue: number } {
		const v1 = inputs.inputValue1?.[0] ? 1 : 0;
		const v2 = inputs.inputValue2?.[0] ? 1 : 0;
		return {outputValue: (v1 + v2) % 2 === 0 ? 1 : 0};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '逻辑同或计算器 名称', (name) => new NodeLogicXnor(name));
	}

	serialization(): Record<string, any> {
		return super.serialization();
	}
}

// 同相器（同相缓冲门）
export class NodeLogicBuffer extends NodeParent {
	nodeType: string = 'NodeLogicBuffer';
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string, id?: string) {
		super('逻辑缓冲计算器: ' + label);
		this.id = id ?? this.id;
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.normal, '输入'));
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.normal, '输出', true));
	}

	data(inputs: { inputValue?: number[] }): { outputValue: number } {
		return {outputValue: inputs.inputValue?.[0] ? 1 : 0};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '逻辑缓冲计算器 名称', (name) => new NodeLogicBuffer(name));
	}

	serialization(): Record<string, any> {
		return super.serialization();
	}
}

export class NodeLogicConstant extends NodeParent {
	nodeType: string = 'NodeLogicConstant';
	width = 200;
	height!: number;

	styles() {
		return `input { color: black; }`;
	}

	needSkipBuffer = true;

	constructor(label: string, id?: string) {
		super('逻辑常量计算器: ' + label);
		this.id = id ?? this.id;
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.normal, '输出', true));
		// this.addControl('inputValue', new ClassicPreset.InputControl('number', {
		// 	initial: 0,
		// 	change: (v) => (this.inputValue = v)
		// }));
		this.addControl('inputValue', {
			id: getUID(),
			index: 0,
			initial: 0,
			change: (v: number) => {
				this.inputValue = v;
				console.log('NodeLogicConstant change', v);
			},
			isCustomNumberInput: true,
			readonly: false,
		} as Control);
	}

	inputValue = 0;

	data(): { outputValue: number } {
		return {outputValue: this.inputValue ? 1 : 0};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '逻辑常量计算器 名称', (name) => new NodeLogicConstant(name));
	}

	serialization(): Record<string, any> {
		return super.serialization();
	}
}

export class NodeLogicEqual extends NodeParent {
	nodeType: string = 'NodeLogicEqual';
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string, id?: string) {
		super('逻辑等于计算器: ' + label);
		this.id = id ?? this.id;
		this.addInput('inputValue1', new ClassicPreset.Input(SocketLib.normal, '输入1', false));
		this.addInput('inputValue2', new ClassicPreset.Input(SocketLib.normal, '输入2', false));
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.normal, '输出', true));
	}

	data(inputs: { inputValue1?: number[], inputValue2?: number[] }): { outputValue: number } {
		const v1 = inputs.inputValue1?.[0] ? 1 : 0;
		const v2 = inputs.inputValue2?.[0] ? 1 : 0;
		return {outputValue: v1 === v2 ? 1 : 0};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '逻辑等于计算器 名称', (name) => new NodeLogicEqual(name));
	}

	serialization(): Record<string, any> {
		return super.serialization();
	}
}

export type NodeLogicType =
	NodeLogicAnd |
	NodeLogicOr |
	NodeLogicNot |
	NodeLogicNand |
	NodeLogicNor |
	NodeLogicXor |
	NodeLogicXnor |
	NodeLogicBuffer |
	NodeLogicConstant |
	NodeLogicEqual
	;

export const NodeMenuLogic = (editor: ReteEditorInterface): [string, () => Promise<NodeLogicType>][] => {
	return [
		['逻辑与计算器', () => NodeLogicAnd.create(editor)],
		['逻辑或计算器', () => NodeLogicOr.create(editor)],
		['逻辑非计算器', () => NodeLogicNot.create(editor)],
		['逻辑与非计算器', () => NodeLogicNand.create(editor)],
		['逻辑或非计算器', () => NodeLogicNor.create(editor)],
		['逻辑异或计算器', () => NodeLogicXor.create(editor)],
		['逻辑同或计算器', () => NodeLogicXnor.create(editor)],
		['逻辑缓冲计算器', () => NodeLogicBuffer.create(editor)],
		['逻辑常量计算器', () => NodeLogicConstant.create(editor)],
		['逻辑等于计算器', () => NodeLogicEqual.create(editor)],
	] as const;
};
