import DarkIcon from '@Components/icons/dark-mode/dark-icon';
import LightIcon from '@Components/icons/dark-mode/light-icon';
import React, { ChangeEvent, FC, HTMLProps } from 'react';

export interface CheckBoxProps extends HTMLProps<HTMLInputElement> {
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	checked?: boolean;
}

const SwitchDarkMode: FC<CheckBoxProps> = ({
	className,
	onChange,
	checked,
}) => {
	return (
		<div className={`relative w-2 mr-2 select-none ${className}`}>
			<label className='toggle-label block overflow-hidden h-1 rounded-full bg-secondary cursor-pointer transition-all-ei-250'>
				<input
					type='checkbox'
					onChange={onChange}
					checked={checked}
					className='block w-2 h-1 rounded-full appearance-none cursor-pointer'
				/>
				{checked ? (
					<DarkIcon className='darkTranslate h-1_25 absolute top--0_125 rounded-full text-white-dark bg-white' />
				) : (
					<LightIcon className='lightTranslate h-1_25 absolute top--0_125 rounded-full text-white bg-white-dark' />
				)}
				<label className='pointer-events-none toggle-label block overflow-hidden h-1 rounded-full bg-secondary cursor-pointer transition-all-ei-250'></label>
			</label>
		</div>
	);
};

export default SwitchDarkMode;
