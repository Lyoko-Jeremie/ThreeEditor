import {ClassicPreset, type GetSchemes} from 'rete';
import type {NodeScore} from "./NodeScore";
import type {NodeSum} from "./NodeSum";
import type {NodeSensor} from "./NodeSensor";
import type {NodeLatch} from "./NodeLatch";
import type {NodeLatchCount} from "./NodeLatchCount";
import type {NodeLogicType} from "./NodeLogicType";

export type NodeLatchType = NodeLatch | NodeLatchCount;
export type NodeCalcType = NodeLogicType | NodeLatchType | NodeSum;

export abstract class ConnectionParent<A extends ClassicPreset.Node, B extends ClassicPreset.Node> extends ClassicPreset.Connection<A, B> {
	static connectionTypeStatic: string;
	abstract connectionType: string;
}

export class ConnectionScore<A extends NodeCalcType, B extends NodeScore> extends ConnectionParent<A, B> {
	static connectionTypeStatic = 'Calc-Score';
	connectionType = 'Calc-Score';
}

export class ConnectionCalc<A extends NodeCalcType, B extends NodeCalcType> extends ConnectionParent<A, B> {
	static connectionTypeStatic = 'Calc-Calc';
	connectionType = 'Calc-Calc';
}

export class ConnectionSensor<A extends NodeSensor, B extends NodeLatchType> extends ConnectionParent<A, B> {
	static connectionTypeStatic = 'Sensor-Latch';
	connectionType = 'Sensor-Latch';
}


export type NodeAllType =
	NodeSensor |
	NodeLatchType |
	NodeCalcType |
	NodeScore
	;

export type ConnectionType =
	ConnectionSensor<NodeSensor, NodeLatchType> |
	ConnectionCalc<NodeCalcType, NodeCalcType> |
	ConnectionScore<NodeCalcType, NodeScore>
	;

export type Schemes = GetSchemes<
	NodeAllType,
	ConnectionType
>;
