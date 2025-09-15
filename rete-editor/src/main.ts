import {NodeEditor, type GetSchemes, ClassicPreset} from 'rete';
import {AreaPlugin, AreaExtensions} from 'rete-area-plugin';
import {
	ConnectionPlugin,
	Presets as ConnectionPresets,
} from 'rete-connection-plugin';
import {LitPlugin, Presets, type LitArea2D} from '@retejs/lit-plugin';
import {type MinimapExtra, MinimapPlugin} from "rete-minimap-plugin";
import {HistoryPlugin, type HistoryActions, Presets as PresetsHistory, HistoryExtensions} from "rete-history-plugin";
import {CommentPlugin, CommentExtensions} from "rete-comment-plugin";
import {type ContextMenuExtra, ContextMenuPlugin, Presets as ContextMenuPresets} from "rete-context-menu-plugin";
import {DataflowEngine} from "rete-engine";
import Swal from 'sweetalert2';

// import { MyComponent1, MyComponent2 } from './components';

class Node extends ClassicPreset.Node {
	width = 200;
	height = 120;

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

	// @ts-ignore
	const minimap = new MinimapPlugin<Schemes>();

	const history = new HistoryPlugin<Schemes, HistoryActions<Schemes>>();

	const comment = new CommentPlugin<Schemes, AreaExtra>({
		edit: async (comment) => {
			const os = comment.text;
			return Swal.fire({
				title: 'Edit comment',
				input: 'text',
				inputValue: os,
				showCancelButton: true,
				confirmButtonText: 'Save',
				cancelButtonText: 'Cancel',
			}).then((result) => {
				if (result.isConfirmed) {
					return result.value || os;
				}
				return os;
			});
		}
	});

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
	area.use(comment);
	area.use(contextMenu);

	const selector = AreaExtensions.selector();
	const accumulating = AreaExtensions.accumulateOnCtrl();

	CommentExtensions.selectable(comment, selector, accumulating);

	AreaExtensions.simpleNodesOrder(area);

	const a = new Node("A", 'xxxx-node-id-aaa');
	// a.id = 'xxxx-node-id-aaa';
	a.addControl("a", new ClassicPreset.InputControl("text", {initial: "a"}));
	a.addOutput("a", new ClassicPreset.Output(socket));
	await editor.addNode(a);

	const b = new Node("B", 'xxxx-node-id-bbb');
	// a.id = 'xxxx-node-id-bbb';
	b.addControl("b", new ClassicPreset.InputControl("text", {initial: "b"}));
	b.addInput("b", new ClassicPreset.Input(socket));
	await editor.addNode(b);

	comment.addInline("Inline comment text", [100, -20], b.id);
	comment.addFrame("Frame comment text", [a.id]);

	await editor.addConnection(new ClassicPreset.Connection(a, "a", b, "b"));


	await area.translate(a.id, {x: 0, y: 0});
	await area.translate(b.id, {x: 270, y: 0});

	setTimeout(() => {
		// wait until nodes rendered because they dont have predefined width and height
		AreaExtensions.zoomAt(area, editor.getNodes());
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
}

// @ts-ignore
window.initializeReteEditor = initializeReteEditor;


// // 全局变量来保存编辑器实例，以便之后销毁
// let editorInstance = null;
//
// document.addEventListener('DOMContentLoaded', () => {
//
// 	// async function initializeReteEditor() {
// 	//
// 	// 	// 如果实例已存在，先销毁旧的
// 	// 	if ( editorInstance ) {
// 	//
// 	// 		destroyReteEditor();
// 	//
// 	// 	}
// 	//
// 	// 	// 1. 创建编辑器核心
// 	// 	const editor = new NodeEditor();
// 	// 	editorInstance = editor;
// 	//
// 	// 	// 2. 注册组件
// 	// 	const components = [
// 	// 		// new MyComponent1(),
// 	// 		// new MyComponent2()
// 	// 	];
// 	// 	for ( const component of components ) {
// 	//
// 	// 		editor.addNode( component );
// 	//
// 	// 	}
// 	//
// 	// 	// 3. 插件注册
// 	// 	const area = new AreaPlugin( document.getElementById( 'rete-editor-container' ) );
// 	// 	const connection = new ConnectionPlugin();
// 	// 	const render = renderEditor();
// 	//
// 	// 	// 4. 附加插件
// 	// 	editor.use( area );
// 	// 	editor.use( connection );
// 	// 	editor.use( render );
// 	//
// 	// 	// 5. 附加到容器
// 	// 	AreaExtensions.simpleNodesOrder( area );
// 	// 	AreaExtensions.selectableNodes( area, AreaExtensions.selector() );
// 	// 	AreaExtensions.dragPan( area, {
// 	// 		enabled: ( pointer ) => pointer.button === 2 // 右键平移
// 	// 	} );
// 	//
// 	// 	return editor;
// 	//
// 	// }
//
// 	function destroyReteEditor() {
//
// 		if (editorInstance) {
//
// 			editorInstance.remove(); // 核心方法，移除编辑器实例
// 			editorInstance = null; // 清除全局引用
//
// 			const container = document.getElementById('rete-editor-container');
//
// 			// 可选：清除容器内容
// 			while (container.firstChild) {
//
// 				container.removeChild(container.firstChild);
//
// 			}
//
// 			console.log('Rete.js editor destroyed.');
//
// 		}
//
// 	}
//
// 	// @ts-ignore
// 	window.destroyReteEditor = destroyReteEditor;
//
// });
