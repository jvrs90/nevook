import { FC, ReactText } from 'react';

export type SelectItemProps = {
	value: string;
	children: ReactText;
};

/**
 * Custom select item component for {@link #Select}.
 *
 * @param props.value Option value
 * @param props.children Option text or number
 */
const SelectItem: FC<SelectItemProps> = ({ value, children }) => {
	return (
		<span
			className={`py-0_5 px-1 block whitespace-nowrap cursor-pointer truncate ${
				!value
					? 'bg-gray-400 dark:bg-white-dark text-primary font-semibold'
					: 'bg-secondary hover:bg-gray-400 dark:bg-gray-900 dark:hover:bg-white-dark'
			}`}>
			{children}
		</span>
	);
};

export default SelectItem;
