import Swal from 'sweetalert2';

export async function noticeDialog(title: string) {
	return Swal.fire({
		// title: title,
		text: title,
		// showCancelButton: true,
		confirmButtonText: '确定',
		// cancelButtonText: 'Cancel',
		theme: 'dark',
	});
}
