import { UMB_USER_WORKSPACE_CONTEXT } from '../../user-workspace.context-token.js';
import type { UmbUserDetailModel } from '../../../types.js';
import { html, customElement, state, css, nothing } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { UmbInputDocumentElement } from '@umbraco-cms/backoffice/document';
import type { UmbInputMediaElement } from '@umbraco-cms/backoffice/media';
import type { UmbUserGroupInputElement } from '@umbraco-cms/backoffice/user-group';
import type { UUIBooleanInputEvent } from '@umbraco-cms/backoffice/external/uui';

const elementName = 'umb-user-workspace-assign-access';
@customElement(elementName)
export class UmbUserWorkspaceAssignAccessElement extends UmbLitElement {
	@state()
	private _userGroupUniques: UmbUserDetailModel['userGroupUniques'] = [];

	@state()
	private _documentStartNodeUniques: UmbUserDetailModel['documentStartNodeUniques'] = [];

	@state()
	private _documentRootAccess: UmbUserDetailModel['documentRootAccess'] = false;

	@state()
	private _mediaStartNodeUniques: UmbUserDetailModel['documentStartNodeUniques'] = [];

	@state()
	private _mediaRootAccess: UmbUserDetailModel['mediaRootAccess'] = false;

	#workspaceContext?: typeof UMB_USER_WORKSPACE_CONTEXT.TYPE;

	constructor() {
		super();

		this.consumeContext(UMB_USER_WORKSPACE_CONTEXT, (instance) => {
			this.#workspaceContext = instance;

			this.observe(
				this.#workspaceContext.userGroupUniques,
				(value) => (this._userGroupUniques = value),
				'_observeUserGroupAccess',
			);

			this.observe(
				this.#workspaceContext.documentRootAccess,
				(value) => (this._documentRootAccess = value),
				'_observeDocumentRootAccess',
			);

			this.observe(
				this.#workspaceContext.documentStartNodeUniques,
				(value) => (this._documentStartNodeUniques = value),
				'_observeDocumentStartNode',
			);

			this.observe(
				this.#workspaceContext.mediaRootAccess,
				(value) => (this._mediaRootAccess = value),
				'_observeMediaRootAccess',
			);

			this.observe(
				this.#workspaceContext.mediaStartNodeUniques,
				(value) => (this._mediaStartNodeUniques = value),
				'_observeMediaStartNode',
			);
		});
	}

	#onUserGroupsChange(event: CustomEvent) {
		event.stopPropagation();
		const target = event.target as UmbUserGroupInputElement;
		const selection = target.selection;
		// TODO make contexts method
		this.#workspaceContext?.updateProperty('userGroupUniques', selection);
	}

	#onAllowAllDocumentsChange(event: UUIBooleanInputEvent) {
		event.stopPropagation();
		const target = event.target;
		// TODO make contexts method
		this.#workspaceContext?.updateProperty('documentRootAccess', target.checked);
		this.#workspaceContext?.updateProperty('documentStartNodeUniques', []);
	}

	#onDocumentStartNodeChange(event: CustomEvent) {
		event.stopPropagation();
		const target = event.target as UmbInputDocumentElement;
		const selection = target.selection;
		// TODO make contexts method
		this.#workspaceContext?.updateProperty('documentStartNodeUniques', selection);
	}

	#onAllowAllMediaChange(event: UUIBooleanInputEvent) {
		event.stopPropagation();
		const target = event.target;
		// TODO make contexts method
		this.#workspaceContext?.updateProperty('mediaRootAccess', target.checked);
		this.#workspaceContext?.updateProperty('mediaStartNodeUniques', []);
	}

	#onMediaStartNodeChange(event: CustomEvent) {
		event.stopPropagation();
		const target = event.target as UmbInputMediaElement;
		const selection = target.selection;
		// TODO make contexts method
		this.#workspaceContext?.updateProperty('mediaStartNodeUniques', selection);
	}

	render() {
		return html`
			<uui-box>
				<div slot="headline"><umb-localize key="user_assignAccess">Assign Access</umb-localize></div>
				<div id="assign-access">
					${this.#renderGroupAccess()} ${this.#renderDocumentAccess()} ${this.#renderMediaAccess()}
				</div>
			</uui-box>
		`;
	}

	#renderGroupAccess() {
		return html`<umb-property-layout
			label="${this.localize.term('general_groups')}"
			description="${this.localize.term('user_groupsHelp')}">
			<umb-user-group-input
				slot="editor"
				.selection=${this._userGroupUniques}
				@change=${this.#onUserGroupsChange}></umb-user-group-input>
		</umb-property-layout>`;
	}

	#renderDocumentAccess() {
		return html`
			<umb-property-layout
				label=${this.localize.term('user_startnodes')}
				description=${this.localize.term('user_startnodeshelp')}>
				<div slot="editor">
					<uui-toggle
						style="margin-bottom: var(--uui-size-space-3);"
						label="${this.localize.term('user_allowAccessToAllDocuments')}"
						.checked=${this._documentRootAccess}
						@change=${this.#onAllowAllDocumentsChange}></uui-toggle>
				</div>

				${this._documentRootAccess === false
					? html`
							<umb-input-document
								slot="editor"
								.selection=${this._documentStartNodeUniques}
								@change=${this.#onDocumentStartNodeChange}></umb-input-document>
						`
					: nothing}
			</umb-property-layout>
		`;
	}

	#renderMediaAccess() {
		return html`
			<umb-property-layout
				label=${this.localize.term('defaultdialogs_selectMediaStartNode')}
				description=${this.localize.term('user_mediastartnodehelp')}>
				<div slot="editor">
					<uui-toggle
						style="margin-bottom: var(--uui-size-space-3);"
						label="${this.localize.term('user_allowAccessToAllMedia')}"
						.checked=${this._mediaRootAccess}
						@change=${this.#onAllowAllMediaChange}></uui-toggle>
				</div>

				${this._mediaRootAccess === false
					? html`
							<umb-input-media
								slot="editor"
								.selection=${this._mediaStartNodeUniques}
								@change=${this.#onMediaStartNodeChange}></umb-input-media>
						`
					: nothing}
			</umb-property-layout>
		`;
	}

	static styles = [UmbTextStyles];
}

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbUserWorkspaceAssignAccessElement;
	}
}
