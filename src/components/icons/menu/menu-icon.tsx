import { ComponentProps, FC } from 'react';

export const MenuIcon: FC<ComponentProps<'svg'>> = props => (
	<svg {...props} viewBox='0 0 512 512'>
		<path d='M492 236H20c-11.046 0-20 8.954-20 20s8.954 20 20 20h472c11.046 0 20-8.954 20-20s-8.954-20-20-20zm0-160H20C8.954 76 0 84.954 0 96s8.954 20 20 20h472c11.046 0 20-8.954 20-20s-8.954-20-20-20zm0 320H20c-11.046 0-20 8.954-20 20s8.954 20 20 20h472c11.046 0 20-8.954 20-20s-8.954-20-20-20z' />
	</svg>
);
