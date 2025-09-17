import {ClassicPreset} from "rete";
import type {NeedSkipBuffer} from "./OpInterface";

export type SerializationDataType<T extends Record<string, any> = {}> = {
	id: string,
	label: string,
	nodeTypeStatic: string,
} & T;

export abstract class NodeParent extends ClassicPreset.Node implements NeedSkipBuffer {
	abstract needSkipBuffer: boolean;
	static nodeTypeStatic: string;
	abstract nodeType: string;

	serialization(): SerializationDataType {
		return {
			id: this.id,
			label: this.label,
			nodeTypeStatic: '',
		};
	}
}
