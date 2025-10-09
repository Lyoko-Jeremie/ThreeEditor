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
	[SocketLib.score.key, '#ff9d9d'],
	[SocketLib.flyPort.key, '#2196F3'],
	[SocketLib.sensorOutput.key, '#9C27B0'],
	[SocketLib.sensorOutputFly.key, '#E91E63'],
] as const);

export const SocketNameTable = new Map([
	[SocketLib.normalLogic.key, SocketLib.normalLogic.name],
	[SocketLib.score.key, SocketLib.score.name],
	[SocketLib.flyPort.key, SocketLib.flyPort.name],
	[SocketLib.sensorOutput.key, SocketLib.sensorOutput.name],
	[SocketLib.sensorOutputFly.key, SocketLib.sensorOutputFly.name],
] as const);

// 通用碰撞事件
export type SensorOutputCollisionData = {
	// 碰撞事件 id ， 全局不重复 ， 每次碰撞自增 。 -1 为占位事件 。
	// -1 means invalid data
	id: number;
	// 是否是碰撞开始事件(否则为结束事件)
	isStart: boolean;
} | undefined;

// 无人机碰撞事件
export type SensorOutputFlyCollisionData = {
	// 碰撞的无人机 keyName
	fly: string;
	// 碰撞事件 id
	id: number;
	// 是否是碰撞开始事件(否则为结束事件)
	isStart: boolean;
} | undefined;

// 碰撞边沿变化类型（上升沿下降沿/开始碰撞结束碰撞）
// 0 : 无变化
// 1 : 上升沿/开始碰撞
// 2 : 下降沿/结束碰撞
export type CollisionEdgeType = 0 | 1 | 2;
