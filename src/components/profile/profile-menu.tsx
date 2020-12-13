import MenuLiButton from '@Components/generic/menu/menu-li-button';
import MenuLiLink from '@Components/generic/menu/menu-li-link';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { ProfilePaths } from '@Enums/paths/profile-paths.enum';
import { RestEndPoints } from '@Enums/paths/rest-endpoints.enum';
import { LogoutIcon } from '@Icons/menu/logout-icon';
import { UserIcon } from '@Icons/menu/user-icon';
import { AuthState } from '@Interfaces/states/browser-context.interface';
import { AuthContext } from '@Lib/context/auth.context';
import { NextRouter, useRouter } from 'next/router';
import { Dispatch, FC, useContext } from 'react';
import ProfileHeader from './profile-header';

const ProfileMenu: FC = () => {
	const { stateAuth, setAuth } = useContext(AuthContext);

	const router = useRouter();
	const currentPath = router.asPath.split('?')[0];

	const { user } = stateAuth;

	if (!user) return null;

	return (
		<div className='w-full max-w-22 mx-auto'>
			<ProfileHeader
				email={user.email}
				username={user.username}
				alias={user.alias || ''}
				photo={user.photo}
			/>
			<ul className='mt-0_5 shadow-lg bg-white dark:bg-white-dark text-white-dark dark:text-white'>
				<MenuLiLink
					href={ProfilePaths.SUMMARY}
					active={currentPath === ProfilePaths.SUMMARY}
					label='Resumen'
					icon={UserIcon}
				/>
				<MenuLiLink
					href={ProfilePaths.DATA}
					active={currentPath === ProfilePaths.DATA}
					label='Mis datos'
					icon={UserIcon}
				/>
				<MenuLiLink
					href={ProfilePaths.ORDERS}
					active={currentPath === ProfilePaths.ORDERS}
					label='Mis pedidos'
					icon={UserIcon}
				/>
				<MenuLiLink
					href={ProfilePaths.PREFERENCES}
					active={currentPath === ProfilePaths.PREFERENCES}
					label='Mis preferencias'
					icon={UserIcon}
				/>
			</ul>

			<ul className='mt-0_5 shadow-lg bg-white dark:bg-white-dark text-white-dark dark:text-white'>
				<MenuLiLink
					href={ProfilePaths.ACCOUNTS}
					active={currentPath === ProfilePaths.ACCOUNTS}
					label='Cuentas y correos'
					icon={UserIcon}
				/>
				<MenuLiLink
					href={ProfilePaths.PASSWORD}
					active={currentPath === ProfilePaths.PASSWORD}
					label='Contraseña'
					icon={UserIcon}
				/>
			</ul>

			<ul className='mt-0_5 shadow-lg bg-white dark:bg-white-dark text-white-dark dark:text-white'>
				<MenuLiLink
					href={ProfilePaths.HELP}
					active={currentPath === ProfilePaths.HELP}
					label='Ayuda'
					icon={UserIcon}
				/>
			</ul>

			<ul className='mt-0_5 shadow-lg bg-white dark:bg-white-dark text-white-dark dark:text-white'>
				<MenuLiButton
					label='Logout'
					icon={LogoutIcon}
					onClick={() => onClickLogout(router, setAuth)}
				/>
			</ul>
		</div>
	);
};

const onClickLogout = async (
	router: NextRouter,
	setAuth: Dispatch<AuthState>
) => {
	await fetch(RestEndPoints.LOGOUT, {
		method: 'POST',
	});

	await router.push(MainPaths.INDEX);

	setAuth({
		jwt: undefined,
		user: undefined,
	});
};

export default ProfileMenu;
