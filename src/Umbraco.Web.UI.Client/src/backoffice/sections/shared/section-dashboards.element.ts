import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { IRoutingInfo } from 'router-slot';
import { map, Subscription, first } from 'rxjs';

import { UmbContextConsumerMixin } from '../../../core/context';
import { createExtensionElement, UmbExtensionManifestDashboard, UmbExtensionRegistry } from '../../../core/extension';
import { UmbSectionContext } from '../section.context';

@customElement('umb-section-dashboards')
export class UmbSectionDashboards extends UmbContextConsumerMixin(LitElement) {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				width: 100%;
			}

			#tabs {
				background-color: var(--uui-color-surface);
				height: 70px;
			}

			#router-slot {
				width: 100%;
				box-sizing: border-box;
				padding: var(--uui-size-space-5);
				display: block;
			}
		`,
	];

	@state()
	private _dashboards: Array<UmbExtensionManifestDashboard> = [];

	@state()
	private _currentDashboardPathname = '';

	@state()
	private _routes: Array<any> = [];

	@state()
	private _currentSectionPathname = '';

	private _currentSectionAlias = '';

	private _extensionRegistry?: UmbExtensionRegistry;
	private _dashboardsSubscription?: Subscription;

	private _sectionContext?: UmbSectionContext;
	private _sectionContextSubscription?: Subscription;

	constructor() {
		super();

		// TODO: wait for more contexts
		this.consumeContext('umbExtensionRegistry', (_instance: UmbExtensionRegistry) => {
			this._extensionRegistry = _instance;
		});

		this.consumeContext('umbSectionContext', (context: UmbSectionContext) => {
			this._sectionContext = context;
			this._useSectionContext();
		});
	}

	private _useSectionContext() {
		this._sectionContextSubscription?.unsubscribe();

		this._sectionContextSubscription = this._sectionContext?.data.pipe(first()).subscribe((section) => {
			this._currentSectionAlias = section.alias;
			this._currentSectionPathname = section.meta.pathname;
			this._useDashboards();
		});
	}

	private _useDashboards() {
		if (!this._extensionRegistry || !this._currentSectionAlias) return;

		this._dashboardsSubscription?.unsubscribe();

		this._dashboardsSubscription = this._extensionRegistry
			?.extensionsOfType('dashboard')
			.pipe(
				map((extensions) =>
					extensions
						.filter((extension) => extension.meta.sections.includes(this._currentSectionAlias))
						.sort((a, b) => b.meta.weight - a.meta.weight)
				)
			)
			.subscribe((dashboards) => {
				if (!dashboards) return;
				this._dashboards = dashboards;
				this._createRoutes();
			});
	}

	private _createRoutes() {
		this._routes = [];

		this._routes = this._dashboards.map((dashboard) => {
			return {
				path: `${dashboard.meta.pathname}`,
				component: () => createExtensionElement(dashboard),
				setup: (_element: UmbExtensionManifestDashboard, info: IRoutingInfo) => {
					this._currentDashboardPathname = info.match.route.path;
				},
			};
		});

		this._routes.push({
			path: '**',
			redirectTo: this._dashboards?.[0]?.meta.pathname,
		});
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._dashboardsSubscription?.unsubscribe();
		this._sectionContextSubscription?.unsubscribe();
	}

	render() {
		return html`
			<uui-tab-group id="tabs">
				${this._dashboards.map(
					(dashboard: UmbExtensionManifestDashboard) => html`
						<uui-tab
							href="${`/section/${this._currentSectionPathname}/dashboard/${dashboard.meta.pathname}`}"
							label=${dashboard.name}
							?active="${dashboard.meta.pathname === this._currentDashboardPathname}"></uui-tab>
					`
				)}
			</uui-tab-group>
			<router-slot id="router-slot" .routes="${this._routes}"></router-slot>
		`;
	}
}

export default UmbSectionDashboards;

declare global {
	interface HTMLElementTagNameMap {
		'umb-section-dashboards': UmbSectionDashboards;
	}
}
