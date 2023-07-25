import { umbTranslationRegistry } from '@umbraco-cms/backoffice/localization-api';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { map, of, switchMap, type Observable } from '@umbraco-cms/backoffice/external/rxjs';

export class UmbLocalizationContext {
	get translations() {
		return umbTranslationRegistry.translations;
	}

	/**
	 * Localize a key.
	 * If the key is not found, the fallback is returned.
	 * If the fallback is not provided, the key is returned.
	 * @param key The key to localize. The key is case sensitive.
	 * @param fallback The fallback text to use if the key is not found (default: undefined).
	 */
	localize(key: string, fallback?: string): Observable<string> {
		return this.translations.pipe(map((dictionary) => dictionary.get(key) ?? fallback ?? ''));
	}

	/**
	 * Localize many keys at once.
	 * If a key is not found, the key is returned.
	 * @description This method combines the results of multiple calls to localize.
	 * @param keys
	 * @see localize
	 */
	localizeMany(keys: string[]): Observable<string> {
		return of(...keys).pipe(switchMap((key) => this.localize(key)));
	}
}

export const UMB_LOCALIZATION_CONTEXT = new UmbContextToken<UmbLocalizationContext>('UmbLocalizationContext');
