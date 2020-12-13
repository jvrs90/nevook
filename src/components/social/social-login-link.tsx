import { ComponentProps, FC } from 'react';
import Link from 'next/link';

import {
	LoginStrategies,
	LoginStrategy,
} from '@Enums/config/login-strategies.enum';
import { RestEndPoints } from '@Enums/paths/rest-endpoints.enum';

import { GoogleIcon } from '@Icons/social/google-icon';
import { useRouter } from 'next/router';
import { generateQueryParams } from '@Lib/utils/url.utils';

export interface SocialLoginLinkProps extends ComponentProps<'a'> {
	kind: LoginStrategy;
}

const SocialLoginLink: FC<SocialLoginLinkProps> = ({
	children,
	kind,
	className,
	...props
}) => {
	const kinds = {
		[LoginStrategies.GOOGLE]: {
			icon: GoogleIcon,
			text: 'Continuar con Google',
			className:
				'border border-google-border hover:bg-google-hover dark:bg-white dark:text-white dark:text-white-dark dark:hover:bg-white-dark dark:hover:text-white',
			href: RestEndPoints.GOOGLE_SIGNIN,
		},
	};

	const linkProps = kinds[kind];

	const router = useRouter();
	let url: string = linkProps.href;

	if (Object.keys(router.query).length > 0) {
		let queryString;

		if (router.query)
			queryString = generateQueryParams(router.query as Record<string, string>);

		url = queryString ? `${url}?${queryString}` : url;
	}

	const Icon = linkProps.icon;

	const classNames = [
		'flex-s-c px-1 py-0_75 shadow-sm rounded-lg',
		linkProps.className,
	];
	if (className) classNames.push(className);

	className = classNames.join(' ');

	return (
		<Link href={url}>
			<a className={className} {...props}>
				<Icon className='h-1_5 w-1_5 mr-1 ' />
				<span>{linkProps.text}</span>
			</a>
		</Link>
	);
};

export default SocialLoginLink;
