import Link from 'next/link';
import { FC } from 'react';

import { LeftArrowIcon } from '@Icons/menu/left-arrow-icon';

export type ProfileMobileNavProps = {
	title: string;
};

const ProfileMobileNav: FC<ProfileMobileNavProps> = ({ title }) => (
	<div className='relative flex-c-c shadow-lg bg-white dark:bg-white-dark text-center text-white-dark dark:text-white mb-0_5 h-2_5'>
		<h1 className='text-xl uppercase font-semibold'>{title}</h1>
		<Link href='/perfil'>
			<a className='absolute top-0 left-0_5'>
				<LeftArrowIcon className='h-2_5 p-0_5 fill-current' />
			</a>
		</Link>
	</div>
);

export default ProfileMobileNav;
