import {ClassicPreset} from 'rete';

export const SocketLib = {
	normal: new ClassicPreset.Socket('normal'),
	score: new ClassicPreset.Socket('score'),
	sensorOutput: new ClassicPreset.Socket('sensorOutput'),
} as const;
