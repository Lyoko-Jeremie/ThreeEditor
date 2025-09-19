import {ClassicPreset} from "rete";
import type {NeedSkipBuffer} from "./OpInterface";
import {runLater} from "./runLater";
import type {NodeBase} from "rete/_types/types";

export type NodeSerializationDataType<T extends Record<string, any> = {}> = {
	id: string,
	labelName: string,
	nodeTypeStatic: string,
} & T;

export abstract class NodeParent extends ClassicPreset.Node implements NeedSkipBuffer, NodeBase {
	declare id: string;

	abstract needSkipBuffer: boolean;
	static nodeTypeStatic: string;
	abstract nodeType: string;
	static width: number;
	static height: number;

	// needSkipBuffer!: boolean;
	// static nodeTypeStatic: string;
	// nodeType!: string;
	// width!: number;
	// height!: number;

	abstract _labelPrefix: string;
	_labelName!: string;

	constructor(label: string) {
		super(label);
	}

	set labelName(labelName: string) {
		this._labelName = labelName;
		this.label = this._labelPrefix + labelName;
	}

	get labelName() {
		return this._labelName;
	}

	serialization(): NodeSerializationDataType {
		return {
			id: this.id,
			labelName: this.labelName,
			nodeTypeStatic: '',
		};
	}
}
