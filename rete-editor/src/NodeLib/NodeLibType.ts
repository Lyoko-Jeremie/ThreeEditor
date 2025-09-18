import type {NodeLatch, NodeLatchFly} from "./NodeLatch";
import type {NodeLatchCount, NodeLatchCountFly} from "./NodeLatchCount";
import type {NodeLogicType} from "./NodeLogicType";
import type {NodeSum} from "./NodeSum";
import type {NodeSensor} from "./NodeSensor";
import type {NodeScore} from "./NodeScore";
import type {GetSchemes} from "rete";
import type {
	ConnectionCalc,
	ConnectionFly,
	ConnectionFlyConfig,
	ConnectionScore,
	ConnectionSensor
} from "./ConnectionLib";
import type {NodeFlyPort} from "./NodeFlyPort";

export type NodeLatchType = NodeLatch | NodeLatchFly | NodeLatchCount;
export type NodeLatchFlyType = NodeLatchFly | NodeLatchCountFly;
export type NodeCalcType = NodeLogicType | NodeLatchType | NodeSum;

export type NodeAllType =
	NodeSensor |
	NodeFlyPort |
	NodeLatchType |
	NodeCalcType |
	NodeScore
	;

export type ConnectionType =
	ConnectionSensor<NodeSensor, NodeLatchType> |
	ConnectionCalc<NodeCalcType, NodeCalcType> |
	ConnectionScore<NodeCalcType, NodeScore> |
	ConnectionFly<NodeSensor, NodeLatchFlyType> |
	ConnectionFlyConfig<NodeFlyPort, NodeLatchFlyType>
	;

export type Schemes = GetSchemes<
	NodeAllType,
	ConnectionType
>;
