import {ClassicPreset} from 'rete';
import {SocketLib} from "./SocketLib";
import type {NeedSkipBuffer} from "./OpInterface";
import type {ReteEditorInterface} from "../ReteEditorInterface";
import {nameDialog} from "./NameSwal";

export class NodeLogicAnd extends ClassicPreset.Node implements NeedSkipBuffer {
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string) {
		super('逻辑与计算器: ' + label);
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.normal, '输入', true));
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.normal, '输出', true));
	}

	data(inputs: { inputValue?: number[] }): { outputValue: number } {
		return {outputValue: inputs.inputValue?.every(T => !!T) ? 1 : 0};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '逻辑与计算器 名称', (name) => new NodeLogicAnd(name));
	}
}

export class NodeLogicOr extends ClassicPreset.Node implements NeedSkipBuffer {
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string) {
		super('逻辑或计算器: ' + label);
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.normal, '输入', true));
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.normal, '输出', true));
	}

	data(inputs: { inputValue?: number[] }): { outputValue: number } {
		return {outputValue: inputs.inputValue?.some(T => !!T) ? 1 : 0};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '逻辑或计算器 名称', (name) => new NodeLogicOr(name));
	}
}

export class NodeLogicNot extends ClassicPreset.Node implements NeedSkipBuffer {
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string) {
		super('逻辑非计算器: ' + label);
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.normal, '输入', false));
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.normal, '输出', true));
	}

	data(inputs: { inputValue?: number[] }): { outputValue: number } {
		return {outputValue: inputs.inputValue?.[0] ? 0 : 1};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '逻辑非计算器 名称', (name) => new NodeLogicNot(name));
	}
}

export class NodeLogicNand extends ClassicPreset.Node implements NeedSkipBuffer {
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string) {
		super('逻辑与非计算器: ' + label);
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.normal, '输入', true));
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.normal, '输出', true));
	}

	data(inputs: { inputValue?: number[] }): { outputValue: number } {
		return {outputValue: inputs.inputValue?.every(T => !!T) ? 0 : 1};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '逻辑与非计算器 名称', (name) => new NodeLogicNand(name));
	}
}

export class NodeLogicNor extends ClassicPreset.Node implements NeedSkipBuffer {
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string) {
		super('逻辑或非计算器: ' + label);
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.normal, '输入', true));
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.normal, '输出', true));
	}

	data(inputs: { inputValue?: number[] }): { outputValue: number } {
		return {outputValue: inputs.inputValue?.some(T => !!T) ? 0 : 1};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '逻辑或非计算器 名称', (name) => new NodeLogicNor(name));
	}
}

export class NodeLogicXor extends ClassicPreset.Node implements NeedSkipBuffer {
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string) {
		super('逻辑异或计算器: ' + label);
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
}

export class NodeLogicXnor extends ClassicPreset.Node implements NeedSkipBuffer {
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string) {
		super('逻辑同或计算器: ' + label);
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
}

// 同相器（同相缓冲门）
export class NodeLogicBuffer extends ClassicPreset.Node implements NeedSkipBuffer {
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string) {
		super('逻辑缓冲计算器: ' + label);
		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.normal, '输入'));
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.normal, '输出', true));
	}

	data(inputs: { inputValue?: number[] }): { outputValue: number } {
		return {outputValue: inputs.inputValue?.[0] ? 1 : 0};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '逻辑缓冲计算器 名称', (name) => new NodeLogicBuffer(name));
	}
}

export class NodeLogicConstant extends ClassicPreset.Node implements NeedSkipBuffer {
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string) {
		super('逻辑常量计算器: ' + label);
		this.addOutput('outputValue', new ClassicPreset.Output(SocketLib.normal, '输出', true));
		this.addControl('inputValue', new ClassicPreset.InputControl('number', {
			initial: 0,
			change: (v) => (this.inputValue = v)
		}));
	}

	inputValue = 0;

	data(): { outputValue: number } {
		return {outputValue: this.inputValue ? 1 : 0};
	}

	static async create(editor: ReteEditorInterface) {
		return nameDialog(editor, '逻辑常量计算器 名称', (name) => new NodeLogicConstant(name));
	}
}

export class NodeLogicEqual extends ClassicPreset.Node implements NeedSkipBuffer {
	width = 200;
	height!: number;

	needSkipBuffer = true;

	constructor(label: string) {
		super('逻辑等于计算器: ' + label);
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
