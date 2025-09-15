document.addEventListener( 'DOMContentLoaded', () => {

	const reteModalOverlay = document.getElementById( 'reteModal-overlay' );
	const reteModalContainer = document.getElementById( 'reteModal-container' );
	const reteModalCloseBtn = document.getElementById( 'reteModal-close-btn' );
	const reteModalThemeToggleBtn = document.getElementById( 'reteModal-theme-toggle-btn' );
	const htmlBody = document.body;

	// Check for saved theme preference on page load
	const savedTheme = localStorage.getItem( 'reteModalTheme' );
	if ( savedTheme === 'dark' ) {

		htmlBody.classList.add( 'reteModal-dark-theme' );

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

		reteModalCloseBtn.addEventListener( 'click', () => {

			// Add a simple animation before hiding
			reteModalContainer.style.transform = 'scale(0.9)';
			reteModalContainer.style.opacity = '0';
			reteModalOverlay.style.opacity = '0';

			// Hide after the animation completes
			setTimeout( () => {

				reteModalOverlay.style.display = 'none';

			}, 300 );

		} );

	}

	// Add a function to show the modal (for demonstration)
	window.showReteModal = () => {

		if ( reteModalOverlay && reteModalContainer ) {

			reteModalOverlay.style.display = 'flex';
			// Reset styles for animation
			reteModalContainer.style.transform = 'scale(0.9)';
			reteModalContainer.style.opacity = '0';
			reteModalOverlay.style.opacity = '0';
			setTimeout( () => {

				reteModalContainer.style.transform = 'scale(1)';
				reteModalContainer.style.opacity = '1';
				reteModalOverlay.style.opacity = '1';

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
