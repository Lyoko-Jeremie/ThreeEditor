import {ClassicPreset} from 'rete';

export const SocketLib = {
	normalLogic: new ClassicPreset.Socket('计算逻辑'),
	score: new ClassicPreset.Socket('成绩'),
	sensorOutput: new ClassicPreset.Socket('传感器碰撞事件'),
	sensorOutputFly: new ClassicPreset.Socket('无人机碰撞事件'),
} as const;
