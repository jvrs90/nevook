import { DownArrowIcon } from '@Icons/menu/down-arrow-icon';
import { Field, FieldHookConfig, useField } from 'formik';
import {
	Children,
	FC,
	ReactElement,
	ReactText,
	RefObject,
	useEffect,
	useRef,
	useState,
} from 'react';
import SelectItem, { SelectItemProps } from './select-item';

type SelectProps = {
	label: string;
	className?: string;
	children: ReactElement<SelectItemProps, 'SelectItem'>[];
};

/**
 * Formik's custom select component.
 *
 * Only allows {@link #SelectItem} elements as children.
 *
 * @param props.label HTML label text
 * @param props.placeholder Input placeholder
 * @param props.className Additional classname
 * @param props.children SelectItem children
 * @param props Other HTML input props
 */
const Select: FC<SelectProps & FieldHookConfig<string>> = ({
	label,
	placeholder,
	className = '',
	children,
	...props
}) => {
	const dropDownRef = useRef<HTMLUListElement>(null);

	const [field, meta, helpers] = useField(props);
	const { isOpened, setOpened } = useDropDown(dropDownRef);

	const initialText = field.value
		? Children.map(children, (child: ReactElement<SelectItemProps>) => {
				if (child.type !== SelectItem)
					throw new Error('Select component only accept SelectItem as a child');
				if (child.props.value === field.value) return child.props.children;
		  })[0]
		: placeholder || '';

	const [selectedText, setSelectedText] = useState<ReactText>(initialText);

	return (
		<div className={`flexcol-c-s ${className}`}>
			<span className='mb-0_25 ml-0_5 text-white-dark dark:text-white'>
				{label}
			</span>
			<div className='inline-block relative min-w-full'>
				<span
					onClick={() => setOpened(!isOpened)}
					className={`bg-secondary dark:bg-gray-900 text-white-dark dark:text-white rounded-lg border cursor-pointer py-0_5 px-1 flex-sb-c flex w-full truncate min-h-1_5 ${
						meta.touched && meta.error ? 'border-red' : 'border-primary'
					}`}>
					{selectedText}
				</span>
				{meta.touched && meta.error && (
					<p className='text-red text-sm ml-1'>{meta.error}</p>
				)}
				<Field readOnly className='hidden' {...props} {...field} />
				<DownArrowIcon
					className={`absolute top-0_875 pointer-events-none right-1 fill-current min-w-1 h-1 w-1 transform transition-all-eio-250 text-white-dark dark:text-white ${
						isOpened ? 'rotate-0' : '-rotate-90'
					}`}
				/>

				<ul
					ref={dropDownRef}
					className={`absolute z10 top-100 my-0_75 w-full transition-max-h-eio-250 rounded shadow-lg overflow-y-hidden ${
						isOpened ? 'max-h-14' : 'max-h-0'
					}`}
					onTransitionEnd={() => {
						if (dropDownRef.current?.classList.contains('overflow-y-hidden')) {
							dropDownRef.current?.classList.remove('overflow-y-hidden');
							dropDownRef.current?.classList.add('overflow-y-auto');
						} else {
							dropDownRef.current?.classList.remove('overflow-y-auto');
							dropDownRef.current?.classList.add('overflow-y-hidden');
						}
					}}>
					{Children.map(children, (child: ReactElement<SelectItemProps>) => {
						const { value, children: text } = child.props;

						return (
							<li
								key={value}
								className={`w-full text-white-dark dark:text-white ${
									value === field.value ? 'border-l-4 border-primary' : ''
								}`}
								onClick={() => {
									setOpened(false);
									setSelectedText(text);
									helpers.setError('');
									helpers.setValue(value);
								}}>
								{child}
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
};

/**
 * Handles click events on select options container.
 * @param dropDownRef HTML dropdown reference
 */
const useDropDown = (dropDownRef: RefObject<HTMLUListElement>) => {
	const [isOpened, setOpened] = useState(false);

	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			if (!dropDownRef.current?.contains(event.target as Node)) {
				setOpened(false);
			}
		};

		if (isOpened) document.addEventListener('click', handleClick);
		else document.removeEventListener('click', handleClick);

		return () => document.removeEventListener('click', handleClick);
	}, [isOpened]);

	return { isOpened, setOpened };
};

export default Select;
