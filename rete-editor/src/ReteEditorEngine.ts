import {DataflowEngine} from "rete-engine";
import type {ConnectionType, Schemes} from "./NodeLib/NodeLibType";
import {NodeEditor} from "rete";
import {ClassicFlow, ConnectionPlugin, getSourceTarget} from "rete-connection-plugin";
import {type LitArea2D} from "@retejs/lit-plugin";
import {type MinimapExtra} from "rete-minimap-plugin";
import {type ContextMenuExtra} from "rete-context-menu-plugin";
import {NodeScore} from "./NodeLib/NodeScore";
import {ConnectionCreateTable, createConnection} from "./NodeLib/ConnectionLib";
import {type NodeAllType, NodeCreateTable} from "./NodeLib/NodeLib";
import type {SerializationExportDataType} from "./ReteSerializationTypeDef";
import {NodeParent} from "./NodeLib/NodeParent";

export type AreaExtra =
	LitArea2D<Schemes>
	| MinimapExtra
	| ContextMenuExtra
	;

const VERSION_SERIALIZATION_EXPORT_DATA_TYPE = 1 as const;

export class ReteEditorEngine {
	engine = new DataflowEngine<Schemes>();
	editor = new NodeEditor<Schemes>();

	connection = new ConnectionPlugin<Schemes, AreaExtra>();

	// socket = new ClassicPreset.Socket("socket");

	async initEngine() {
		this.editor.use(this.engine);
		// engine.fetch()
		// this.connection.addPreset(ConnectionPresets.classic.setup());
		// this.connection.addPreset(({nodeId, side, key}) => {
		// 	if (isReadonly(nodeId, side, key)) return undefined
		// 	if (usesBidirect(nodeId, side, key)) return new BidirectFlow()
		// 	return new ClassicFlow()
		// })
		this.connection.addPreset(() => new ClassicFlow({
			canMakeConnection: (from, to) => {
				console.log('canMakeConnection', {from, to});
				const [source, target] = getSourceTarget(from, to) || [null, null];

				if (source && target) {
					// const sourceNode = this.editor.getNode(source.nodeId);
					// const targetNode = this.editor.getNode(target.nodeId);
					// if (!sourceNode || !targetNode) return false;
					// sourceNode.inputs[source.key]; // to check key valid
					// targetNode.inputs[target.key]; // to check key valid
					const isCanMakeConnection = createConnection(
						this.editor,
						from,
						to,
						true,
					);
					console.log('canMakeConnection', isCanMakeConnection);
					return isCanMakeConnection;
				}
				return false;
			},
			makeConnection: (from, to, context) => {
				console.log('makeConnection', {from, to, context});
				const [source, target] = getSourceTarget(from, to) || [null, null];
				const {editor} = context;

				if (source && target) {
					// const sourceNode = editor.getNode(source.nodeId);
					// const targetNode = editor.getNode(target.nodeId);
					// if (!sourceNode || !targetNode) return undefined;
					const connection = createConnection(
						this.editor,
						from,
						to,
						false,
					);
					console.log('makeConnection created', connection);
					if (!connection) {
						console.error('makeConnection: not supported connection type', {from, to});
						return undefined;
					}
					editor.addConnection(connection);
					return true; // ensure that the connection has been successfully added
				}
				return undefined;
			}
		}))
	}

	async destroy() {
		await this.editor.clear();
		// this.area?.destroy();
	}

	versionSerializationExportDataType: number = VERSION_SERIALIZATION_EXPORT_DATA_TYPE;

	async serialization(): Promise<SerializationExportDataType> {
		const nodes = this.editor.getNodes();
		const connections = this.editor.getConnections();
		const r = {
			version: this.versionSerializationExportDataType,
			nodes: nodes.map(T => T.serialization()),
			connections: connections.map(T => {
				return {
					id: T.id,
					source: T.source,
					sourceOutput: T.sourceOutput,
					target: T.target,
					targetInput: T.targetInput,
					connectionType: T.connectionType,
				};
			}),
			position: [],
		};
		console.log('serialization', r);
		return r;
	}

	async deserialization(data: SerializationExportDataType) {
		if (this.versionSerializationExportDataType < data.version) {
			console.error('version not match', this.versionSerializationExportDataType, data.version);
			return false;
		}
		await this.editor.clear();

		const createTable = new Map(NodeCreateTable);
		const nodeList = new Map<string, NodeParent>();
		for (const nodeData of data.nodes) {
			const c = createTable.get(nodeData.nodeTypeStatic);
			if (!c) {
				console.error('nodeTypeStatic not found', nodeData.nodeTypeStatic, nodeData);
				return false;
			}
			try {
				const node = c(nodeData);
				nodeList.set(node.id, node);
			} catch (e) {
				console.error('nodeTypeStatic create error', nodeData.nodeTypeStatic, nodeData, e);
				return false;
			}
		}

		const connectionCreateTable = ConnectionCreateTable;
		const connectionList = new Map<string, ConnectionType>();
		for (const c of data.connections) {
			const sourceNode = nodeList.get(c.source) as NodeAllType | undefined;
			const targetNode = nodeList.get(c.target) as NodeAllType | undefined;
			if (!sourceNode) {
				console.error('connection source node not found', c);
				return false;
			}
			if (!targetNode) {
				console.error('connection target node not found', c);
				return false;
			}
			const cc = connectionCreateTable.get(c.connectionType);
			if (!cc) {
				console.error('connectionTypeStatic not found', c.connectionType, c);
				return false;
			}
			try {
				const conn = cc(
					c,
					sourceNode,
					targetNode,
				);
				connectionList.set(conn.id, conn);
			} catch (e) {
				console.error('connectionTypeStatic create error', c.connectionType, c, e);
				return false;
			}
		}

		for (const n of Array.from(nodeList.values())) {
			await this.editor.addNode(n as NodeAllType);
		}

		for (const c of Array.from(connectionList.values())) {
			await this.editor.addConnection(c);
		}

		return true;
	}

	getNode(nodeId: string): NodeAllType | undefined {
		return this.editor.getNode(nodeId) as NodeAllType | undefined;
	}

	async engineFetchScoreResultData(): Promise<{ [nodeId: string]: ReturnType<NodeScore['data']> }> {
		const scoreNodes = this.editor.getNodes().filter(n => NodeScore.isNodeScore(n));

		this.engine.reset();

		const result: { [nodeId: string]: ReturnType<NodeScore['data']> } = {};
		for (const n of scoreNodes) {
			result[n.id] = await this.engine.fetch(n);
		}
		return result;
	}

}
