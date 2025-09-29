import {NodeSensor} from "./NodeSensor";
import {NodeLatch} from "./NodeLatch";
import {NodeLatchCount} from "./NodeLatchCount";
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
import {NodeEventSuppressor} from "./NodeEventSwitch";
import {NodeFlyToSensor} from "./NodeFlyToSensor";
import {NodeCollisionCatch, NodeCollisionCombineCatch, NodeCollisionFlyCatch} from "./NodeCollisionCatch";
import {NodeLogicLatch} from "./NodeLogicLatch";
import {NodeEndCheck} from "./NodeEndCheck";

export const NodeCreateTable = [
	[NodeSensor.nodeTypeStatic, NodeSensor.deserialize],
	[NodeCollisionCatch.nodeTypeStatic, NodeCollisionCatch.deserialize],
	[NodeCollisionFlyCatch.nodeTypeStatic, NodeCollisionFlyCatch.deserialize],
	[NodeCollisionCombineCatch.nodeTypeStatic, NodeCollisionCombineCatch.deserialize],
	[NodeLatch.nodeTypeStatic, NodeLatch.deserialize],
	[NodeLatchCount.nodeTypeStatic, NodeLatchCount.deserialize],
	[NodeLogicLatch.nodeTypeStatic, NodeLogicLatch.deserialize],
	[NodeEventSuppressor.nodeTypeStatic, NodeEventSuppressor.deserialize],
	[NodeSum.nodeTypeStatic, NodeSum.deserialize],
	[NodeScore.nodeTypeStatic, NodeScore.deserialize],
	[NodeEndCheck.nodeTypeStatic, NodeEndCheck.deserialize],
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
	[NodeFlyToSensor.nodeTypeStatic, NodeFlyToSensor.deserialize],
] as const;

export const NodeCollisionCatchTypeT = [NodeCollisionCatch, NodeCollisionFlyCatch, NodeCollisionCombineCatch] as const;
export type NodeCollisionCatchType = NodeCollisionCatch | NodeCollisionFlyCatch | NodeCollisionCombineCatch;
export const NodeLatchTypeT = [NodeLatch, NodeLatchCount] as const;
export type NodeLatchType = NodeLatch | NodeLatchCount;
export const NodeCalcTypeT = [
	...NodeLogicTypeT,
	...NodeLatchTypeT,
	NodeSum,
	NodeLogicLatch,
] as const;
export type NodeCalcType = NodeLogicType | NodeLogicLatch | NodeLatchType | NodeSum;
export const NodeEventSwitchTypeT = [
	NodeEventSuppressor,
	NodeFlyToSensor,
] as const;
export type NodeEventSwitchType = NodeEventSuppressor | NodeFlyToSensor;
export const NodeAllTypeT = [
	NodeSensor,
	...NodeCollisionCatchTypeT,
	NodeFlyPort,
	...NodeLatchTypeT,
	...NodeEventSwitchTypeT,
	...NodeCalcTypeT,
	NodeScore,
	NodeEndCheck,
] as const;
export type NodeAllType =
	NodeSensor |
	NodeCollisionCatchType |
	NodeFlyPort |
	NodeLatchType |
	NodeEventSwitchType |
	NodeCalcType |
	NodeScore |
	NodeEndCheck
	;

export const NodeCollisionCatchKeyL = NodeCollisionCatchTypeT.map(n => n.nodeTypeStatic);
export const NodeLatchKeyL = NodeLatchTypeT.map(n => n.nodeTypeStatic);
// export const NodeLogicKeyL = NodeLogicTypeT.map(n => n.nodeTypeStatic);
export const NodeCalcKeyL = NodeCalcTypeT.map(n => n.nodeTypeStatic);
export const NodeEventSwitchKeyL = NodeEventSwitchTypeT.map(n => n.nodeTypeStatic);
export const NodeAllKeyL = NodeAllTypeT.map(n => n.nodeTypeStatic);

// export type NodeLatchType = typeof NodeLatchTypeT[number] & NodeBase;
// export type NodeLatchFlyType = typeof NodeLatchFlyTypeT[number] & NodeBase;
// export type NodeCalcType = typeof NodeCalcTypeT[number] & NodeBase;
// export type NodeEventSwitchType = typeof NodeEventSwitchTypeT[number] & NodeBase;
// export type NodeAllType = typeof NodeAllTypeT[number] & NodeBase;

