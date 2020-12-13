import { RedirectConditions } from '@Enums/redirect-conditions.enum';

export interface IRedirect {
	href: string;
	asPath?: string;
	statusCode: number;
	condition?: RedirectConditions;
	query?: Record<string, string>;
}