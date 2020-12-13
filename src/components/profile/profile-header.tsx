import ImgFallback from '@Components/generic/img-fallback';
import { FC } from 'react';

type ProfileHeaderProps = {
    username: string;
	alias: string;
	email: string;
	photo?: string;
	isMenu?: boolean;
};

export const ProfileHeader: FC<ProfileHeaderProps> = ({
    username,
	alias,
	email,
	photo,
	isMenu,
}) => (
	<div
		className={`p-1_5 flexcol-c-c ${
			isMenu ? '' : 'shadow-lg'
		} bg-white dark:bg-white-dark text-center text-white-dark dark:text-white`}>
		<ImgFallback
			className='rounded-full h-6 w-6 mb-1'
			src={photo}
			alt='Foto de perfil'
			fallbackSrc={`https://avatars.dicebear.com/api/initials/${username}.svg`}
		/>

		<span className='text-lg font-semibold'>{`${username} ${alias}`}</span>
		<span className='break-all'>{email}</span>
	</div>
);

export default ProfileHeader;
