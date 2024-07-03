import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import type { UmbSubmittableWorkspaceContext } from '@umbraco-cms/backoffice/workspace';
import type { UmbTemplateWorkspaceContext } from './template-workspace.context.js';

export const UMB_TEMPLATE_WORKSPACE_CONTEXT = new UmbContextToken<
	UmbSubmittableWorkspaceContext,
	UmbTemplateWorkspaceContext
>(
	'UmbWorkspaceContext',
	undefined,
	(context): context is UmbTemplateWorkspaceContext => context.getEntityType?.() === 'template',
);
