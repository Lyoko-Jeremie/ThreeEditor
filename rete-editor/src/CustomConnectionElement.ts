import { css, html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'

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
	};
	declare start: Position
	declare end: Position
	declare path: string
	declare strokeColor: string | undefined

	static styles = css`
    svg {
      overflow: visible !important;
      position: absolute;
      pointer-events: none;
      width: 9999px;
      height: 9999px;
    }

    path {
      fill: none;
      stroke-width: 5px;
      pointer-events: auto;
    }
  `

	render() {
		const stokeColorStyle = `stroke: ${this.strokeColor ? this.strokeColor : 'steelblue'}`;
		console.log('stokeColorStyle', stokeColorStyle);
		return html`
      <svg data-testid="connection" .style=${stokeColorStyle}>
        <path d=${this.path} ></path>
      </svg>
    `
	}

	static register() {
		if (!customElements.get("custom-connection")) {
			customElements.define("custom-connection", CustomConnectionElement);
		}
	}

}


