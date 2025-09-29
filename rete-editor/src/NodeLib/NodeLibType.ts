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
import type {NodeAllType, NodeCalcType, NodeLatchType} from "./NodeLib";
import type {NodeCollisionCatch} from "./NodeCollisionCatch";

export type ConnectionType =
	ConnectionSensor<NodeSensor, NodeLatchType> |
	ConnectionCalc<NodeCalcType, NodeCalcType> |
	ConnectionScore<NodeCalcType, NodeScore> |
	ConnectionFly<NodeSensor, NodeCollisionCatch> |
	ConnectionFlyConfig<NodeFlyPort, NodeCollisionCatch>
	;

export type Schemes = GetSchemes<
	NodeAllType,
	ConnectionType
>;
