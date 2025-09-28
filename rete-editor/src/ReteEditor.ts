import {ClassicPreset, NodeEditor} from 'rete';
import {AreaExtensions, AreaPlugin, NodeView} from 'rete-area-plugin';
import {type LitArea2D, LitPlugin, Presets} from '@retejs/lit-plugin';
import {type MinimapExtra, MinimapPlugin} from "rete-minimap-plugin";
import {type HistoryActions, HistoryExtensions, HistoryPlugin, Presets as PresetsHistory} from "rete-history-plugin";
import {CommentExtensions, CommentPlugin} from "rete-comment-plugin";
import {type ContextMenuExtra, ContextMenuPlugin, Presets as ContextMenuPresets} from "rete-context-menu-plugin";
import {AutoArrangePlugin, Presets as ArrangePresets} from "rete-auto-arrange-plugin";
import {structures} from "rete-structures";
import {html} from "lit";
import {type ConnectionType, type Schemes} from "./NodeLib/NodeLibType";
import type {ReteEditorInterface} from "./ReteEditorInterface";
import {NodeMenuScore, NodeScore} from "./NodeLib/NodeScore";
import {NodeMenuLatch} from "./NodeLib/NodeLatch";
import {NodeMenuLatchCount} from "./NodeLib/NodeLatchCount";
import {NodeMenuSum} from "./NodeLib/NodeSum";
import {NodeMenuLogic} from "./NodeLib/NodeLogicType";
import {NodeSensor} from "./NodeLib/NodeSensor";
import {NodeParent} from "./NodeLib/NodeParent";
import {type NodeAllType, NodeCreateTable} from "./NodeLib/NodeLib";
import {NodeMenuFly} from "./NodeLib/NodeFlyPort";
import {NodeMenuEventSuppressor} from "./NodeLib/NodeEventSwitch";
import {NodeMenuFlyToSensor} from "./NodeLib/NodeFlyToSensor";
import type {SerializationExportDataType} from "./ReteSerializationTypeDef";
import Swal from 'sweetalert2';
import {type AreaExtra, ReteEditorEngine} from "./ReteEditorEngine";
import {ConnectionCreateColorTable, ConnectionCreateTable, ConnectionReadableNameTable} from "./NodeLib/ConnectionLib";
import {SocketColorTable} from "./NodeLib/SocketLib";

export {
	ClassicPreset,
};

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

export class ReteEditor extends ReteEditorEngine implements ReteEditorInterface {
	graph = structures(this.editor);

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
			['碰撞抑制器', [
				...NodeMenuEventSuppressor(this),
			]],
			...NodeMenuFly(this),
			...NodeMenuFlyToSensor(this),
			NodeMenuSum(this),
			['逻辑操作', NodeMenuLogic(this)],
			NodeMenuScore(this),
		])
	});
	area?: AreaPlugin<Schemes, AreaExtra>;

	constructor() {
		super();
	}

	async initGraph(container: HTMLElement) {
		this.area = new AreaPlugin<Schemes, AreaExtra>(container);

		// this.area.addPipe(context => {
		// 	if (context.type == 'connectioncreate') {
		// 		(context.data as any).editor = this.editor;
		// 		(context.data as any).contextData = context.data;
		// 		console.log('connectioncreate context', context);
		// 	}
		// 	return context
		// });

		AreaExtensions.selectableNodes(this.area, AreaExtensions.selector(), {
			accumulating: AreaExtensions.accumulateOnCtrl(),
		});

		this.arrange.addPreset(ArrangePresets.classic.setup());

		// this.render.addPreset(Presets.classic.setup());
		console.log('Presets.classic', Presets.classic);
		this.render.addPreset(Presets.classic.setup({
			customize: {
				control(context) {
					console.log('control context', context);
					if ((context.payload as any).isCustomNumberInput) {
						const {payload} = context;

						return () => html`
							<custom-number-input .data=${payload}></custom-number-input>`;
					}
					if ((context.payload as any).isCustomTextInput) {
						const {payload} = context;

						return () => html`
							<custom-text-input .data=${payload}></custom-text-input>`;
					}
					// if (context.payload instanceof ClassicPreset.InputControl) { // don't forget to explicitly specify the built-in <rete-control>
					// 	return () => html`<rete-control .data=${context.payload}></rete-control>`;
					// }
					return () => html`
						<rete-control .data=${context.payload}></rete-control>`;
				},
				connection: (d) => {
					let strokeColor: string | undefined;
					let readableName: string | undefined;
					if ((d.payload as any).isPseudo) {
						if (d.payload.source) {
							const sourceNode = this.editor.getNode(d.payload.source);
							if (sourceNode && sourceNode.outputs) {
								const output = sourceNode.outputs[d.payload.sourceOutput];
								if (output) {
									strokeColor = SocketColorTable.get(output.socket.key);

								}
							}
						}
						if (d.payload.target) {
							const targetNode = this.editor.getNode(d.payload.target);
							if (targetNode && targetNode.inputs) {
								const input = targetNode.inputs[d.payload.targetInput];
								if (input) {
									strokeColor = SocketColorTable.get(input.socket.key);
								}
							}
						}
					} else {
						strokeColor = ConnectionCreateColorTable.get(d.payload.connectionType);
						readableName = ConnectionReadableNameTable.get(d.payload.connectionType);
					}
					return (c) => {
						return html`
							<custom-connection .path=${c.path} .strokeColor=${strokeColor} .txt="${readableName}"></custom-connection>`;
					};
				}
			}
		}));
		this.render.addPreset(Presets.minimap.setup({size: 200}));
		this.render.addPreset(Presets.contextMenu.setup());

		this.history.addPreset(PresetsHistory.classic.setup())
		HistoryExtensions.keyboard(this.history);

		this.editor.use(this.area);


		// const comment = new CommentPlugin<Schemes, AreaExtra>({
		// 	edit: async (comment) => {
		// 		const os = comment.text;
		// 		return Swal.fire({
		// 			title: 'Edit comment',
		// 			input: 'text',
		// 			inputValue: os,
		// 			showCancelButton: true,
		// 			confirmButtonText: 'Save',
		// 			cancelButtonText: 'Cancel',
		// 		}).then((result) => {
		// 			if (result.isConfirmed) {
		// 				return result.value || os;
		// 			}
		// 			return os;
		// 		});
		// 	}
		// });
		//
		// const selector = AreaExtensions.selector();
		// const accumulating = AreaExtensions.accumulateOnCtrl();
		//
		// CommentExtensions.selectable(comment, selector, accumulating);

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
		await super.destroy();
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

	async serialization(): Promise<SerializationExportDataType> {
		const d = await super.serialization();
		const nodes = this.editor.getNodes();
		const nodeViews = this.area?.nodeViews || new Map<string, NodeView>();
		d.position = nodes.map(T => {
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
		}).filter(T => !!T);
		return d;
	}

	async deserialization(data: SerializationExportDataType) {

		const r = await super.deserialization(data);
		if (!r) {
			return false;
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

		return true;
	}

}
