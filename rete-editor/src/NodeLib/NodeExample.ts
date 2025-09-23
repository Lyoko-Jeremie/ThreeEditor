// import {ClassicPreset} from 'rete';
// import {SocketLib} from "./SocketLib";
// import {nameDialog} from "./NameSwal";
// import type {ReteEditorInterface} from "../ReteEditorInterface";
// import {NodeParent} from "./NodeParent";
// import {NodeDecorator} from "./NodeMeta";
//
// @NodeDecorator()
// export class NodeExample extends NodeParent {
// 	// static nodeTypeStatic: string = 'NodeSum';
// 	// nodeType: string = 'NodeSum';
// 	// width = 200;
// 	// height!: number;
//
// 	needSkipBuffer = true;
//
// 	constructor(label: string, id?: string) {
// 		super('NodeExample: ' + label);
// 		this.id = id ?? this.id;
// 		this.addInput('inputValue', new ClassicPreset.Input(SocketLib.normalLogic, '输入', true));
// 		this.addOutput('outputSum', new ClassicPreset.Output(SocketLib.normalLogic, '求和', true));
// 	}
//
// 	data(inputs: { inputValue?: number[] }): { outputSum: number } {
// 		return {outputSum: inputs.inputValue?.reduce((a, b) => a + b, 0) ?? 0};
// 	}
//
// 	static async create(editor: ReteEditorInterface) {
// 		return nameDialog(editor, '求和计算器 名称', (name) => new NodeExample(name));
// 	}
//
// 	// serialization(): NodeSerializationDataType {
// 	// 	return {
// 	// 		...super.serialization(),
// 	// 		nodeTypeStatic: NodeExample.nodeTypeStatic,
// 	// 	};
// 	// }
//
// 	// static deserialize(data: NodeSerializationDataType): NodeParent {
// 	// 	if (data.nodeTypeStatic !== this.nodeTypeStatic) throw new Error("nodeTypeStatic not match");
// 	// 	return new NodeExample(data.label, data.id);
// 	// }
// }
//
// export const NodeMenuSum = (editor: ReteEditorInterface): [string, () => Promise<NodeExample>] => {
// 	return [
// 		"NodeExample", async () => NodeExample.create(editor),
// 	] as const;
// };
//
// // const a = new NodeExample('name');
// // a.
