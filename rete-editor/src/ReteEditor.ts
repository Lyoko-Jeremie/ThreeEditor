import {ClassicPreset} from 'rete';
import {AreaExtensions, AreaPlugin, NodeView} from 'rete-area-plugin';
import {type LitArea2D, LitPlugin, Presets} from '@retejs/lit-plugin';
import {type MinimapExtra, MinimapPlugin} from "rete-minimap-plugin";
import {type HistoryActions, HistoryExtensions, HistoryPlugin, Presets as PresetsHistory} from "rete-history-plugin";
import {CommentExtensions, CommentPlugin} from "rete-comment-plugin";
import {type ContextMenuExtra, ContextMenuPlugin, Presets as ContextMenuPresets} from "rete-context-menu-plugin";
import {AutoArrangePlugin, Presets as ArrangePresets} from "rete-auto-arrange-plugin";
// import {ScopesPlugin, Presets as ScopesPresets} from 'rete-scopes-plugin';
import {structures} from "rete-structures";
import {html} from "lit";
import {type Schemes} from "./NodeLib/NodeLibType";
import type {ReteEditorInterface} from "./ReteEditorInterface";
import {NodeMenuScore} from "./NodeLib/NodeScore";
import {NodeMenuLatch} from "./NodeLib/NodeLatch";
import {NodeMenuLatchCount} from "./NodeLib/NodeLatchCount";
import {NodeMenuSum} from "./NodeLib/NodeSum";
import {NodeMenuLogic} from "./NodeLib/NodeLogicType";
import {NodeSensor} from "./NodeLib/NodeSensor";
import {type NodeAllType} from "./NodeLib/NodeLib";
import {NodeMenuFly} from "./NodeLib/NodeFlyPort";
import {NodeMenuEventSuppressor} from "./NodeLib/NodeEventSwitch";
import {NodeMenuFlyToSensor} from "./NodeLib/NodeFlyToSensor";
import type {SerializationExportDataType} from "./ReteSerializationTypeDef";
import Swal from 'sweetalert2';
import {type AreaExtra, ReteEditorEngine} from "./ReteEditorEngine";
import {ConnectionCreateColorTable, ConnectionReadableNameTable} from "./NodeLib/ConnectionLib";
import {SocketColorTable, SocketNameTable} from "./NodeLib/SocketLib";
import {NodeMenuCollisionCatch} from "./NodeLib/NodeCollisionCatch";
import {NodeMenuLogicLatch} from "./NodeLib/NodeLogicLatch";
import {NodeMenuEndCheck} from "./NodeLib/NodeEndCheck";
import {NodeMenuToolsLib} from "./NodeLib/NodeToolsLib/NodeMenuToolsLib";
import type {ItemsCollection} from "rete-context-menu-plugin/_types/types";

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

function MenuItemCreateFactory(thisPtr: ReteEditor) {
	const m = ContextMenuPresets.classic.setup([
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
		['碰撞捕获器', [
			...NodeMenuCollisionCatch(thisPtr),
		]],
		['碰撞记录器', [
			...NodeMenuLatch(thisPtr),
			...NodeMenuLatchCount(thisPtr),
			...NodeMenuLogicLatch(thisPtr),
		]],
		['碰撞抑制器', [
			...NodeMenuEventSuppressor(thisPtr),
		]],
		...NodeMenuFly(thisPtr),
		...NodeMenuFlyToSensor(thisPtr),
		NodeMenuSum(thisPtr),
		['逻辑操作', NodeMenuLogic(thisPtr)],
		NodeMenuScore(thisPtr),
		NodeMenuEndCheck(thisPtr),
		['工具节点', NodeMenuToolsLib(thisPtr)],
	]);

	return function MenuItemCreate(context: ("root" | Schemes["Node"]), plugin: ContextMenuPlugin<Schemes>): ItemsCollection {
		console.log('MenuItemCreate context', context);
		const r = m(context, plugin);

		if (context === 'root') {
			// graph context menu
		} else {
			if ('source' in context && 'target' in context) {
				// connection context menu
				const connectionId = context.id;
			} else {
				// node
				const nodeId = context.id;
				if (context.nodeType === NodeSensor.nodeTypeStatic) {
					return {
						searchBar: false,
						list: [],
					};
				}
				// const connections = thisPtr.editor.getConnections().filter(c => {
				// 	return c.source === nodeId || c.target === nodeId
				// })

			}
		}

		r.searchBar = false;
		return r;
	}
}

export class ReteEditor extends ReteEditorEngine implements ReteEditorInterface {
	graph = structures(this.editor);

	render = new LitPlugin<Schemes, AreaExtra>();
	minimap = new MinimapPlugin<Schemes>();
	history = new HistoryPlugin<Schemes, HistoryActions<Schemes>>();
	arrange = new AutoArrangePlugin<Schemes>();
	contextMenu = new ContextMenuPlugin<Schemes>({
		items: MenuItemCreateFactory(this),
	});
	// scopes = new ScopesPlugin<Schemes>({
	// 	// exclude: id => {
	// 	//
	// 	// },
	// });
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

		// this.scopes.addPreset(ScopesPresets.classic.setup())


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
									readableName = SocketNameTable.get(output.socket.key);
								}
							}
						}
						if (d.payload.target) {
							const targetNode = this.editor.getNode(d.payload.target);
							if (targetNode && targetNode.inputs) {
								const input = targetNode.inputs[d.payload.targetInput];
								if (input) {
									strokeColor = SocketColorTable.get(input.socket.key);
									readableName = SocketNameTable.get(input.socket.key);
								}
							}
						}
					} else {
						strokeColor = ConnectionCreateColorTable.get(d.payload.connectionType);
						readableName = ConnectionReadableNameTable.get(d.payload.connectionType);
					}
					return (c) => {
						return html`
							<custom-connection .path=${c.path} .strokeColor=${strokeColor}
											   .txt="${readableName}"></custom-connection>`;
					};
				}
			}
		}));
		this.render.addPreset(Presets.minimap.setup({size: 200}));
		this.render.addPreset((() => {
			const r = Presets.contextMenu.setup({delay: 100,});
			const oldRender = r.render;
			r.render = (context, plugin) => {
				console.log('context.data', context.data);
				context.data.searchBar = false;
				if (context.data.items) {
					for (const item of context.data.items) {
						if (item.key === 'delete') {
							item.label = '删除';
						}
						if (item.key === 'clone') {
							item.label = '复制';
						}
					}
				}
				const d = oldRender(context, plugin);
				return d;
			}
			return r;
		})());

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
		// this.area.use(this.scopes);
		this.area.use(this.arrange);
		this.area.use(this.render);

		// remove this when use rete-scopes-plugin
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
		await this.updateAllNodeSizes();
		await this.arrange.layout({
			options: {
				// 'org.eclipse.elk.layered.crossingMinimization.strategy': 'MEDIAN_LAYER_SWEEP',
				// 'org.eclipse.elk.layered.crossingMinimization.greedySwitch.type': 'TWO_SIDED',
				// 'org.eclipse.elk.layered.crossingMinimization.greedySwitch.activationThreshold': 0,
				// 'org.eclipse.elk.commentBox': true,

				// 'org.eclipse.elk.vertiflex.layerDistance': 500,
				// 'org.eclipse.elk.spacing.edgeNode': 500,
				// 'org.eclipse.elk.spacing.individual': 500,
				// 'org.eclipse.elk.spacing.nodeNode': 50,

				'org.eclipse.elk.layered.spacing.nodeNodeBetweenLayers': 120,
				'org.eclipse.elk.layered.spacing.edgeEdgeBetweenLayers': 50,

			} as any,
		});
		await this.updateMinimap();
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
		console.log('serialization data', d);
		return d;
	}

	async deserialization(data: SerializationExportDataType) {
		if (this.versionSerializationExportDataType !== data.version) {
			console.error('version not match', this.versionSerializationExportDataType, data.version);
			Swal.fire({
				text: '此地图中存储的评分逻辑数据与当前编辑器版本不兼容，无法加载.',
				html: `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
                <div class="swal2-error" style="display: block;"></div>
                <div>此地图中存储的评分逻辑数据与当前编辑器版本不兼容，无法加载.</div>
                <div style="font-size: 14px;">存储数据的版本:[${data.version}] . 当前编辑器版本:[${this.versionSerializationExportDataType}]</div>
            </div>
        `,
				icon: 'error',
				showConfirmButton: false,
				showCancelButton: false,
				showCloseButton: false,
			}).catch(console.error);
			return false;
		}

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
