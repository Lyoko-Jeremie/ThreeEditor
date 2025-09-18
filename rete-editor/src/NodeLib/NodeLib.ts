import {NodeSensor} from "./NodeSensor";
import {NodeLatch, NodeLatchFly} from "./NodeLatch";
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
	NodeLogicXnor,
	NodeLogicXor
} from "./NodeLogicType";

export const NodeCreateTable = [
	[NodeSensor.nodeTypeStatic, NodeSensor.deserialize],
	// [NodeSensor.nodeTypeStatic, NodeSensor.deserialize],
	[NodeLatch.nodeTypeStatic, NodeLatch.deserialize],
	[NodeLatchFly.nodeTypeStatic, NodeLatchFly.deserialize],
	[NodeLatchCount.nodeTypeStatic, NodeLatchCount.deserialize],
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
] as const;
