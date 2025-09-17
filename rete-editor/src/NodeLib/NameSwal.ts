import Swal from 'sweetalert2';
import {runLater} from "./runLater";
import type {ReteEditorInterface} from "../ReteEditorInterface";
import type {NeedSkipBuffer} from "./OpInterface";

export async function nameDialog<T extends NeedSkipBuffer>(editor: ReteEditorInterface, title: string, f: (s: string) => T | Promise<T>) {
	return Swal.fire({
		// title: title,
		text: title,
		input: 'text',
		inputValue: '',
		// showCancelButton: true,
		confirmButtonText: '确定',
		// cancelButtonText: 'Cancel',
		theme: 'dark',
	}).then(async (result) => {
		const n = await f(result.value || '');
		runLater(async () => {
			await editor.updateOneNodeSize(n);
			editor.updateMinimap();
		}, 50);
		return n
	});
}
