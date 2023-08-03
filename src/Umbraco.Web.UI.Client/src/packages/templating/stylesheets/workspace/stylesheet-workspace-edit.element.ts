import { UUIInputElement, UUIInputEvent, UUITextStyles } from '@umbraco-cms/backoffice/external/uui';
import { css, html, LitElement, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbStylesheetWorkspaceContext } from './stylesheet-workspace.context.js';
import { UMB_MODAL_MANAGER_CONTEXT_TOKEN, UmbModalManagerContext } from '@umbraco-cms/backoffice/modal';
import { UMB_ENTITY_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/workspace';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

@customElement('umb-stylesheet-workspace-edit')
export class UmbStylesheetWorkspaceEditElement extends UmbLitElement {
	#workspaceContext?: UmbStylesheetWorkspaceContext;

	@state()
	private _name?: string;

	@state()
	private _path?: string;

	private _modalContext?: UmbModalManagerContext;

	constructor() {
		super();

		this.consumeContext(UMB_ENTITY_WORKSPACE_CONTEXT, (instance) => {
			this.#workspaceContext = instance as UmbStylesheetWorkspaceContext;
		});

		this.consumeContext(UMB_MODAL_MANAGER_CONTEXT_TOKEN, (instance) => {
			this._modalContext = instance;
		});
	}

	#onNameChange(event: UUIInputEvent) {
		if (event instanceof UUIInputEvent) {
			const target = event.composedPath()[0] as UUIInputElement;

			if (typeof target?.value === 'string') {
				const oldName = this._name;
				const newName = event.target.value.toString();
				this.#workspaceContext?.setName(target.value);
			}
		}
	}

	render() {
		return html`
			<umb-workspace-editor alias="Umb.Workspace.StyleSheet">
				<div id="header" slot="header">
					<uui-input id="name" .value=${this._name} @input="${this.#onNameChange}"> </uui-input>
				</div>

				<div slot="footer-info">
					<!-- TODO: Shortcuts Modal? -->
					<uui-button label="Show keyboard shortcuts">
						Keyboard Shortcuts
						<uui-keyboard-shortcut>
							<uui-key>ALT</uui-key>
							+
							<uui-key>shift</uui-key>
							+
							<uui-key>k</uui-key>
						</uui-keyboard-shortcut>
					</uui-button>
				</div>
			</umb-workspace-editor>
		`;
	}

	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				width: 100%;
				height: 100%;
			}
		`,
	];
}

export default UmbStylesheetWorkspaceEditElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-stylesheet-workspace-edit': UmbStylesheetWorkspaceEditElement;
	}
}
