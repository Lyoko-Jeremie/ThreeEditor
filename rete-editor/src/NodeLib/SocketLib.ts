import {ClassicPreset} from 'rete';

export class CustomSocket extends ClassicPreset.Socket {
	constructor(public key: string, name: string) {
		super(name);
	}
}

export const SocketLib = {
	normalLogic: new CustomSocket('normalLogic', '计算逻辑'),
	score: new CustomSocket('score', '成绩'),
	flyPort: new CustomSocket('flyPort', '无人机端口'),
	sensorOutput: new CustomSocket('sensorOutput', '传感器碰撞事件'),
	sensorOutputFly: new CustomSocket('sensorOutputFly', '无人机碰撞事件'),
} as const;

export const SocketColorTable = new Map([
	[SocketLib.normalLogic.key, '#FF5722'],
	[SocketLib.score.key, '#4CAF50'],
	[SocketLib.flyPort.key, '#2196F3'],
	[SocketLib.sensorOutput.key, '#9C27B0'],
	[SocketLib.sensorOutputFly.key, '#E91E63'],
] as const);

// 通用碰撞事件
export type SensorOutputCollisionData = {
	// 碰撞 id
	id: number;
	// 是否是碰撞开始事件(否则为结束事件)
	isStart: boolean;
} | undefined;

// 无人机碰撞事件
export type SensorOutputFlyCollisionData = {
	// 碰撞的无人机 keyName
	fly: string;
	// 碰撞 id
	id: number;
	// 是否是碰撞开始事件(否则为结束事件)
	isStart: boolean;
} | undefined;
