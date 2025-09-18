import {ClassicPreset} from 'rete';

export const SocketLib = {
	normal: new ClassicPreset.Socket('normal'),
	score: new ClassicPreset.Socket('score'),
	sensorOutput: new ClassicPreset.Socket('sensorOutput'),
	sensorOutputFly: new ClassicPreset.Socket('sensorOutputFly'),
} as const;
