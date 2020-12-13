import { MainPaths } from '@Enums/paths/main-paths.enum';
import { ContactIcon } from '@Icons/menu/contact-icon';
import { menuController } from '@ionic/core';
import { IonMenu } from '@ionic/react';
import { AuthContext } from '@Lib/context/auth.context';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useContext, useEffect } from 'react';
import MenuLiLink from '../generic/menu/menu-li-link';
import { CloseIcon } from '../icons';
import ProfileHeader from '../profile/profile-header';

const MenuMobile: FC = () => {
	const { stateAuth } = useContext(AuthContext);

	const router = useRouter();

	useEffect(() => {
		const handleRouteChange = async () => {
			(await menuController.isOpen('menuMob')) &&
				menuController.close('menuMob');
		};

		router.events.on('routeChangeStart', handleRouteChange);

		return () => {
			router.events.off('routeChangeStart', handleRouteChange);
		};
	}, []);

	return (
		<IonMenu
			side='end'
			menuId='menuMob'
			contentId='menuMobContent'
			maxEdgeStart={80}
			type='push'
			className='absolute'>
			<div className='relative bg-white dark:bg-white-dark text-white-dark dark:text-white z100 h-screen w-full py-1 px-2 overflow-y-auto'>
				<CloseIcon
					className='absolute top-1 right-1 h-1_5 fill-current'
					onClick={() => menuController.toggle('menuMob')}
				/>
				<div className='w-full flexcol-c-c pb-1_5 mb-1 border-b border-secondary'>
					{stateAuth.user ? (
						<>
							<ProfileHeader
								email={stateAuth.user.email}
								username={stateAuth.user.username}
								alias={stateAuth.user.alias}
								photo={stateAuth.user.photo}
								isMenu
							/>
							<Link href={MainPaths.PROFILE}>
								<a className='flex px-1 py-0_5 rounded-full border  border-secondary'>
									Mi perfil
								</a>
							</Link>
						</>
					) : (
						<>
                            ICONO LOGO

							<Link href={MainPaths.LOGIN}>
								<a className='flex px-1 py-0_5 mt-1 rounded-full border  border-secondary'>
									Iniciar sesión
								</a>
							</Link>
						</>
					)}
				</div>

				<ul>
					<MenuLiLink
						href={stateAuth.user ? MainPaths.PROFILE : MainPaths.LOGIN}
						icon={CoursesIcon}
						label='Academia'
					/>
					<MenuLiLink
						href={MainPaths.COURSES}
						icon={CoursesIcon}
						label='Cursos'
					/>
					<MenuLiLink
						href={MainPaths.ABOUT}
						icon={AboutIcon}
						label='Sobre nosotros'
					/>
					<MenuLiLink
						href={MainPaths.CONTACT}
						icon={ContactIcon}
						label='Contacto'
					/>
				</ul>
				<div className='w-full py-1_5 mt-1 border-t border-secondary'>
					<Link href={MainPaths.PRIVACY_POLICY}>
						<a className='flex w-full py-0_5 px-1_5'>Política de privacidad</a>
					</Link>
					<Link href={MainPaths.COOKIES_POLICY}>
						<a className='flex w-full py-0_5 px-1_5'>Política de cookies</a>
					</Link>
					<Link href={MainPaths.LEGAL_NOTICE}>
						<a className='flex w-full py-0_5 px-1_5'>Aviso legal</a>
					</Link>
				</div>
			</div>
		</IonMenu>
	);
};

export default MenuMobile;

