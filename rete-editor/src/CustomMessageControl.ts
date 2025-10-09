import {css, html, LitElement} from "lit";
import {SignalWatcher, signal} from '@lit-labs/signals';

export class CustomMessageControl extends SignalWatcher(LitElement) {
	static properties = {
		data: {
			type: Object,
		},
	};

	declare data: {
		textSignal: ReturnType<typeof signal<string>> | string,
		isCustomMessageControl: boolean,
		needBorder?: boolean,
	} | null;

	render() {
		if (!this.data) return html``;

		let style = css``;
		if (this.data.needBorder) {
			style = css`border: rgba(207, 207, 207, 0.5) 1px solid;
				padding: 0px 3px;
				border-radius: 6px;`;
		}

		return html`
			<div
				.style=${style}
				@pointerdown=${(e: MouseEvent) => e.stopPropagation()}
				@doubleclick=${(e: MouseEvent) => e.stopPropagation()}
				@click=${(e: MouseEvent) => e.stopPropagation()}
				@dblclick=${(e: MouseEvent) => e.stopPropagation()}
			>${ typeof this.data.textSignal === 'string' ? this.data.textSignal : this.data.textSignal.get()}
			</div>
		`;
	}

	static register() {
		if (!customElements.get("custom-message-control")) {
			customElements.define("custom-message-control", CustomMessageControl);
		}
	}
}
