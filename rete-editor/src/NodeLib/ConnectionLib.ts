import {ClassicPreset, type NodeEditor} from 'rete';
import type {NodeScore} from "./NodeScore";
import type {NodeSensor} from "./NodeSensor";
import {NodeParent} from "./NodeParent";
import type {NodeAllType, NodeCalcType, NodeLatchType, Schemes} from "./NodeLibType";
import {isNodeCalcType, isNodeLatchType, isNodeScoreType, isNodeSensorType} from "./NodeLibTypeCheck";
import {noticeDialog} from "./NoticeDialog";
import {getSourceTarget, type SocketData} from "rete-connection-plugin";

export type ConnectionSerializationDataType<T extends Record<string, any> = {}> = {
	id: string,
	source: string,
	sourceOutput: string,
	target: string,
	targetInput: string,
	connectionType: string,
} & T;

export abstract class ConnectionParent<A extends ClassicPreset.Node, B extends ClassicPreset.Node> extends ClassicPreset.Connection<A, B> {
	static connectionTypeStatic: string;
	abstract connectionType: string;

	// constructor(source: A, sourceOutput: keyof A['outputs'], target: B, targetInput: keyof B['inputs'], id?: string) {
	// 	super(source, sourceOutput, target, targetInput);
	// 	this.id = id ?? this.id;
	// }

}

export class ConnectionScore<A extends NodeCalcType, B extends NodeScore> extends ConnectionParent<A, B> {
	static connectionTypeStatic = 'Calc-Score';
	connectionType = 'Calc-Score';

	constructor(source: A, sourceOutput: keyof A['outputs'], target: B, targetInput: keyof B['inputs'], id?: string) {
		super(source, sourceOutput, target, targetInput);
		this.id = id ?? this.id;
	}

	static create<A extends NodeCalcType, B extends NodeScore>(source: A, sourceOutput: keyof A['outputs'], target: B, targetInput: keyof B['inputs']): ConnectionScore<A, B> {
		return new ConnectionScore(source, sourceOutput, target, targetInput);
	}

	static deserialize(data: ConnectionSerializationDataType, source: NodeAllType, target: NodeAllType): ConnectionParent<NodeParent, NodeParent> {
		if (data.connectionType !== ConnectionScore.connectionTypeStatic) {
			console.error('data.connectionType', data.connectionType, ConnectionScore.connectionTypeStatic);
			throw new Error("connectionTypeStatic not match");
		}
		return new ConnectionScore(
			source as NodeCalcType,
			data.sourceOutput,
			target as NodeScore,
			data.targetInput,
			data.id,
		);
	}
}

export class ConnectionCalc<A extends NodeCalcType, B extends NodeCalcType> extends ConnectionParent<A, B> {
	static connectionTypeStatic = 'Calc-Calc';
	connectionType = 'Calc-Calc';

	constructor(source: A, sourceOutput: keyof A['outputs'], target: B, targetInput: keyof B['inputs'], id?: string) {
		super(source, sourceOutput, target, targetInput);
		this.id = id ?? this.id;
	}

	static create<A extends NodeCalcType, B extends NodeCalcType>(source: A, sourceOutput: keyof A['outputs'], target: B, targetInput: keyof B['inputs']): ConnectionCalc<A, B> {
		return new ConnectionCalc(source, sourceOutput, target, targetInput);
	}

	static deserialize(data: ConnectionSerializationDataType, source: NodeAllType, target: NodeAllType): ConnectionParent<NodeParent, NodeParent> {
		if (data.connectionType !== ConnectionCalc.connectionTypeStatic) {
			console.error('data.connectionType', data.connectionType, ConnectionCalc.connectionTypeStatic);
			throw new Error("connectionTypeStatic not match");
		}
		return new ConnectionCalc(
			source as NodeCalcType,
			data.sourceOutput,
			target as NodeCalcType,
			data.targetInput,
			data.id,
		);
	}
}

export class ConnectionSensor<A extends NodeSensor, B extends NodeLatchType> extends ConnectionParent<A, B> {
	static connectionTypeStatic = 'Sensor-Latch';
	connectionType = 'Sensor-Latch';

	constructor(source: A, sourceOutput: keyof A['outputs'], target: B, targetInput: keyof B['inputs'], id?: string) {
		super(source, sourceOutput, target, targetInput);
		this.id = id ?? this.id;
	}

	static create<A extends NodeSensor, B extends NodeLatchType>(source: A, sourceOutput: keyof A['outputs'], target: B, targetInput: keyof B['inputs']): ConnectionSensor<A, B> {
		return new ConnectionSensor(source, sourceOutput, target, targetInput);
	}

	static deserialize(data: ConnectionSerializationDataType, source: NodeAllType, target: NodeAllType): ConnectionParent<NodeParent, NodeParent> {
		if (data.connectionType !== ConnectionSensor.connectionTypeStatic) {
			console.error('data.connectionType', data.connectionType, ConnectionSensor.connectionTypeStatic);
			throw new Error("connectionTypeStatic not match");
		}
		return new ConnectionSensor(
			source as NodeSensor,
			data.sourceOutput,
			target as NodeLatchType,
			data.targetInput,
			data.id,
		);
	}
}

export const ConnectionCreateTable = [
	[ConnectionScore.connectionTypeStatic, ConnectionScore.deserialize],
	[ConnectionCalc.connectionTypeStatic, ConnectionCalc.deserialize],
	[ConnectionSensor.connectionTypeStatic, ConnectionSensor.deserialize],
] as const;

export function createConnection(editor: NodeEditor<Schemes>, from: SocketData, to: SocketData, test: true): true | false | undefined;
export function createConnection(editor: NodeEditor<Schemes>, from: SocketData, to: SocketData, test: false): ConnectionParent<NodeAllType, NodeAllType> | undefined;
export function createConnection(editor: NodeEditor<Schemes>, from: SocketData, to: SocketData, test: boolean = false): ConnectionParent<NodeAllType, NodeAllType> | boolean | undefined {
	const [source, target] = getSourceTarget(from, to) || [null, null];

	if (!source || !target) {
		if (test) return false;
		return undefined;
	}
	const sourceNode = editor.getNode(source.nodeId);
	const targetNode = editor.getNode(target.nodeId);
	if (!sourceNode || !targetNode) {
		if (test) return false;
		return undefined;
	}
	const sideInput = sourceNode.inputs[source.key];
	const sideOutput = targetNode.inputs[target.key];
	if (!sideInput || !sideOutput) {
		if (test) return false;
		return undefined;
	}

	if (isNodeLatchType(targetNode) && !(isNodeSensorType(sourceNode))) {
		noticeDialog('Latch节点只能接受Sensor节点的输入');
		if (test) return false;
		// Latch only accepts Sensor input
		console.warn('createConnection: Latch only accepts Sensor input', {
			sourceNode,
			sideInput: from.key,
			targetNode,
			sideOutput: target.key
		});
		return undefined;
	}
	if (isNodeScoreType(sourceNode)) {
		noticeDialog('Score节点不能作为输出端');
		if (test) return false;
		// Score cannot be sourceNode
		console.warn('createConnection: Score cannot be sourceNode', {
			sourceNode,
			sideInput: from.key,
			targetNode,
			sideOutput: target.key
		});
		return undefined;
	}
	if (isNodeCalcType(sourceNode) && isNodeScoreType(targetNode)) {
		if (test) return true;
		return ConnectionScore.create(sourceNode, from.key, targetNode, target.key);
	}
	if (isNodeCalcType(sourceNode) && isNodeCalcType(targetNode)) {
		if (test) return true;
		return ConnectionCalc.create(sourceNode, from.key, targetNode, target.key);
	}
	if (isNodeSensorType(sourceNode) && isNodeLatchType(targetNode)) {
		if (test) return true;
		return ConnectionSensor.create(sourceNode, from.key, targetNode, target.key);
	}

	if (test) return false;
	console.error('createConnection: not supported connection type', {
		sourceNode,
		sideInput: from.key,
		targetNode,
		sideOutput: target.key
	});
	// throw new Error('createConnection: not supported connection type');
	return undefined;
}




