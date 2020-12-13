import ImgFallback from '@Components/generic/img-fallback';
import ProfileHeader from '@Components/profile/profile-header';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { RestEndPoints } from '@Enums/paths/rest-endpoints.enum';
import { AuthState } from '@Interfaces/states/browser-context.interface';
import { AuthContext } from '@Lib/context/auth.context';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import { Dispatch, FC, useContext, useState } from 'react';

const MenuPopover: FC = () => {
	const { stateAuth, setAuth } = useContext(AuthContext);

	const [popover, setPopover] = useState<boolean>(false);
	const router = useRouter();

	if (!stateAuth.user) return null;

	return (
		<>
			<div
				className='h-full px-0_5 flex-c-c xssm:hidden'
				onMouseEnter={() => setPopover(true)}
				onMouseLeave={() => setPopover(false)}>
				<ImgFallback
					className='rounded-full h-2 w-2 overflow-hidden'
					src={stateAuth.user.photo}
					alt='Foto de perfil'
					fallbackSrc={`https://avatars.dicebear.com/api/initials/${stateAuth.user.username}.svg`}
				/>
			</div>
			<div
				className={`absolute z100 top-3_875 right--0_5 overflow-y-hidden box-border transition-all-eio-250 shadow-xl rounded-xl ${
					popover ? 'opacity-1 max-h-30' : 'opacity-0 max-h-0'
				}`}
				onMouseEnter={() => setPopover(true)}
				onMouseLeave={() => setPopover(false)}>
				<div className='flexcol-c-c xssm:hidden bg-white dark:bg-white-dark px-1 pb-1_5 mt-1 rounded-xl '>
					<ProfileHeader
						email={stateAuth.user.email}
						username={stateAuth.user.username}
						alias={stateAuth.user.alias}
						photo={stateAuth.user.photo}
						isMenu
					/>
					<div className='mt-0_5 bg-white dark:bg-white-dark text-white-dark dark:text-white'>
						<Link href={MainPaths.PROFILE}>
							<a
								className='flex-c-c px-1 py-0_5 rounded-full border  border-secondary mb-1'
								onClick={() => setPopover(false)}>
								Mi perfil
							</a>
						</Link>
						<button
							className='flex-c-c px-1 py-0_5 rounded-full border  border-secondary'
							onClick={() => {
								setPopover(false);
								onClickLogout(router, setAuth);
							}}>
							Cerrar sesión
						</button>
					</div>
				</div>
			</div>
		</>
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

export default MenuPopover;
