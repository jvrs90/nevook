import Error from '@Pages/404';

import { FC } from 'react';

export type WithAllowProps = {
	isAllowed: boolean;
	[prop: string]: any;
};

export const withCSRAllowPaths = (Component: FC<any>) => ({
	isAllowed,
	...props
}: WithAllowProps) =>
	isAllowed ? <Component {...props}></Component> : <Error />;