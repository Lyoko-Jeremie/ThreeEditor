import {NodeSensor} from "./NodeSensor";
import {NodeLatch, NodeLatchFly, NodeLatchFlyCombine} from "./NodeLatch";
import {NodeLatchCount, NodeLatchCountFly, NodeLatchCountFlyCombine} from "./NodeLatchCount";
import {NodeScore} from "./NodeScore";
import {NodeSum} from "./NodeSum";
import {
	NodeLogicAnd,
	NodeLogicBuffer,
	NodeLogicConstant,
	NodeLogicEqual,
	NodeLogicNand,
	NodeLogicNor,
	NodeLogicNot,
	NodeLogicOr,
	type NodeLogicType,
	NodeLogicTypeT,
	NodeLogicXnor,
	NodeLogicXor
} from "./NodeLogicType";
import {NodeFlyPort} from "./NodeFlyPort";
import {NodeEventSuppressor, NodeEventSuppressorFly} from "./NodeEventSwitch";

export const NodeCreateTable = [
	[NodeSensor.nodeTypeStatic, NodeSensor.deserialize],
	[NodeLatch.nodeTypeStatic, NodeLatch.deserialize],
	[NodeLatchFly.nodeTypeStatic, NodeLatchFly.deserialize],
	[NodeLatchFlyCombine.nodeTypeStatic, NodeLatchFlyCombine.deserialize],
	[NodeLatchCount.nodeTypeStatic, NodeLatchCount.deserialize],
	[NodeLatchCountFly.nodeTypeStatic, NodeLatchCountFly.deserialize],
	[NodeLatchCountFlyCombine.nodeTypeStatic, NodeLatchCountFlyCombine.deserialize],
	[NodeEventSuppressor.nodeTypeStatic, NodeEventSuppressor.deserialize],
	[NodeEventSuppressorFly.nodeTypeStatic, NodeEventSuppressorFly.deserialize],
	[NodeSum.nodeTypeStatic, NodeSum.deserialize],
	[NodeScore.nodeTypeStatic, NodeScore.deserialize],
	[NodeLogicAnd.nodeTypeStatic, NodeLogicAnd.deserialize],
	[NodeLogicOr.nodeTypeStatic, NodeLogicOr.deserialize],
	[NodeLogicNot.nodeTypeStatic, NodeLogicNot.deserialize],
	[NodeLogicNand.nodeTypeStatic, NodeLogicNand.deserialize],
	[NodeLogicNor.nodeTypeStatic, NodeLogicNor.deserialize],
	[NodeLogicXor.nodeTypeStatic, NodeLogicXor.deserialize],
	[NodeLogicXnor.nodeTypeStatic, NodeLogicXnor.deserialize],
	[NodeLogicBuffer.nodeTypeStatic, NodeLogicBuffer.deserialize],
	[NodeLogicConstant.nodeTypeStatic, NodeLogicConstant.deserialize],
	[NodeLogicEqual.nodeTypeStatic, NodeLogicEqual.deserialize],
	[NodeFlyPort.nodeTypeStatic, NodeFlyPort.deserialize],
] as const;

export const NodeLatchTypeT = [NodeLatch, NodeLatchCount] as const;
export type NodeLatchType = NodeLatch | NodeLatchCount;
export const NodeLatchFlyTypeT = [NodeLatchFly, NodeLatchCountFly, NodeLatchFlyCombine, NodeLatchCountFlyCombine] as const;
export type NodeLatchFlyType = NodeLatchFly | NodeLatchCountFly | NodeLatchFlyCombine | NodeLatchCountFlyCombine;
export const NodeCalcTypeT = [
	...NodeLogicTypeT,
	...NodeLatchTypeT,
	NodeSum,
] as const;
export type NodeCalcType = NodeLogicType | NodeLatchType | NodeSum;
export const NodeEventSwitchTypeT = [
	NodeEventSuppressor,
	NodeEventSuppressorFly,
] as const;
export type NodeEventSwitchType = NodeEventSuppressor | NodeEventSuppressorFly;
export const NodeAllTypeT = [
	NodeSensor,
	NodeFlyPort,
	...NodeLatchTypeT,
	...NodeLatchFlyTypeT,
	...NodeEventSwitchTypeT,
	...NodeCalcTypeT,
	NodeScore,
] as const;
export type NodeAllType =
	NodeSensor |
	NodeFlyPort |
	NodeLatchType |
	NodeLatchFlyType |
	NodeEventSwitchType |
	NodeCalcType |
	NodeScore
	;

export const NodeLatchKeyL = NodeLatchTypeT.map(n => n.nodeTypeStatic);
export const NodeLatchFlyKeyL = NodeLatchFlyTypeT.map(n => n.nodeTypeStatic);
export const NodeLogicKeyL = NodeLogicTypeT.map(n => n.nodeTypeStatic);
export const NodeCalcKeyL = NodeCalcTypeT.map(n => n.nodeTypeStatic);
export const NodeEventSwitchKeyL = NodeEventSwitchTypeT.map(n => n.nodeTypeStatic);
export const NodeAllKeyL = NodeAllTypeT.map(n => n.nodeTypeStatic);

// export type NodeLatchType = typeof NodeLatchTypeT[number] & NodeBase;
// export type NodeLatchFlyType = typeof NodeLatchFlyTypeT[number] & NodeBase;
// export type NodeCalcType = typeof NodeCalcTypeT[number] & NodeBase;
// export type NodeEventSwitchType = typeof NodeEventSwitchTypeT[number] & NodeBase;
// export type NodeAllType = typeof NodeAllTypeT[number] & NodeBase;

