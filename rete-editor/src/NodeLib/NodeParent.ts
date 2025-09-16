import {ClassicPreset} from "rete";
import type {NeedSkipBuffer} from "./OpInterface";

export type SerializationDataType<T extends Record<string, any> = {}> = {
	id: string,
	label: string,
	nodeType: string,
} & T;

export abstract class NodeParent extends ClassicPreset.Node implements NeedSkipBuffer {
	abstract needSkipBuffer: boolean;
	static nodeType: string;

	serialization(): SerializationDataType {
		return {
			id: this.id,
			label: this.label,
			nodeType: '',
		};
	}
}
