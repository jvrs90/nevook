import { ComponentProps, FC, useEffect, useRef } from 'react';

const isImageValid = (src: string) => {
	let promise = new Promise(resolve => {
		let img = document.createElement('img');
		img.onerror = () => resolve(false);
		img.onload = () => resolve(true);
		img.src = src;
	});

	return promise;
};

interface ImgFallbackprops extends ComponentProps<'img'> {
	src: string | undefined;
	fallbackSrc: string;
}

const ImgFallback: FC<ImgFallbackprops> = ({ src, fallbackSrc, ...rest }) => {
	const imgEl = useRef<HTMLImageElement>(null);
	useEffect(() => {
		if (src)
			isImageValid(src).then(isValid => {
				if (!isValid && imgEl && imgEl.current) {
					imgEl.current.src = fallbackSrc;
				}
			});
		else if (imgEl.current) imgEl.current.src = fallbackSrc;
	}, [src]);

	return <img {...rest} ref={imgEl} src={src} />;
};

export default ImgFallback;
