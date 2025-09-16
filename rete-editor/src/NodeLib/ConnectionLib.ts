import {ClassicPreset, type GetSchemes} from 'rete';
import type {NodeScore} from "./NodeScore";
import type {NodeSum} from "./NodeSum";
import type {NodeSensor} from "./NodeSensor";
import type {NodeLatch} from "./NodeLatch";
import type {NodeLatchCount} from "./NodeLatchCount";
import type {NodeLogicType} from "./NodeLogicType";

export type NodeLatchType = NodeLatch | NodeLatchCount;
export type NodeCalcType = NodeLogicType | NodeLatchType | NodeSum;

export class ConnectionScore<A extends NodeCalcType, B extends NodeScore> extends ClassicPreset.Connection<A, B> {
}

export class ConnectionCalc<A extends NodeCalcType, B extends NodeCalcType> extends ClassicPreset.Connection<A, B> {
}

export class ConnectionSensor<A extends NodeSensor, B extends NodeLatchType> extends ClassicPreset.Connection<A, B> {
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
