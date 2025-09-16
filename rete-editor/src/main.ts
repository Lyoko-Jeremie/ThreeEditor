import {ReteEditor, runLater} from "./ReteEditor";

async function initializeReteEditor(container: HTMLElement, data?: Record<string, any>) {

	const reteEditor = new ReteEditor();
	await reteEditor.initEngine();
	await reteEditor.initGraph(container);

	const {editor, area, minimap, arrange} = reteEditor;


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

	// @ts-ignore
	window.destroyReteEditor = async () => {
		await reteEditor.destroy();
		// @ts-ignore
		window.reteEditor = undefined;
		// @ts-ignore
		window.editor = undefined;
		// @ts-ignore
		window.area = undefined;
		// @ts-ignore
		window.minimap = undefined;
		// @ts-ignore
		window.arrange = undefined;
		// @ts-ignore
		window.reLayout = undefined;
		// @ts-ignore
		window.destroyReteEditor = undefined;
	}

	// @ts-ignore
	window.reteEditor = reteEditor;
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


	await runLater(async () => {
		await reteEditor.deserialization(data);
		await reteEditor.updateAllNodeSizes();
		await reteEditor.reZoom();
	}, 100);

}

// @ts-ignore
window.initializeReteEditor = initializeReteEditor;

