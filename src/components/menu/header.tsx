import React from 'react'
import LinkButton from '@Components/generic/link-button';
import SwitchDarkMode from '@Components/generic/switch-dark-mode';
import { ThemeEnum } from '@Enums/config/theme.enum';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { MenuIcon } from '@Icons/menu/menu-icon';
import { UserProfile } from '@Interfaces/user/user.interface';
import { menuController } from '@ionic/core';
import { BrowserContext } from '@Lib/context/resolution.context';
import Link from 'next/link';
import { FC, useContext } from 'react';
import MenuPopover from './menu-popover';


export type HeaderProps = {
	user?: UserProfile;
};

const Header: FC<HeaderProps> = ({user}) => {
    const { browserPreferences, toggleDarkMode } = useContext(BrowserContext);



    return (
        <header className='appBar relative bg-primary dark:bg-white-dark'>
        <div className='container-xl flex-c-c px-1 h-4'>
            <div className='flex-s-c flex-1'>
                <Link href='/'>
                    <a>
                        Icono Logo
                    </a>
                </Link>
                <div className='xssm:hidden flex-c-c px-2'>
                    <Link href={MainPaths.BOOKS}>
                        <a className='px-0_5 py-0_25 font-semibold text-white dark:text-white'>
                            Libros
                        </a>
                    </Link>
                    <Link href={MainPaths.ABOUT}>
                        <a className='px-0_5 py-0_25 font-semibold text-white dark:text-white'>
                            Sobre nosotros
                        </a>
                    </Link>
                    <Link href={MainPaths.CONTACT}>
                        <a className='px-0_5 py-0_25 font-semibold text-white dark:text-white'>
                            Contacto
                        </a>
                    </Link>
                </div>
            </div>
            <div className='relative flex-e-c flex-1 h-full'>
                <SwitchDarkMode
                    onChange={toggleDarkMode}
                    checked={browserPreferences.theme === ThemeEnum.DARK}
                />
                {user ? (
                    <MenuPopover />
                ) : (
                    <>
                    <Link href={MainPaths.LOGIN}>
                        <a className='px-0_5 py-0_25  text-white dark:text-white'>
                            Iniciar sesión
                        </a>
                    </Link>
                    <LinkButton className='xssm:hidden font-semibold' href='/registro' kind='cta'>
                        Registrarse
                    </LinkButton>
                    </>
                )}
                <MenuIcon
                    className='mdlg:hidden h-1_75 fill-current text-white-dark dark:text-white'
                    onClick={() => menuController.toggle('menuMob')}
                />
            </div>
        </div>
    </header>
    )
}

export default Header
