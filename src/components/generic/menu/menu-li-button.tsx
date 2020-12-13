import { ComponentProps, FC } from 'react';

export interface MenuLiLinkButton extends ComponentProps<'button'> {
	icon: FC<ComponentProps<'svg'>>;
	label: string;
	active?: boolean;
}

const MenuLiButton: FC<MenuLiLinkButton> = ({
	icon,
	label,
	active,
	...props
}) => {
	const Icon = icon;

	const classNames = ['flex-s-c px-1_5 py-0_5 w-full'];
	// TODO: Cambiar colores seleccionados
	active
		? classNames.push('text-primary ')
		: classNames.push('hover:text-primary');

	return (
		<li className='py-0_375'>
			<button className={classNames.join(' ')} {...props}>
				<Icon className='w-1_25 mr-1 fill-current' />
				<span>{label}</span>
			</button>
		</li>
	);
};

export default MenuLiButton;
