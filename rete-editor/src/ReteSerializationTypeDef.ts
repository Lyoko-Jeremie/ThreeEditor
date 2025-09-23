export type ConnectionSerializationDataType<T extends Record<string, any> = {}> = {
	id: string,
	source: string,
	sourceOutput: string,
	target: string,
	targetInput: string,
	connectionType: string,
} & T;


export type NodeSerializationDataType<T extends Record<string, any> = {}> = {
	id: string,
	labelName: string,
	nodeTypeStatic: string,
} & T;


export type SerializationExportDataType = {
	version: number,
	nodes: NodeSerializationDataType[],
	connections: ConnectionSerializationDataType[],
	position: { id: string, x: number, y: number }[],
}

