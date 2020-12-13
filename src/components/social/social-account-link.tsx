import { FC, useContext } from 'react';
import Link from 'next/link';
import { RestEndPoints } from '@Enums/paths/rest-endpoints.enum';
import { GoogleIcon } from '@Icons/social/google-icon';
import { useRouter } from 'next/router';
import { generateQueryParams } from '@Lib/utils/url.utils';
import {
	AccountSocial,
	AccountSocialType,
} from '@Enums/config/account-social.enum';
import { GraphqlUser } from 'nevook-utils';
import { ApolloQueryResult, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { AlertMessages } from '@Enums/config/constants';
import { LoginStrategies } from '@Enums/config/login-strategies.enum';
import { UserProfileOtherInfo } from '@Interfaces/user/user.interface';
import { ProfileContext } from '@Lib/context/profile.context';

export interface SocialLoginLinkProps {
	kind: AccountSocialType;
	className?: string;
}

const SocialLoginLink: FC<SocialLoginLinkProps> = ({
	children,
	kind,
	className,
	...props
}) => {
	const router = useRouter();
	const { profile, refetch } = useContext(ProfileContext);

	const listOfLinks = getListOfLinks(profile, refetch);

	const linkProps = listOfLinks[kind];

	const Icon = linkProps.icon;

	const classNames = [
		'flex-s-c px-1 py-0_75 shadow-sm rounded-lg',
		linkProps.className,
	];

	if (className) classNames.push(className);

	className = classNames.join(' ');

	if (linkProps.href) {
		let url: string = linkProps.href;

		if (Object.keys(router.query).length > 0) {
			let queryString;

			if (router.query)
				queryString = generateQueryParams(
					router.query as Record<string, string>
				);

			url = queryString ? `${url}?${queryString}` : url;
		}

		return (
			<Link href={url}>
				<a className={className} {...props}>
					<Icon className='h-1_5 w-1_5 mr-1 ' />
					<span>{linkProps.text}</span>
				</a>
			</Link>
		);
	}

	if (linkProps.onClick)
		return (
			<button
				className={className}
				onClick={() => linkProps.onClick()}
				{...props}>
				<Icon className='h-1_5 w-1_5 mr-1 ' />
				<span>{linkProps.text}</span>
			</button>
		);

	return null;
};

const getListOfLinks = (
	profile: UserProfileOtherInfo,
	refetch: (
		variables?: Partial<Record<string, any>> | undefined
	) => Promise<ApolloQueryResult<any>>
) => {
	const unlinkGoogle = getUnlinkSocialMutation(
		profile,
		refetch,
		LoginStrategies.GOOGLE
	);

	return {
		[AccountSocial.GOOGLE_LINK]: {
			icon: GoogleIcon,
			text: 'Enlazar con Google',
			className:
				'border border-google-border hover:bg-google-hover dark:bg-white dark:text-white dark:text-white-dark dark:hover:bg-white-dark dark:hover:text-white',
			href: RestEndPoints.GOOGLE_LINK,
		},
		[AccountSocial.GOOGLE_UNLINK]: {
			icon: GoogleIcon,
			text: 'Eliminar cuenta',
			className:
				'border border-google-border hover:bg-google-hover dark:bg-white dark:text-white dark:text-white-dark dark:hover:bg-white-dark dark:hover:text-white',
			href: undefined,
			onClick: unlinkGoogle,
		},
	};
};

const getUnlinkSocialMutation = (
	profile: UserProfileOtherInfo,
	refetch: (
		variables?: Partial<Record<string, any>> | undefined
	) => Promise<ApolloQueryResult<any>>,
	strategy: LoginStrategies
) => {
	const mutation = GraphqlUser.user_unlink_social_profile;

	const [unlinkSocialMutation] = useMutation(mutation, {
		onCompleted: async () => {
			refetch();
			toast.success(AlertMessages.SOCIAL_UNLINK_SUCCESS);
		},
		onError: error => {
			toast.error(error.message);
		},
		variables: {
			input: {
				id: profile.socialAccounts.filter(
					account => account.type === strategy.toUpperCase()
				)[0]?.id,
				type: strategy,
			},
		},
	});

	return unlinkSocialMutation;
};

export default SocialLoginLink;
