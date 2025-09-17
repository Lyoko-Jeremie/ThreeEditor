import {NodeLatch} from "./NodeLatch";
import {NodeLatchCount} from "./NodeLatchCount";
import {NodeSum} from "./NodeSum";
import type {NodeAllType, NodeCalcType, NodeLatchType} from "./NodeLibType";
import {
	NodeLogicAnd,
	NodeLogicOr,
	NodeLogicNot,
	NodeLogicNand,
	NodeLogicNor,
	NodeLogicXor,
	NodeLogicXnor,
	NodeLogicBuffer,
	NodeLogicConstant,
	NodeLogicEqual,
	type NodeLogicType,
} from "./NodeLogicType";
import {NodeSensor} from "./NodeSensor";
import {NodeScore} from "./NodeScore";

export function isNodeLogicType(node: NodeAllType): node is NodeLogicType {
	return false
		|| node.nodeType === NodeLogicAnd.nodeTypeStatic
		|| node.nodeType === NodeLogicOr.nodeTypeStatic
		|| node.nodeType === NodeLogicNot.nodeTypeStatic
		|| node.nodeType === NodeLogicNand.nodeTypeStatic
		|| node.nodeType === NodeLogicNor.nodeTypeStatic
		|| node.nodeType === NodeLogicXor.nodeTypeStatic
		|| node.nodeType === NodeLogicXnor.nodeTypeStatic
		|| node.nodeType === NodeLogicBuffer.nodeTypeStatic
		|| node.nodeType === NodeLogicConstant.nodeTypeStatic
		|| node.nodeType === NodeLogicEqual.nodeTypeStatic
		;
}

export function isNodeLatchType(node: NodeAllType): node is NodeLatchType {
	return false
		|| node.nodeType === NodeLatch.nodeTypeStatic
		|| node.nodeType === NodeLatchCount.nodeTypeStatic
		;
}

export function isNodeCalcType(node: NodeAllType): node is NodeCalcType {
	return false
		|| isNodeLogicType(node)
		|| isNodeLatchType(node)
		|| node.nodeType === NodeSum.nodeTypeStatic
		;
}

export function isNodeSensorType(node: NodeAllType): node is NodeSensor {
	return NodeSensor.isNodeSensor(node);
}

export function isNodeScoreType(node: NodeAllType): node is NodeScore {
	return node.nodeType === NodeScore.nodeTypeStatic;
}
