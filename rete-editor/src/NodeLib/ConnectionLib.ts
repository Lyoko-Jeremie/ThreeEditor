import {ClassicPreset} from 'rete';
import type {NodeScore} from "./NodeScore";
import type {NodeSensor} from "./NodeSensor";
import {NodeParent} from "./NodeParent";
import type {NodeAllType, NodeCalcType, NodeLatchType} from "./NodeLibType";

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
		if (data.connectionType !== ConnectionScore.connectionTypeStatic) throw new Error("connectionTypeStatic not match");
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
		if (data.connectionType !== ConnectionScore.connectionTypeStatic) throw new Error("connectionTypeStatic not match");
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
		if (data.connectionType !== ConnectionScore.connectionTypeStatic) throw new Error("connectionTypeStatic not match");
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
