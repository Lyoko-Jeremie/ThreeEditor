import {ClassicPreset, NodeEditor} from 'rete';
import {AreaExtensions, AreaPlugin, NodeView} from 'rete-area-plugin';
import {ClassicFlow, ConnectionPlugin, getSourceTarget} from 'rete-connection-plugin';
import {type LitArea2D, LitPlugin, Presets} from '@retejs/lit-plugin';
import {type MinimapExtra, MinimapPlugin} from "rete-minimap-plugin";
import {type HistoryActions, HistoryExtensions, HistoryPlugin, Presets as PresetsHistory} from "rete-history-plugin";
// import {CommentPlugin, CommentExtensions} from "rete-comment-plugin";
import {type ContextMenuExtra, ContextMenuPlugin, Presets as ContextMenuPresets} from "rete-context-menu-plugin";
import {AutoArrangePlugin, Presets as ArrangePresets} from "rete-auto-arrange-plugin";
import {DataflowEngine} from "rete-engine";
import {structures} from "rete-structures";
import {html} from "lit";
import {type ConnectionType, type NodeAllType, type Schemes} from "./NodeLib/NodeLibType";
import type {ReteEditorInterface} from "./ReteEditorInterface";
import {NodeMenuScore, NodeScore} from "./NodeLib/NodeScore";
import {NodeMenuLatch} from "./NodeLib/NodeLatch";
import {NodeMenuLatchCount} from "./NodeLib/NodeLatchCount";
import {NodeMenuSum} from "./NodeLib/NodeSum";
import {NodeMenuLogic} from "./NodeLib/NodeLogicType";
import {NodeSensor} from "./NodeLib/NodeSensor";
import {NodeParent, type NodeSerializationDataType} from "./NodeLib/NodeParent";
import {NodeCreateTable} from "./NodeLib/NodeLib";
import {ConnectionCreateTable, type ConnectionSerializationDataType, createConnection} from "./NodeLib/ConnectionLib";

export {
	ClassicPreset,
};

type AreaExtra =
	LitArea2D<Schemes>
	| MinimapExtra
	| ContextMenuExtra
	;

export function runLater<T extends any = void>(f: () => T | Promise<T>, timeout = 0) {
	const re = Promise.withResolvers<T>();
	setTimeout(() => {
		try {
			const r = f();
			re.resolve(r);
		} catch (e) {
			re.reject(e);
		}
	}, timeout);
	re.promise.finally(() => (void 0));	// do nothing . only to avoid unhandled rejection error
	return re.promise;
}

export class ReteEditor implements ReteEditorInterface {
	engine = new DataflowEngine<Schemes>();
	editor = new NodeEditor<Schemes>();

	graph = structures(this.editor);

	connection = new ConnectionPlugin<Schemes, AreaExtra>();
	// socket = new ClassicPreset.Socket("socket");

	render = new LitPlugin<Schemes, AreaExtra>();
	minimap = new MinimapPlugin<Schemes>();
	history = new HistoryPlugin<Schemes, HistoryActions<Schemes>>();
	arrange = new AutoArrangePlugin<Schemes>();
	contextMenu = new ContextMenuPlugin<Schemes>({
		items: ContextMenuPresets.classic.setup([
			// ["re layout", async () => {
			// 	await this.reLayout();
			// }],
			// ["Node", async () => {
			// 	return Swal.fire({
			// 		title: 'New name',
			// 		input: 'text',
			// 		inputValue: '',
			// 		// showCancelButton: true,
			// 		confirmButtonText: 'Ok',
			// 		// cancelButtonText: 'Cancel',
			// 	}).then((result) => {
			// 		const n = new Node(result.value, 'node-' + Math.random().toString(36).slice(2, 7));
			// 		n.addControl(result.value, new ClassicPreset.InputControl("text", {initial: result.value}));
			// 		n.addOutput(result.value, new ClassicPreset.Output(this.socket, undefined, true));
			// 		runLater(async () => {
			// 			await this.updateOneNodeSize(n);
			// 			this.updateMinimap();
			// 		}, 50);
			// 		return n;
			// 	});
			// }],
			// ["NodeA", () => new NodeA(socket)],
			// ["NodeB", () => new NodeB(socket)],
			['碰撞记录器', [
				...NodeMenuLatch(this),
				...NodeMenuLatchCount(this),
			]],
			NodeMenuSum(this),
			['逻辑操作', NodeMenuLogic(this)],
			NodeMenuScore(this),
		])
	});
	area?: AreaPlugin<Schemes, AreaExtra>;

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

	async initGraph(container: HTMLElement) {
		this.area = new AreaPlugin<Schemes, AreaExtra>(container);

		AreaExtensions.selectableNodes(this.area, AreaExtensions.selector(), {
			accumulating: AreaExtensions.accumulateOnCtrl(),
		});

		this.arrange.addPreset(ArrangePresets.classic.setup());

		// this.render.addPreset(Presets.classic.setup());
		this.render.addPreset(Presets.classic.setup({
			customize: {
				control(context) {
					console.log('control context', context);
					if ((context.payload as any).isCustomNumberInput) {
						const {payload} = context;

						return () => html`
							<custom-number-input .data=${payload}></custom-number-input>`;
					}
					// if (context.payload instanceof ClassicPreset.InputControl) { // don't forget to explicitly specify the built-in <rete-control>
					// 	return () => html`<rete-control .data=${context.payload}></rete-control>`;
					// }
					return () => html`
						<rete-control .data=${context.payload}></rete-control>`;
				}
			}
		}));
		this.render.addPreset(Presets.minimap.setup({size: 200}));
		this.render.addPreset(Presets.contextMenu.setup());

		this.history.addPreset(PresetsHistory.classic.setup())
		HistoryExtensions.keyboard(this.history);

		this.editor.use(this.area);

		this.area.use(this.history);
		this.area.use(this.minimap);
		// this.area.use(this.comment);
		this.area.use(this.contextMenu);
		this.area.use(this.arrange);
		this.area.use(this.render);

		AreaExtensions.simpleNodesOrder(this.area);

		this.area.use(this.connection);
	}

	async updateAllNodeSizes() {
		if (!this.area) {
			return;
		}
		const viewsElements = ((this.area as any).elements as {
			viewsElements: Map<string, HTMLDivElement>,
			views: WeakMap<HTMLDivElement, { type: string, element: HTMLElement, payload: any }>
		}).viewsElements;
		// console.log('viewsElements', viewsElements);
		for (const [id, el] of viewsElements) {
			// console.log('el', id, el, el.clientHeight);
			if (id.startsWith('node_')) {
				const nodeId = id.replace('node_', '');
				const node = this.editor.getNodes().find(n => n.id === nodeId);
				if (node) {
					// console.log('node', node, node.height);
					node.height = el.clientHeight;
					// console.log('node.height', node.height);
				}
			}
		}
		// area.update();
		// console.log('minimap', this.minimap);
		// (this.minimap as any).render();
		//
		// await this.arrange.layout();
		// console.log('arrange', this.arrange);

		// await this.updateMinimap();
		// await this.reLayout();
	}

	async updateMinimap() {
		if (!this.area) {
			return;
		}
		// console.log('minimap', this.minimap);
		await (this.minimap as any).render();
	}

	async reLayout() {
		await this.arrange.layout({
			// options: {
			// 	'org.eclipse.elk.layered.crossingMinimization.strategy': 'MEDIAN_LAYER_SWEEP',
			// 	'org.eclipse.elk.layered.crossingMinimization.greedySwitch.type': 'TWO_SIDED',
			// 	'org.eclipse.elk.layered.crossingMinimization.greedySwitch.activationThreshold': 0,
			// } as any,
		});
		// console.log('arrange', this.arrange);
	}

	async updateOneNodeSize(node: NodeAllType) {
		if (!this.area) {
			return;
		}
		const viewsElements = ((this.area as any).elements as {
			viewsElements: Map<string, HTMLDivElement>,
			views: WeakMap<HTMLDivElement, { type: string, element: HTMLElement, payload: any }>
		}).viewsElements;
		// console.log('viewsElements', viewsElements);

		const el = viewsElements.get('node_' + node.id);
		if (el) {
			// console.log('el', node.id, el, el.clientHeight);
			node.height = el.clientHeight;
			// console.log('node.height', node.height);
		}

		// console.log('minimap', this.minimap);
		// (this.minimap as any).render();

		// await this.arrange.layout();
		// console.log('arrange', this.arrange);
	}

	async reZoom() {
		if (!this.area) {
			return;
		}
		await AreaExtensions.zoomAt(this.area as any, this.editor.getNodes());
	}

	async destroy() {
		await this.editor.clear();
		this.area?.destroy();
	}

	async addNodeSensor(name: string, id: string) {
		const n = new NodeSensor(name, id);
		await this.editor.addNode(n);
		await this.updateOneNodeSize(n);
		await this.updateMinimap();
	}

	async removeNodeSensor(id: string) {
		// this.graph.
		const node = this.editor.getNode(id);
		if (node) {
			await this.removeNodeConnection(node.id);
			await this.editor.removeNode(node.id);
			await this.updateMinimap();
		}
	}

	async removeNodeConnection(nodeId: string) {
		const connections = this.editor.getConnections().filter(c => c.source === nodeId || c.target === nodeId);
		for (const conn of connections) {
			await this.editor.removeConnection(conn.id);
		}
	}

	async syncNodeSensor(data: { id: string, name: string }[]) {
		const existingSensors = this.editor.getNodes().filter(n => NodeSensor.isNodeSensor(n));
		const existingSensorsMap = new Map(existingSensors.map(n => [n.id, n as NodeSensor]));

		for (const sensorData of data) {
			const existingSensor = existingSensorsMap.get(sensorData.id);
			if (existingSensor) {
				// Update name if changed
				if (existingSensor.labelName !== sensorData.name) {
					existingSensor.labelName = sensorData.name;
					// await this.updateOneNodeSize(existingSensor);
				}
				existingSensorsMap.delete(sensorData.id); // Remove from map to track which sensors remain
			} else {
				// Add new sensor
				const n = new NodeSensor(sensorData.name, sensorData.id);
				await this.editor.addNode(n);
			}
		}

		// Remove sensors that are no longer present
		for (const [id, sensorNode] of existingSensorsMap) {
			await this.removeNodeConnection(sensorNode.id);
			await this.editor.removeNode(sensorNode.id);
		}

		await this.updateAllNodeSizes();
		await this.updateMinimap();
		// await this.reLayout();
		await this.reZoom();
	}

	versionSerializationExportDataType: number = 1;

	async serialization(): Promise<SerializationExportDataType> {
		// TODO
		const nodes = this.editor.getNodes();
		const nodeViews = this.area?.nodeViews || new Map<string, NodeView>();
		const connections = this.editor.getConnections();
		return {
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
			position: nodes.map(T => {
				const p = nodeViews.get(T.id)?.position;
				if (!p) {
					console.error('node position not found', T.id);
					return undefined;
				}
				return {
					id: T.id,
					x: p.x,
					y: p.y,
				};
			}).filter(T => !!T),
		};
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

		const connectionCreateTable = new Map(ConnectionCreateTable);
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

		for (const n of nodeList.values()) {
			await this.editor.addNode(n as NodeAllType);
		}

		for (const c of connectionList.values()) {
			await this.editor.addConnection(c);
		}

		await this.updateAllNodeSizes();

		if (this.area) {
			for (const p of data.position) {
				const node = this.editor.getNode(p.id);
				if (!node) {
					console.error('node for position not found', p);
					continue;
				}
				await this.area?.translate(p.id, {x: p.x, y: p.y});
			}
		}

		await this.updateMinimap();
		// await this.reLayout();
		await this.reZoom();
	}

	getNode(nodeId: string): NodeAllType | undefined {
		return this.editor.getNode(nodeId) as NodeAllType | undefined;
	}

	async engineFetchResultData(): Promise<{ [nodeId: string]: ReturnType<NodeScore['data']> }> {
		const scoreNodes = this.editor.getNodes().filter(n => NodeScore.isNodeScore(n));

		this.engine.reset();

		const result: { [nodeId: string]: ReturnType<NodeScore['data']> } = {};
		for (const n of scoreNodes) {
			result[n.id] = await this.engine.fetch(n);
		}
		return result;
	}

}

export type SerializationExportDataType = {
	version: number,
	nodes: NodeSerializationDataType[],
	connections: ConnectionSerializationDataType[],
	position: { id: string, x: number, y: number }[],
}
