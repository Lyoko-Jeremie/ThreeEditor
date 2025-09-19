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
import type {NodeAllType, NodeCalcType, NodeLatchFlyType, NodeLatchType} from "./NodeLib";

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
