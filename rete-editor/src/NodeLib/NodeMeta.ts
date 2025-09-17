import type {NodeSerializationDataType} from "./NodeParent";

// NodeMeta.ts
export interface NodeMeta {
	nodeTypeStatic: string;
	nodeType: string;
	width: number;
	height: number;

	serialization(): NodeSerializationDataType;
}

export interface NodeMetaStatic<T> {
	new(...args: any[]): T;

	nodeTypeStatic: string;

	deserialize(data: NodeSerializationDataType): T;
}

// NodeDecorator.ts
export function NodeDecorator<T extends { new(...args: any[]): {} }>(
	options?: {
		nodeTypeStatic?: string;
		nodeType?: string;
		width?: number;
		height?: number;
		serializeFn?: (instance: any) => NodeSerializationDataType;
		deserializeFn?: (data: NodeSerializationDataType) => any;
	}
) {
	return function <U extends T>(constructor: U) {
		const nodeTypeStatic = options?.nodeTypeStatic ?? constructor.name;
		const nodeType = options?.nodeType ?? constructor.name;
		const width = options?.width ?? 200;
		// const height = options?.height ?? 100;

		return class extends constructor {
			static nodeTypeStatic = nodeTypeStatic;
			nodeType = nodeType;
			width = width;
			height!: number;

			serialization() {
				return options?.serializeFn
					? options.serializeFn(this)
					: {...this};
			}

			static deserialize(data: NodeSerializationDataType) {
				return options?.deserializeFn
					? options.deserializeFn(data)
					: new (constructor as any)(data.labelName, data.id);
			}
		} as unknown as U;
	};
}
