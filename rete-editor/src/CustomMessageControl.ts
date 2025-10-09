import {html, LitElement} from "lit";
import {SignalWatcher, signal} from '@lit-labs/signals';

export class CustomMessageControl extends SignalWatcher(LitElement) {
	static properties = {
		data: {
			type: Object,
		},
	};

	declare data: {
		textSignal: ReturnType<typeof signal<string>>,
		isCustomMessageControl: boolean,
	} | null;

	render() {
		if (!this.data) return html``;
		const d: any = this.data;

		return html`
			<div
				@pointerdown=${(e: MouseEvent) => e.stopPropagation()}
				@doubleclick=${(e: MouseEvent) => e.stopPropagation()}
				@click=${(e: MouseEvent) => e.stopPropagation()}
				@dblclick=${(e: MouseEvent) => e.stopPropagation()}
			>${this.data.textSignal.get()}</div>
		`;
	}

	static register() {
		if (!customElements.get("custom-message-control")) {
			customElements.define("custom-message-control", CustomMessageControl);
		}
	}
}
