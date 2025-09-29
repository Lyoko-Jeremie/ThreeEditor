import {ClassicPreset, type NodeEditor} from 'rete';
import {NodeScore} from "./NodeScore";
import {NodeSensor} from "./NodeSensor";
import {NodeParent} from "./NodeParent";
import type {Schemes} from "./NodeLibType";
import {noticeDialog} from "./NoticeDialog";
import {getSourceTarget, type SocketData} from "rete-connection-plugin";
import {NodeFlyPort} from "./NodeFlyPort";
import {
	type NodeAllType,
	NodeCalcKeyL,
	type NodeCalcType,
	NodeCollisionCatchKeyL,
	NodeEventSwitchKeyL,
	type NodeEventSwitchType,
	NodeLatchKeyL,
	type NodeLatchType
} from "./NodeLib";
import type {ConnectionSerializationDataType} from "../ReteSerializationTypeDef";
import {CustomSocket, SocketLib} from "./SocketLib";
import type {NodeCollisionCatch} from "./NodeCollisionCatch";
import {NodeEndCheck} from "./NodeEndCheck";
import {NodeLogicConstant} from "./NodeLogicType";
import {NodeToolsLibKeyL} from "./NodeToolsLib/NodeMenuToolsLib";

type ConnectSideType = ClassicPreset.Output<CustomSocket>;

// 基类
export abstract class ConnectionParent<A extends NodeParent, B extends NodeParent> extends ClassicPreset.Connection<A, B> {
	static connectionTypeStatic: string;
	abstract connectionType: string;

	static readableNameStatic: string;
	abstract readableName: string;

	// constructor(source: A, sourceOutput: keyof A['outputs'], target: B, targetInput: keyof B['inputs'], id?: string) {
	// 	super(source, sourceOutput, target, targetInput);
	// 	this.id = id ?? this.id;
	// }

}

export type ConnectionScoreInputType = NodeCalcType | NodeLatchType | NodeEventSwitchType;
const checkConnectionScore = {
	in: [
		...NodeCalcKeyL,
		...NodeLatchKeyL,
		...NodeEventSwitchKeyL,
		...NodeCollisionCatchKeyL,
		...NodeToolsLibKeyL,
	],
	out: [
		NodeScore.nodeTypeStatic,
		NodeEndCheck.nodeTypeStatic,
	],
};

// 逻辑信号连接到成绩节点 Calc-Score
export class ConnectionScore<A extends ConnectionScoreInputType, B extends NodeScore> extends ConnectionParent<A, B> {
	static connectionTypeStatic = 'Calc-Score';
	connectionType = 'Calc-Score';

	static readableNameStatic = '成绩';
	readableName = '成绩';

	constructor(source: A, sourceOutput: keyof A['outputs'], target: B, targetInput: keyof B['inputs'], id?: string) {
		super(source, sourceOutput, target, targetInput);
		this.id = id ?? this.id;
	}

	static create<A extends ConnectionScoreInputType, B extends NodeScore>(source: A, sourceOutput: keyof A['outputs'], target: B, targetInput: keyof B['inputs']): ConnectionScore<A, B> {
		return new ConnectionScore(source, sourceOutput, target, targetInput);
	}

	static deserialize(data: ConnectionSerializationDataType, source: NodeAllType, target: NodeAllType): ConnectionParent<NodeParent, NodeParent> {
		if (data.connectionType !== ConnectionScore.connectionTypeStatic) {
			console.error('data.connectionType', data.connectionType, ConnectionScore.connectionTypeStatic);
			throw new Error("connectionTypeStatic not match");
		}
		return new ConnectionScore(
			source as ConnectionScoreInputType,
			data.sourceOutput,
			target as NodeScore,
			data.targetInput,
			data.id,
		);
	}

	static canConnect<A extends NodeParent, B extends NodeParent, AS extends ConnectSideType, BS extends ConnectSideType>(source: A, target: B, sideInput: AS, sideOutput: BS): boolean {
		return checkConnectionScore.in.includes(source.nodeType) && checkConnectionScore.out.includes(target.nodeType)
			&& sideInput.socket.key === SocketLib.normalLogic.key && sideOutput.socket.key === SocketLib.normalLogic.key
			&& source.nodeType !== NodeLogicConstant.nodeTypeStatic
			;
	}

}

export type ConnectionCalcInputType = NodeCalcType | NodeLatchType;
export type ConnectionCalcOutputType = NodeCalcType | NodeEventSwitchType;
const checkConnectionCalc = {
	in: [
		...NodeCalcKeyL,
		...NodeLatchKeyL,
		...NodeCollisionCatchKeyL,
		...NodeToolsLibKeyL,
	],
	out: [
		...NodeCalcKeyL,
		...NodeEventSwitchKeyL,
		...NodeToolsLibKeyL,
		NodeEndCheck.nodeTypeStatic,
	],
};

// 逻辑信号 Calc-Calc
export class ConnectionCalc<A extends ConnectionCalcInputType, B extends ConnectionCalcOutputType> extends ConnectionParent<A, B> {
	static connectionTypeStatic = 'Calc-Calc';
	connectionType = 'Calc-Calc';

	static readableNameStatic = '逻辑信号';
	readableName = '逻辑信号';

	constructor(source: A, sourceOutput: keyof A['outputs'], target: B, targetInput: keyof B['inputs'], id?: string) {
		super(source, sourceOutput, target, targetInput);
		this.id = id ?? this.id;
	}

	static create<A extends ConnectionCalcInputType, B extends ConnectionCalcOutputType>(source: A, sourceOutput: keyof A['outputs'], target: B, targetInput: keyof B['inputs']): ConnectionCalc<A, B> {
		return new ConnectionCalc(source, sourceOutput, target, targetInput);
	}

	static deserialize(data: ConnectionSerializationDataType, source: NodeAllType, target: NodeAllType): ConnectionParent<NodeParent, NodeParent> {
		if (data.connectionType !== ConnectionCalc.connectionTypeStatic) {
			console.error('data.connectionType', data.connectionType, ConnectionCalc.connectionTypeStatic);
			throw new Error("connectionTypeStatic not match");
		}
		return new ConnectionCalc(
			source as ConnectionCalcInputType,
			data.sourceOutput,
			target as ConnectionCalcOutputType,
			data.targetInput,
			data.id,
		);
	}

	static canConnect<A extends NodeParent, B extends NodeParent, AS extends ConnectSideType, BS extends ConnectSideType>(source: A, target: B, sideInput: AS, sideOutput: BS): boolean {
		return checkConnectionCalc.in.includes(source.nodeType) && checkConnectionCalc.out.includes(target.nodeType)
			&& sideInput.socket.key === SocketLib.normalLogic.key && sideOutput.socket.key === SocketLib.normalLogic.key
			;
	}
}

export type ConnectionSensorInputType = NodeSensor | NodeEventSwitchType;
export type ConnectionSensorOutputType = NodeLatchType | NodeEventSwitchType;
const checkConnectionSensor = {
	in: [
		...NodeCollisionCatchKeyL,
		...NodeEventSwitchKeyL,
		NodeSensor.nodeTypeStatic,
	],
	out: [
		...NodeLatchKeyL,
		...NodeEventSwitchKeyL,
		...NodeCollisionCatchKeyL,
		...NodeToolsLibKeyL,
	],
};

// 通用触发信号 Sensor-Latch
export class ConnectionSensor<A extends ConnectionSensorInputType, B extends ConnectionSensorOutputType> extends ConnectionParent<A, B> {
	static connectionTypeStatic = 'Sensor-Latch';
	connectionType = 'Sensor-Latch';

	static readableNameStatic = '通用触发信号';
	readableName = '通用触发信号';

	constructor(source: A, sourceOutput: keyof A['outputs'], target: B, targetInput: keyof B['inputs'], id?: string) {
		super(source, sourceOutput, target, targetInput);
		this.id = id ?? this.id;
	}

	static create<A extends ConnectionSensorInputType, B extends ConnectionSensorOutputType>(source: A, sourceOutput: keyof A['outputs'], target: B, targetInput: keyof B['inputs']): ConnectionSensor<A, B> {
		return new ConnectionSensor(source, sourceOutput, target, targetInput);
	}

	static deserialize(data: ConnectionSerializationDataType, source: NodeAllType, target: NodeAllType): ConnectionParent<NodeParent, NodeParent> {
		if (data.connectionType !== ConnectionSensor.connectionTypeStatic) {
			console.error('data.connectionType', data.connectionType, ConnectionSensor.connectionTypeStatic);
			throw new Error("connectionTypeStatic not match");
		}
		return new ConnectionSensor(
			source as ConnectionSensorInputType,
			data.sourceOutput,
			target as ConnectionSensorOutputType,
			data.targetInput,
			data.id,
		);
	}

	static canConnect<A extends NodeParent, B extends NodeParent, AS extends ConnectSideType, BS extends ConnectSideType>(source: A, target: B, sideInput: AS, sideOutput: BS): boolean {
		return checkConnectionSensor.in.includes(source.nodeType) && checkConnectionSensor.out.includes(target.nodeType)
			&& sideInput.socket.key === SocketLib.sensorOutput.key && sideOutput.socket.key === SocketLib.sensorOutput.key
			;
	}
}

const checkConnectionFly = {
	in: [
		NodeSensor.nodeTypeStatic,
		...NodeCollisionCatchKeyL,
	],
	out: [
		...NodeCollisionCatchKeyL,
	],
};

// 无人机触发信号 Sensor-LatchFly
export class ConnectionFly<A extends NodeSensor, B extends NodeCollisionCatch> extends ConnectionParent<A, B> {
	static connectionTypeStatic = 'Sensor-LatchFly';
	connectionType = 'Sensor-LatchFly';

	static readableNameStatic = '无人机触发信号';
	readableName = '无人机触发信号';

	constructor(source: A, sourceOutput: keyof A['outputs'], target: B, targetInput: keyof B['inputs'], id?: string) {
		super(source, sourceOutput, target, targetInput);
		this.id = id ?? this.id;
	}

	static create<A extends NodeSensor, B extends NodeCollisionCatch>(source: A, sourceOutput: keyof A['outputs'], target: B, targetInput: keyof B['inputs']): ConnectionFly<A, B> {
		return new ConnectionFly(source, sourceOutput, target, targetInput);
	}

	static deserialize(data: ConnectionSerializationDataType, source: NodeAllType, target: NodeAllType): ConnectionParent<NodeParent, NodeParent> {
		if (data.connectionType !== ConnectionFly.connectionTypeStatic) {
			console.error('data.connectionType', data.connectionType, ConnectionFly.connectionTypeStatic);
			throw new Error("connectionTypeStatic not match");
		}
		return new ConnectionFly(
			source as NodeSensor,
			data.sourceOutput,
			target as NodeCollisionCatch,
			data.targetInput,
			data.id,
		);
	}

	static canConnect<A extends NodeParent, B extends NodeParent, AS extends ConnectSideType, BS extends ConnectSideType>(source: A, target: B, sideInput: AS, sideOutput: BS): boolean {
		return checkConnectionFly.in.includes(source.nodeType) && checkConnectionFly.out.includes(target.nodeType)
			&& sideInput.socket.key === SocketLib.sensorOutputFly.key && sideOutput.socket.key === SocketLib.sensorOutputFly.key
			;
	}
}

const checkConnectionFlyConfig = {
	in: [
		NodeFlyPort.nodeTypeStatic,
	],
	out: [
		...NodeCollisionCatchKeyL,
	],
};

// 无人机配置信息 FlyConfig-LatchFly
export class ConnectionFlyConfig<A extends NodeFlyPort, B extends NodeCollisionCatch> extends ConnectionParent<A, B> {
	static connectionTypeStatic = 'FlyConfig-LatchFly';
	connectionType = 'FlyConfig-LatchFly';

	static readableNameStatic = '无人机端口配置';
	readableName = '无人机端口配置';

	constructor(source: A, sourceOutput: keyof A['outputs'], target: B, targetInput: keyof B['inputs'], id?: string) {
		super(source, sourceOutput, target, targetInput);
		this.id = id ?? this.id;
	}

	static create<A extends NodeFlyPort, B extends NodeCollisionCatch>(source: A, sourceOutput: keyof A['outputs'], target: B, targetInput: keyof B['inputs']): ConnectionFlyConfig<A, B> {
		return new ConnectionFlyConfig(source, sourceOutput, target, targetInput);
	}

	static deserialize(data: ConnectionSerializationDataType, source: NodeAllType, target: NodeAllType): ConnectionParent<NodeParent, NodeParent> {
		if (data.connectionType !== ConnectionFlyConfig.connectionTypeStatic) {
			console.error('data.connectionType', data.connectionType, ConnectionFlyConfig.connectionTypeStatic);
			throw new Error("connectionTypeStatic not match");
		}
		return new ConnectionFlyConfig(
			source as NodeFlyPort,
			data.sourceOutput,
			target as NodeCollisionCatch,
			data.targetInput,
			data.id,
		);
	}

	static canConnect<A extends NodeParent, B extends NodeParent, AS extends ConnectSideType, BS extends ConnectSideType>(source: A, target: B, sideInput: AS, sideOutput: BS): boolean {
		return checkConnectionFlyConfig.in.includes(source.nodeType) && checkConnectionFlyConfig.out.includes(target.nodeType)
			&& sideInput.socket.key === SocketLib.flyPort.key && sideOutput.socket.key === SocketLib.flyPort.key
			;
	}
}

export const ConnectionReadableNameTable = new Map([
	[ConnectionScore.connectionTypeStatic, ConnectionScore.readableNameStatic],
	[ConnectionCalc.connectionTypeStatic, ConnectionCalc.readableNameStatic],
	[ConnectionSensor.connectionTypeStatic, ConnectionSensor.readableNameStatic],
	[ConnectionFly.connectionTypeStatic, ConnectionFly.readableNameStatic],
	[ConnectionFlyConfig.connectionTypeStatic, ConnectionFlyConfig.readableNameStatic],
] as const);

export const ConnectionCreateTable = new Map([
	[ConnectionScore.connectionTypeStatic, ConnectionScore.deserialize],
	[ConnectionCalc.connectionTypeStatic, ConnectionCalc.deserialize],
	[ConnectionSensor.connectionTypeStatic, ConnectionSensor.deserialize],
	[ConnectionFly.connectionTypeStatic, ConnectionFly.deserialize],
	[ConnectionFlyConfig.connectionTypeStatic, ConnectionFlyConfig.deserialize],
] as const);

export const ConnectionCreateColorTable = new Map([
	[ConnectionScore.connectionTypeStatic, '#ff9d9d'],
	[ConnectionCalc.connectionTypeStatic, '#FF5722'],
	[ConnectionSensor.connectionTypeStatic, '#9C27B0'],
	[ConnectionFly.connectionTypeStatic, '#E91E63'],
	[ConnectionFlyConfig.connectionTypeStatic, '#2196F3'],
] as const);

export function createConnection(editor: NodeEditor<Schemes>, from: SocketData, to: SocketData, test: true): true | false | undefined;
export function createConnection(editor: NodeEditor<Schemes>, from: SocketData, to: SocketData, test: false): ConnectionParent<NodeAllType, NodeAllType> | undefined;
export function createConnection(editor: NodeEditor<Schemes>, from: SocketData, to: SocketData, test: boolean = false): ConnectionParent<NodeAllType, NodeAllType> | boolean | undefined {
	const [source, target] = getSourceTarget(from, to) || [null, null];

	if (!source || !target) {
		console.error('createConnection: getSourceTarget failed', {from, to});
		if (test) return false;
		return undefined;
	}
	const sourceNode = editor.getNode(source.nodeId);
	const targetNode = editor.getNode(target.nodeId);
	if (!sourceNode || !targetNode) {
		console.error('createConnection: getNode failed', {source, target, sourceNode, targetNode});
		if (test) return false;
		return undefined;
	}
	const sideInput = sourceNode.outputs[source.key];
	const sideOutput = targetNode.inputs[target.key];
	if (!sideInput || !sideOutput) {
		console.error('createConnection: get sideInput/sideOutput failed', {
			source,
			target,
			sourceNode,
			targetNode,
			sideInput,
			sideOutput
		});
		if (test) return false;
		return undefined;
	}

	// TODO loop-back check

	if (sourceNode.nodeType === NodeScore.nodeTypeStatic) {
		noticeDialog('成绩 节点不能作为输出端');
		// Score cannot be sourceNode
		console.warn('createConnection: Score cannot be sourceNode', {
			sourceNode,
			sideInput: from.key,
			targetNode,
			sideOutput: target.key
		});
		if (test) return false;
		return undefined;
	}
	if (sourceNode.nodeType === NodeEndCheck.nodeTypeStatic) {
		noticeDialog('成绩完成检测 节点不能作为输出端');
		// Score cannot be sourceNode
		console.warn('createConnection: EndCheck cannot be sourceNode', {
			sourceNode,
			sideInput: from.key,
			targetNode,
			sideOutput: target.key
		});
		if (test) return false;
		return undefined;
	}

	if (sideInput.socket.key !== sideOutput.socket.key) {
		// if ((sideInput.socket.key === SocketLib.sensorOutputFly.key || sideInput.socket.key === SocketLib.sensorOutput.key)
		// 	&& sideOutput.socket.key === SocketLib.normalLogic.key) {
		// 	// allow it
		// 	/* empty */
		//  }else {
		// 	// console.log('sideInput.socket.name', sideInput.socket.name);
		// 	// console.log('sideOutput.socket.name', sideOutput.socket.name);
		// 	noticeDialog(`连接端口类型不匹配: ${sideOutput.socket.name} -> ${sideInput.socket.name}`);
		// 	if (test) return false;
		// 	return undefined;
		// }
		// console.log('sideInput.socket.name', sideInput.socket.name);
		// console.log('sideOutput.socket.name', sideOutput.socket.name);
		noticeDialog(`连接端口类型不匹配: ${sideInput.socket.name} -> ${sideOutput.socket.name}`);
		if (test) return false;
		return undefined;
	}
	// if (sideOutput.socket.key !== SocketLib.sensorOutputFly.key) {
	// 	if (test) return false;
	// 	return undefined;
	// }

	console.log('createConnection: ', {
		from,
		source,
		sourceNode,
		sideInput,
		sourceSocketType: sideOutput.socket.name,
		to,
		target,
		targetNode,
		sideOutput,
		targetSocketType: sideInput.socket.name,
	});

	// if (isNodeCalcType(sourceNode) && isNodeScoreType(targetNode)) {
	// 	if (test) return true;
	// 	return ConnectionScore.create(sourceNode, source.key, targetNode, target.key);
	// }
	// if (isNodeCalcType(sourceNode) && (isNodeCalcType(targetNode) || isNodeSwitchType(targetNode))) {
	// 	if (test) return true;
	// 	return ConnectionCalc.create(sourceNode, source.key, targetNode, target.key);
	// }
	// if (isNodeSensorType(sourceNode) && isNodeLatchType(targetNode)) {
	// 	if (test) return true;
	// 	return ConnectionSensor.create(sourceNode, source.key, targetNode, target.key);
	// }
	// if (isNodeSensorType(sourceNode) && isNodeLatchFlyType(targetNode) && sideInput.socket.key === SocketLib.sensorOutput.key) {
	// 	if (test) return true;
	// 	return ConnectionSensor.create(sourceNode, source.key, targetNode, target.key);
	// }
	// if (isNodeSensorType(sourceNode) && isNodeLatchFlyType(targetNode) && sideInput.socket.key === SocketLib.sensorOutputFly.key) {
	// 	if (test) return true;
	// 	return ConnectionFly.create(sourceNode, source.key, targetNode, target.key);
	// }
	if (ConnectionScore.canConnect(sourceNode, targetNode, sideInput, sideOutput)) {
		if (test) return true;
		return ConnectionScore.create(sourceNode as NodeCalcType, source.key, targetNode as NodeScore, target.key);
	}
	if (ConnectionCalc.canConnect(sourceNode, targetNode, sideInput, sideOutput)) {
		if (test) return true;
		return ConnectionCalc.create(sourceNode as ConnectionCalcInputType, source.key, targetNode as ConnectionCalcOutputType, target.key);
	}
	if (ConnectionFlyConfig.canConnect(sourceNode, targetNode, sideInput, sideOutput)) {
		if (test) return true;
		return ConnectionFlyConfig.create(sourceNode as NodeFlyPort, source.key, targetNode as NodeCollisionCatch, target.key);
	}
	if (ConnectionFly.canConnect(sourceNode, targetNode, sideInput, sideOutput)) {
		if (test) return true;
		return ConnectionFly.create(sourceNode as NodeSensor, source.key, targetNode as NodeCollisionCatch, target.key);
	}
	if (ConnectionSensor.canConnect(sourceNode, targetNode, sideInput, sideOutput)) {
		if (test) return true;
		return ConnectionSensor.create(sourceNode as ConnectionSensorInputType, source.key, targetNode as ConnectionSensorOutputType, target.key);
	}

	console.error('createConnection: not supported connection type', {
		sourceNode,
		sideInput: from.key,
		sourceSocketType: sideOutput.socket.name,
		targetNode,
		sideOutput: target.key,
		targetSocketType: sideInput.socket.name,
	});
	if (test) return false;
	// throw new Error('createConnection: not supported connection type');
	return undefined;
}




