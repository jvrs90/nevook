import { AccountSocial } from '@Enums/config/account-social.enum';
import { LoginStrategies } from '@Enums/config/login-strategies.enum';
import { ProfileContext } from '@Lib/context/profile.context';
import { FC, useContext } from 'react';
import SocialAccountLink from './social-account-link';

const SocialAccounts: FC = () => {
	const { profile } = useContext(ProfileContext);

	const kinds = {
		google: AccountSocial.GOOGLE_LINK,
	};

	profile.socialAccounts.forEach(account => {
		if (account.type === LoginStrategies.GOOGLE.toUpperCase())
			kinds.google = AccountSocial.GOOGLE_UNLINK;
	});

	return (
		<div className=' flexcol-c-c w-16 mx-auto mt-1'>
			<SocialAccountLink className='mt-1 w-full' kind={kinds.google} />
		</div>
	);
};

export default SocialAccounts;
