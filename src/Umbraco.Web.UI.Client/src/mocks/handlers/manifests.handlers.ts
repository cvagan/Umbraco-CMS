const { rest } = window.MockServiceWorker;

import type { PackageManifestResponse } from '../../packages/packages/types.js';
import { umbracoPath } from '@umbraco-cms/backoffice/utils';

export const manifestDevelopmentHandlers = [
	rest.get(umbracoPath('/manifest/manifest/private'), (_req, res, ctx) => {
		return res(
			// Respond with a 200 status code
			ctx.status(200),
			ctx.json<PackageManifestResponse>([
				{
					name: 'My Package Name',
					version: '1.0.0',
					extensions: [
						{
							type: 'bundle',
							alias: 'My.Package.Bundle',
							name: 'My Package Bundle',
							js: '/App_Plugins/custom-bundle-package/index.js',
						},
					],
				},
				{
					name: 'Named Package',
					version: '1.0.0',
					extensions: [
						{
							type: 'section',
							alias: 'My.Section.Custom',
							name: 'Custom Section',
							js: '/App_Plugins/section.js',
							elementName: 'my-section-custom',
							weight: 1,
							meta: {
								label: 'Custom',
								pathname: 'my-custom',
							},
						},
						{
							type: 'propertyEditorUi',
							alias: 'My.PropertyEditorUI.Custom',
							name: 'My Custom Property Editor UI',
							js: '/App_Plugins/property-editor.js',
							elementName: 'my-property-editor-ui-custom',
							meta: {
								label: 'My Custom Property',
								icon: 'document',
								group: 'Common',
								propertyEditorSchema: 'Umbraco.TextBox',
							},
						},
					],
				},
				{
					name: 'Package with an entry point',
					extensions: [
						{
							type: 'entryPoint',
							name: 'My Custom Entry Point',
							alias: 'My.Entrypoint.Custom',
							js: '/App_Plugins/custom-entrypoint.js',
						},
					],
				},
				{
					name: 'My MFA Package',
					extensions: [
						{
							type: 'mfaLoginProvider',
							alias: 'My.MfaLoginProvider.Custom.Google',
							name: 'My Custom Google MFA Provider',
							forProviderName: 'Google Authenticator',
						},
						{
							type: 'mfaLoginProvider',
							alias: 'My.MfaLoginProvider.Custom.SMS',
							name: 'My Custom SMS MFA Provider',
							forProviderName: 'sms',
							meta: {
								label: 'Setup SMS Verification',
							},
						},
					],
				},
				{
					name: 'Package with a view',
					extensions: [
						{
							type: 'packageView',
							alias: 'My.PackageView.Custom',
							name: 'My Custom Package View',
							js: '/App_Plugins/package-view.js',
							meta: {
								packageName: 'Package with a view',
							},
						},
					],
				},
				{
					name: 'My MFA Package',
					extensions: [
						{
							type: 'mfaLoginProvider',
							alias: 'My.MfaLoginProvider.Custom',
							name: 'My Custom MFA Provider',
							forProviderName: 'sms',
							meta: {
								label: 'Setup SMS Verification',
							},
						},
					],
				},
			]),
		);
	}),
	rest.get(umbracoPath('/manifest/manifest/public'), (_req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json<PackageManifestResponse>([
				{
					name: 'My Auth Package',
					extensions: [
						{
							type: 'authProvider',
							alias: 'My.AuthProvider.Google',
							name: 'My Custom Auth Provider',
							forProviderName: 'Umbraco.Google',
							meta: {
								label: 'Sign in with Google',
							},
						},
						{
							type: 'authProvider',
							alias: 'My.AuthProvider.Github',
							name: 'My Github Auth Provider',
							forProviderName: 'Umbraco.Github',
							meta: {
								label: 'GitHub',
								defaultView: {
									look: 'primary',
									icon: 'icon-github',
									color: 'success',
								},
							},
						},
					],
				},
			]),
		);
	}),
];

export const manifestEmptyHandlers = [
	rest.get(umbracoPath('/manifest/manifest/private'), (_req, res, ctx) => {
		return res(ctx.status(200), ctx.json<PackageManifestResponse>([]));
	}),
	rest.get(umbracoPath('/manifest/manifest/public'), (_req, res, ctx) => {
		return res(ctx.status(200), ctx.json<PackageManifestResponse>([]));
	}),
];
