import { SetValueCommand } from '../commands/SetValueCommand.js';

document.addEventListener( 'DOMContentLoaded', () => {

	const reteModalOverlay = document.getElementById( 'reteModal-overlay' );
	const reteModalContainer = document.getElementById( 'reteModal-container' );
	const reteModalContent = document.getElementById( 'reteModal-content' );
	const reteModalCloseBtn = document.getElementById( 'reteModal-close-btn' );
	const reteModalThemeToggleBtn = document.getElementById( 'reteModal-theme-toggle-btn' );
	const reteModalReLayoutBtn = document.getElementById( 'reteModal-relayout-btn' );
	const reteModalSaveBtn = document.getElementById( 'reteModal-save-btn' );
	const reteModalHelpBtn = document.getElementById( 'reteModal-help-btn' );

	const htmlBody = document.body;

	// Check for saved theme preference on page load
	const savedTheme = localStorage.getItem( 'reteModalTheme' );
	if ( savedTheme === 'dark' ) {

		htmlBody.classList.add( 'reteModal-dark-theme' );

	}

	// --- Re-Layout Functionality ---

	if ( reteModalReLayoutBtn ) {

		reteModalReLayoutBtn.addEventListener( 'click', () => {

			if ( window.reteEditor?.reLayout ) {

				window.reteEditor.reLayout().catch( e => console.error( 'reteEditor.reLayout error:', e ) );

			}

		} );

	}

	// --- Save Functionality ---

	if ( reteModalSaveBtn ) {

		reteModalSaveBtn.addEventListener( 'click', () => {

			if ( window.reteEditor ) {

				console.log( 'editor.scene', window.editor.scene );
				console.log( 'editor', window.editor );

				const editor = window.editor;
				const userData = editor.scene.userData || {};

				window.reteEditor.serialization().then( r => {

					userData.rete = r;
					editor.execute( new SetValueCommand( editor, editor.scene, 'userData', userData ) );

					return noticeDialog( '保存成功' );

				} );


			}

		} );

	}

	// --- Help Functionality ---

	if ( reteModalHelpBtn ) {

		reteModalHelpBtn.addEventListener( 'click', () => {

			// TODO
			const helpUrl = '';
			window.open( helpUrl, '_blank' );

		} );

	}

	// --- Theme Toggle Functionality ---
	if ( reteModalThemeToggleBtn ) {

		reteModalThemeToggleBtn.addEventListener( 'click', () => {

			htmlBody.classList.toggle( 'reteModal-dark-theme' );
			// Save the new theme preference
			if ( htmlBody.classList.contains( 'reteModal-dark-theme' ) ) {

				localStorage.setItem( 'reteModalTheme', 'dark' );

			} else {

				localStorage.setItem( 'reteModalTheme', 'light' );

			}

		} );

	}

	// --- Modal Control Functionality ---
	if ( reteModalCloseBtn ) {

		reteModalCloseBtn.addEventListener( 'click', async () => {

			const r = await SwalConfirm( '确认关闭编辑器？未保存的数据将会丢失！' );
			if ( r.isConfirmed ) {

				// Add a simple animation before hiding
				reteModalContainer.style.transform = 'scale(0.9)';
				reteModalContainer.style.opacity = '0';
				reteModalOverlay.style.opacity = '0';

				window.destroyReteEditor();
				window.destroyReteEditor = undefined;

				// Hide after the animation completes
				setTimeout( () => {

					reteModalOverlay.style.display = 'none';

				}, 300 );

			}


		} );

	}

	// Add a function to show the modal (for demonstration)
	window.showReteModal = () => {

		if ( window.destroyReteEditor ) {

			window.destroyReteEditor();
			window.destroyReteEditor = undefined;

		}

		if ( reteModalOverlay && reteModalContainer ) {

			reteModalOverlay.style.display = 'flex';
			// Reset styles for animation
			reteModalContainer.style.transform = 'scale(0.9)';
			reteModalContainer.style.opacity = '0';
			reteModalOverlay.style.opacity = '0';

			window.initializeReteEditor( reteModalContent );

			setTimeout( async () => {

				reteModalContainer.style.transform = 'scale(1)';
				reteModalContainer.style.opacity = '1';
				reteModalOverlay.style.opacity = '1';

				const data = window?.editor?.scene?.userData?.rete;
				data && await window.reteEditor.deserialization( data ).catch( e => console.error( 'reteEditor.deserialization error:', e ) );

			}, 10 );

		}

	};

	// // You can add a button to trigger the modal for testing
	// const openButton = document.createElement( 'button' );
	// openButton.textContent = '打开 Rete 编辑器';
	// openButton.style.cssText = `
	//         position: fixed;
	//         top: 50%;
	//         left: 50%;
	//         transform: translate(-50%, -50%);
	//         padding: 12px 24px;
	//         font-size: 1rem;
	//         cursor: pointer;
	//         border: none;
	//         background-color: #007bff;
	//         color: white;
	//         border-radius: 8px;
	//         box-shadow: 0 4px 8px rgba(0,0,0,0.1);
	//         z-index: 998;
	//     `;
	// document.body.appendChild( openButton );
	// openButton.addEventListener( 'click', () => {
	//
	// 	window.showReteModal();
	//
	// } );

	// Hide the modal initially
	if ( reteModalOverlay ) {

		reteModalOverlay.style.display = 'none';

	}

} );
