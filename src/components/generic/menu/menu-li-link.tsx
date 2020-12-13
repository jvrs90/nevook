import { ComponentProps, FC } from 'react';
import Link from 'next/link';

export interface MenuLiLinkProps extends ComponentProps<'a'> {
	icon: FC<ComponentProps<'svg'>>;
	label: string;
	href: string;
	as?: string;
	active?: boolean;
}

const MenuLiLink: FC<MenuLiLinkProps> = ({
	icon,
	label,
	href,
	active,
	...props
}) => {
	const Icon = icon;

	const classNames = ['flex-s-c px-1_5 py-0_5'];

	active
		? classNames.push('text-primary ')
		: classNames.push('hover:text-primary');

	return (
		<li className='py-0_375'>
			<Link href={href}>
				<a className={classNames.join(' ')} {...props}>
					<Icon className='w-1_5 mr-1 fill-current' />
					<span>{label}</span>
				</a>
			</Link>
		</li>
	);
};

export default MenuLiLink;
