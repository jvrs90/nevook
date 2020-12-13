import { FC } from 'react';
import SocialLoginLink from './social-login-link';

const SocialLogins: FC = () => (
	<div className=' flexcol-c-c w-16 mx-auto mt-1'>
		<SocialLoginLink className='mt-1 w-full' kind='google' />
	</div>
);

export default SocialLogins;
