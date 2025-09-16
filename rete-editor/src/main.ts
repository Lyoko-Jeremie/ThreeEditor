import {ReteEditor, Node, ClassicPreset, runLater} from "./ReteEditor";

async function initializeReteEditor(container: HTMLElement) {

	const reteEditor = new ReteEditor();
	await reteEditor.initEngine();
	await reteEditor.initGraph(container);

	const {editor, area, socket, minimap, arrange} = reteEditor;


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

	// const selector = AreaExtensions.selector();
	// const accumulating = AreaExtensions.accumulateOnCtrl();
	//
	// CommentExtensions.selectable(comment, selector, accumulating);


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

	// setTimeout(async () => {
	//
	// 	// editor.getNodes().forEach(T => {
	// 	// 	T.height
	// 	// });
	// 	// console.log('editor.getNodes()', editor.getNodes());
	// 	// console.log('editor', editor);
	// 	// console.log('area', area);
	//
	// 	// console.log('comment', comment);
	//
	// }, 100);

	runLater(async () => {
		await reteEditor.updateAllNodeSizes();
		await reteEditor.reZoom();
	}, 100);

	// @ts-ignore
	window.destroyReteEditor = () => {
		return reteEditor.destroy();
	}

	// @ts-ignore
	window.editor = editor;
	// @ts-ignore
	window.area = area;
	// @ts-ignore
	window.minimap = minimap;
	// @ts-ignore
	window.arrange = arrange;
	// @ts-ignore
	window.reLayout = reteEditor.reLayout.bind(reteEditor);
}

// @ts-ignore
window.initializeReteEditor = initializeReteEditor;

