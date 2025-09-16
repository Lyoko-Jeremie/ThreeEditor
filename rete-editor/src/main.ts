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

// import { MyComponent1, MyComponent2 } from './components';

class Node extends ClassicPreset.Node {
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

async function initializeReteEditor(container: HTMLElement) {
	const socket = new ClassicPreset.Socket("socket");


	const engine = new DataflowEngine<Schemes>();

	const area = new AreaPlugin<Schemes, AreaExtra>(container);
	const editor = new NodeEditor<Schemes>();
	const connection = new ConnectionPlugin<Schemes, AreaExtra>();
	const render = new LitPlugin<Schemes, AreaExtra>();

	AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
		accumulating: AreaExtensions.accumulateOnCtrl(),
	});

	const minimap = new MinimapPlugin<Schemes>();

	const history = new HistoryPlugin<Schemes, HistoryActions<Schemes>>();

	const arrange = new AutoArrangePlugin<Schemes>();

	arrange.addPreset(ArrangePresets.classic.setup());

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

	const contextMenu = new ContextMenuPlugin<Schemes>({
		items: ContextMenuPresets.classic.setup([
			["Node", async () => {
				return Swal.fire({
					title: 'New name',
					input: 'text',
					inputValue: '',
					showCancelButton: true,
					confirmButtonText: 'Save',
					cancelButtonText: 'Cancel',
				}).then((result) => {
					return new Node(result.value, 'node-' + Math.random().toString(36).slice(2, 7));
				});
			}],
			// ["NodeA", () => new NodeA(socket)],
			// ["NodeB", () => new NodeB(socket)]
		])
	});


	render.addPreset(Presets.classic.setup());
	render.addPreset(Presets.minimap.setup({size: 200}));
	render.addPreset(Presets.contextMenu.setup());

	connection.addPreset(ConnectionPresets.classic.setup());

	history.addPreset(PresetsHistory.classic.setup())
	HistoryExtensions.keyboard(history);

	editor.use(area);

	editor.use(engine);
	// engine.fetch()

	area.use(connection);
	area.use(render);
	area.use(minimap);
	area.use(history);
	// area.use(comment);
	area.use(contextMenu);
	area.use(arrange);

	// const selector = AreaExtensions.selector();
	// const accumulating = AreaExtensions.accumulateOnCtrl();
	//
	// CommentExtensions.selectable(comment, selector, accumulating);

	AreaExtensions.simpleNodesOrder(area);

	const a = new Node("A", 'xxxx-node-id-aaa');
	a.addControl("a", new ClassicPreset.InputControl("text", {initial: "a"}));
	a.addOutput("a", new ClassicPreset.Output(socket));
	await editor.addNode(a);

	const b = new Node("B", 'xxxx-node-id-bbb');
	b.addControl("b", new ClassicPreset.InputControl("text", {initial: "b"}));
	b.addInput("b", new ClassicPreset.Input(socket));
	await editor.addNode(b);

	// comment.addInline("Inline comment text", [100, -20], b.id);
	// comment.addFrame("Frame comment text", [a.id]);

	const c = new Node("C", 'xxxx-node-id-ccc');
	c.addInput("c", new ClassicPreset.Input(socket, 'c', true));
	c.addOutput("c", new ClassicPreset.Output(socket));
	c.addControl("c", new ClassicPreset.InputControl("text", {initial: "c"}));
	await editor.addNode(c);

	await editor.addConnection(new ClassicPreset.Connection(a, "a", b, "b"));


	// await area.translate(a.id, {x: 0, y: 0});
	// await area.translate(b.id, {x: 270, y: 0});
	// await area.translate(c.id, {x: -220, y: 0});

	setTimeout(async () => {

		editor.getNodes().forEach(T => {
			T.height
		});
		console.log('editor.getNodes()', editor.getNodes());
		console.log('editor', editor);
		console.log('area', area);
		const viewsElements = ((area as any).elements as {
			viewsElements: Map<string, HTMLDivElement>,
			views: WeakMap<HTMLDivElement, { type: string, element: HTMLElement, payload: any }>
		}).viewsElements;
		console.log('viewsElements', viewsElements);
		for (const [id, el] of viewsElements) {
			console.log('el', id, el, el.clientHeight);
			if (id.startsWith('node_')) {
				const nodeId = id.replace('node_', '');
				const node = editor.getNodes().find(n => n.id === nodeId);
				if (node) {
					console.log('node', node, node.height);
					node.height = el.clientHeight;
					console.log('node.height', node.height);
				}
				continue;
			}
		}
		// area.update();
		console.log('minimap', minimap);
		(minimap as any).render();

		await arrange.layout();
		console.log('arrange', arrange);

		// console.log('comment', comment);

		// wait until nodes rendered because they dont have predefined width and height
		await AreaExtensions.zoomAt(area, editor.getNodes());
	}, 100);

	// @ts-ignore
	window.destroyReteEditor = () => {
		editor.clear();
		area.destroy();
	}

	// @ts-ignore
	window.editor = editor;
	// @ts-ignore
	window.area = area;
	// @ts-ignore
	window.minimap = minimap;
	// @ts-ignore
	window.arrange = arrange;
}

// @ts-ignore
window.initializeReteEditor = initializeReteEditor;

