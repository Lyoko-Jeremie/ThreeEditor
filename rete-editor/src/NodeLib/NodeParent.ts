import {ClassicPreset} from "rete";
import type {NeedSkipBuffer} from "./OpInterface";

export abstract class NodeParent extends ClassicPreset.Node implements NeedSkipBuffer {
	abstract needSkipBuffer: boolean;
	abstract nodeType: string;

	serialization() {
		return {
			id: this.id,
			label: this.label,
			nodeType: this.nodeType,
		};
	}
}
