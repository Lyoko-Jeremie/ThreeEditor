import * as _ from 'lodash';

export type ConnectionSerializationDataType<T extends Record<string, any> = {}> = {
	id: string,
	source: string,
	sourceOutput: string,
	target: string,
	targetInput: string,
	connectionType: string,
} & T;

export function isConnectionSerializationDataType(obj: any): obj is ConnectionSerializationDataType {
	const o = obj as ConnectionSerializationDataType;
	if (!_.isObject(o)) {
		return false;
	}
	const keys = ['id', 'source', 'sourceOutput', 'target', 'targetInput', 'connectionType'];
	for (const key of keys) {
		if (!_.has(o, key) || !_.isString(_.get(o, key))) {
			return false;
		}
	}
	return true;
}

export type NodeSerializationDataType<T extends Record<string, any> = {}> = {
	id: string,
	labelName: string,
	nodeTypeStatic: string,
} & T;

export function isNodeSerializationDataType(obj: any): obj is NodeSerializationDataType {
	const o = obj as NodeSerializationDataType;
	if (!_.isObject(o)) {
		return false;
	}
	const keys = ['id', 'labelName', 'nodeTypeStatic'];
	for (const key of keys) {
		if (!_.has(o, key) || !_.isString(_.get(o, key))) {
			return false;
		}
	}
	return true;
}

export type SerializationExportDataType = {
	version: number,
	nodes: NodeSerializationDataType[],
	connections: ConnectionSerializationDataType[],
	position: { id: string, x: number, y: number }[],
}

export function isSerializationExportDataType(obj: any): obj is SerializationExportDataType {
	const o = obj as SerializationExportDataType;
	if (!_.isObject(o)) {
		return false;
	}
	if (!_.has(o, 'version') || !_.isNumber(o.version)) {
		return false;
	}
	if (!_.has(o, 'nodes') || !_.isArray(o.nodes) || !o.nodes.every(isNodeSerializationDataType)) {
		return false;
	}
	if (!_.has(o, 'connections') || !_.isArray(o.connections) || !o.connections.every(isConnectionSerializationDataType)) {
		return false;
	}
	if (!_.has(o, 'position') || !_.isArray(o.position)) {
		return false;
	}
	for (const p of o.position) {
		if (!_.isObject(p)) {
			return false;
		}
		if (!_.has(p, 'id') || !_.isString(p.id)) {
			return false;
		}
		if (!_.has(p, 'x') || !_.isNumber(p.x)) {
			return false;
		}
		if (!_.has(p, 'y') || !_.isNumber(p.y)) {
			return false;
		}
	}
	return true;
}

