import {NodeEditor, ClassicPreset} from 'rete';
import {AreaPlugin, AreaExtensions} from 'rete-area-plugin';
import {ConnectionPlugin, Presets as ConnectionPresets,} from 'rete-connection-plugin';
import {LitPlugin, Presets, type LitArea2D} from '@retejs/lit-plugin';
import {type MinimapExtra, MinimapPlugin} from "rete-minimap-plugin";
import {HistoryPlugin, type HistoryActions, Presets as PresetsHistory, HistoryExtensions} from "rete-history-plugin";
// import {CommentPlugin, CommentExtensions} from "rete-comment-plugin";
import {type ContextMenuExtra, ContextMenuPlugin, Presets as ContextMenuPresets} from "rete-context-menu-plugin";
import {AutoArrangePlugin, Presets as ArrangePresets} from "rete-auto-arrange-plugin";
import {DataflowEngine} from "rete-engine";
import {structures} from "rete-structures";
import Swal from 'sweetalert2';
import {html, LitElement} from "lit";
import type {NodeAllType, Schemes} from "./NodeLib/ConnectionLib";
import type {ReteEditorInterface} from "./ReteEditorInterface";
import {NodeMenuScore} from "./NodeLib/NodeScore";
import {NodeMenuLatch} from "./NodeLib/NodeLatch";
import {NodeMenuLatchCount} from "./NodeLib/NodeLatchCount";
import {NodeMenuSum} from "./NodeLib/NodeSum";
import {NodeMenuLogic} from "./NodeLib/NodeLogicType";
import {NodeSensor} from "./NodeLib/NodeSensor";

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

// input patch
// @customElement('custom-number-input')
export class CustomNumberInput extends LitElement {
	// @property({type: Object}) accessor data: {
	// 	initial: number,
	// 	change: (v: number) => any,
	// 	isCustomNumberInput: boolean,
	// } | null = null;
	static properties = {
		data: {
			type: Object,
		},
	};

	declare data: {
		initial: number,
		change: (v: number) => any,
		isCustomNumberInput: boolean,
	} | null;

	render() {
		if (!this.data) return html``;
		const d: any = this.data;

		return html`
			<input
				type="number"
				.value="${d.initial}"
				?readonly="${d.readonly}"
				@input="${this.handleInput}"
				@pointerdown=${(e: MouseEvent) => e.stopPropagation()}
				@doubleclick=${(e: MouseEvent) => e.stopPropagation()}
				@click=${(e: MouseEvent) => e.stopPropagation()}
				@dblclick=${(e: MouseEvent) => e.stopPropagation()}
			/>
		`;
	}

	handleInput(e: InputEvent) {
		// console.log('handleInput', e, this.data);
		if (!this.data) return;
		const d: any = this.data;

		const target = e.target as HTMLInputElement;
		const val = +target.value;

		d.change(val);
	}
}

customElements.define("custom-number-input", CustomNumberInput);

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
			NodeMenuLatch(this),
			NodeMenuLatchCount(this),
			NodeMenuSum(this),
			['逻辑操作', NodeMenuLogic(this)],
			NodeMenuScore(this),
		])
	});
	area?: AreaPlugin<Schemes, AreaExtra>;

	async initEngine() {
		this.editor.use(this.engine);
		// engine.fetch()
		this.connection.addPreset(ConnectionPresets.classic.setup());
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

		this.updateMinimap();
		await this.reLayout();
	}

	updateMinimap() {
		// console.log('minimap', this.minimap);
		(this.minimap as any).render();
	}

	async reLayout() {
		await this.arrange.layout();
		// console.log('arrange', this.arrange);
	}

	async updateOneNodeSize(node: NodeAllType) {
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
		this.updateMinimap();
	}

	async removeNodeSensor(id: string) {
		// this.graph.
		const node = this.editor.getNode(id);
		if (node) {
			node.inputs;
			node.outputs;
			await this.editor.removeNode(node.id);
			this.updateMinimap();
		}
	}

	async serialization(): Promise<Record<string, any>> {
		// TODO
		const nodes = this.editor.getNodes();
		const conn = this.editor.getConnections();
		return {};
	}

	async deserialization(data?: Record<string, any>) {
		// TODO
	}

}
