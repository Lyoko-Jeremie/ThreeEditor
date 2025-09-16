import {NodeEditor, type GetSchemes, ClassicPreset} from 'rete';
import {AreaPlugin, AreaExtensions} from 'rete-area-plugin';
import {
	ConnectionPlugin,
	Presets as ConnectionPresets,
} from 'rete-connection-plugin';
import {LitPlugin, Presets, type LitArea2D} from '@retejs/lit-plugin';
import {type MinimapExtra, MinimapPlugin} from "rete-minimap-plugin";
import {HistoryPlugin, type HistoryActions, Presets as PresetsHistory, HistoryExtensions} from "rete-history-plugin";
// import {CommentPlugin, CommentExtensions} from "rete-comment-plugin";
import {type ContextMenuExtra, ContextMenuPlugin, Presets as ContextMenuPresets} from "rete-context-menu-plugin";
import {AutoArrangePlugin, Presets as ArrangePresets} from "rete-auto-arrange-plugin";
import {DataflowEngine} from "rete-engine";
import Swal from 'sweetalert2';

export {
	ClassicPreset,
}

// import { MyComponent1, MyComponent2 } from './components';

export class Node extends ClassicPreset.Node {
	width = 200;
	height!: number;

	constructor(label: string, id: string) {
		super(label);
		this.id = id;
	}

	data(inputs: { left?: number[]; right?: number[] }): { value: number } {
		const {left, right} = inputs;
		const value = (left && left[0] || 0) + (right && right[0] || 0)

		return {value};
	}
}

class Connection<N extends Node> extends ClassicPreset.Connection<N, N> {
}


type Schemes = GetSchemes<
	Node,
	Connection<Node>
>;
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

export class ReteEditor {
	engine = new DataflowEngine<Schemes>();
	editor = new NodeEditor<Schemes>();

	connection = new ConnectionPlugin<Schemes, AreaExtra>();
	socket = new ClassicPreset.Socket("socket");

	render = new LitPlugin<Schemes, AreaExtra>();
	minimap = new MinimapPlugin<Schemes>();
	history = new HistoryPlugin<Schemes, HistoryActions<Schemes>>();
	arrange = new AutoArrangePlugin<Schemes>();
	contextMenu = new ContextMenuPlugin<Schemes>({
		items: ContextMenuPresets.classic.setup([
			// ["re layout", async () => {
			// 	await this.reLayout();
			// }],
			["Node", async () => {
				return Swal.fire({
					title: 'New name',
					input: 'text',
					inputValue: '',
					// showCancelButton: true,
					confirmButtonText: 'Ok',
					// cancelButtonText: 'Cancel',
				}).then((result) => {
					const n = new Node(result.value, 'node-' + Math.random().toString(36).slice(2, 7));
					n.addControl(result.value, new ClassicPreset.InputControl("text", {initial: result.value}));
					n.addOutput(result.value, new ClassicPreset.Output(this.socket, undefined, true));
					runLater(async () => {
						await this.updateOneNodeSize(n);
						this.updateMinimap();
					}, 50);
					return n;
				});
			}],
			// ["NodeA", () => new NodeA(socket)],
			// ["NodeB", () => new NodeB(socket)]
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

		this.render.addPreset(Presets.classic.setup());
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

	async updateOneNodeSize(node: Node) {
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
		//
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

}
