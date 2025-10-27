import {css, html, LitElement} from 'lit'
import svgPathBounds from 'svg-path-bounds';

type Position = {
	x: number
	y: number
};

export class CustomConnectionElement extends LitElement {
	// @property() accessor start!: Position
	// @property() accessor end!: Position
	// @property() accessor path!: string
	// @property() accessor strokeColor!: string | undefined
	static properties = {
		start: {
			type: Object,
		},
		end: {
			type: Object,
		},
		path: {
			type: String,
		},
		strokeColor: {
			type: String,
		},
		txt: {
			type: String,
		},
	};
	declare start: Position
	declare end: Position
	declare path: string
	declare txt: string
	declare strokeColor: string | undefined

	static styles = css`
		svg {
			overflow: visible !important;
			position: absolute;
			pointer-events: none;
			width: 9999px;
			height: 9999px;

			z-index: 1;
		}

		path {
			fill: none;
			stroke-width: 5px;
			pointer-events: auto;
		}

		span.txt {
			position: absolute;
			transform: translate(-50%, -50%);
			background: var(--reteModal-bg-container);
			padding: 2px;
			border: 1px solid rgba(110, 136, 255, 0.8);
			border-radius: 4px;
			font-size: 1em;
			color: var(--reteModal-text-color);

			z-index: 2;

			//height: 1.5em;

			pointer-events: none;
		}
	`;

	render() {
		const color = this.strokeColor ? this.strokeColor : 'steelblue';
		const stokeColorStyle = `stroke: ${color};`;

		let textStyle;
		try {
			const bbox = svgPathBounds(this.path);
			const txtCenter = [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2];
			// console.log('this.txt', this.txt);
			textStyle = `left: ${txtCenter[0]}px; top: ${txtCenter[1]}px; width: ${this.txt.length}em; border-color: ${color}`;
		} catch (e) {
			textStyle = `display: none;`;
		}

		// console.log('stokeColorStyle', stokeColorStyle);
		return html`
			<span class="txt" .style=${textStyle}>${this.txt}</span>
			<svg data-testid="connection" .style=${stokeColorStyle}>
				<path d=${this.path}></path>
			</svg>
		`;
	}

	static register() {
		if (!customElements.get("custom-connection")) {
			customElements.define("custom-connection", CustomConnectionElement);
		}
	}

}


