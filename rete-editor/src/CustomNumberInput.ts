import {html, LitElement} from "lit";

// console.log('LitElement', LitElement);

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

	static register() {
		if (!customElements.get("custom-number-input")) {
			customElements.define("custom-number-input", CustomNumberInput);
		}
	}
}

// customElements.define("custom-number-input", CustomNumberInput);
// customElements.whenDefined("custom-number-input").then(() => {
// 	console.log("custom-number-input defined");
// });
// console.log('CustomNumberInput', CustomNumberInput);
