import { FC, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { IRedirect } from '@Interfaces/redirect.interface';

import { AuthContext } from '@Lib/context/auth.context';
import { RedirectConditions } from '@Enums/redirect-conditions.enum';
import { generateQueryParams } from '@Lib/utils/url.utils';

export const withCSRRedirect = (Component: FC, redirect: IRedirect) => {
	const { href, asPath, condition, query } = redirect;
	return (props: any) => {
		const router = useRouter();
		const { stateAuth } = useContext(AuthContext);
		const [shouldRender, setShouldRender] = useState<boolean>(
			!!props.shouldRender
		);

		useEffect(() => {
			if (
				(stateAuth.jwt &&
					condition === RedirectConditions.REDIRECT_WHEN_USER_EXISTS) ||
				(!stateAuth.jwt &&
					condition === RedirectConditions.REDIRECT_WHEN_USER_NOT_EXISTS)
			) {
				let queryString;

				if (query) queryString = generateQueryParams(query);

				const url = queryString ? `${href}?${queryString}` : href;

				router.replace(url, asPath);
			} else setShouldRender(true);
		}, []);

		return shouldRender ? <Component {...props}></Component> : <></>;
	};
};
