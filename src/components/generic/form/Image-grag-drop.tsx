import {
	CSSProperties,
	FC,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import { DragDrop, DashboardModal } from '@uppy/react';
import ImageEditor from '@uppy/image-editor';
import { AuthContext } from '@Lib/context/auth.context';

type ImageDragDropProps = {
	url: string;
	name: string;
	current?: string;
	onChange?: (newUrl: string) => void;
	ratio?: number;
	rounded?: boolean;
};

/**
 * Avatar File upload
 *
 * @param name formData name
 * @param url api endponit
 * @param current current image url
 * @param onChange event image change
 * @param ratio image ascpect ratio
 */
const ImageDragDrop: FC<ImageDragDropProps> = ({
	name,
	url,
	current,
	onChange,
	ratio = 1,
	rounded = false,
}) => {
	const { stateAuth } = useContext(AuthContext);
	const [modal, setModal] = useState(false);
	const uppy = useMemo(() => {
		// Do all the configuration here
		return Uppy({
			allowMultipleUploads: false,
			restrictions: {
				allowedFileTypes: ['image/*'],
				minNumberOfFiles: 1,
				maxNumberOfFiles: 1,
			},
			onBeforeFileAdded: () => {
				setModal(true);
				return true;
			},
		})
			.use(ImageEditor, {
				cropperOptions: { initialAspectRatio: ratio, aspectRatio: ratio },
				actions: {
					cropSquare: false,
					cropWidescreen: false,
					cropWidescreenVertical: false,
				},
			})
			.use(XHRUpload, {
				endpoint: url,
				formData: true,
				fieldName: name,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${stateAuth.jwt}`,
				},
			});
	}, []);

	useEffect(() => {
		uppy.on('file-removed', () => {
			uppy.reset();
			setModal(false);
		});
		uppy.on('upload-success', (_file, response) => {
			uppy.reset();
			setModal(false);
			onChange && onChange(response.body.url);
		});
		return () => uppy.close();
	}, []);

	const imageStyle: CSSProperties | undefined = current
		? {
				backgroundImage: `url('${current}')`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
				opacity: 0.8,
		  }
		: undefined;

	return (
		<div
			className={`avatar-editor w-full h-full relative ${
				rounded ? 'rounded-full' : ''
			}`}>
			<DragDrop
				uppy={uppy}
				locale={{
					strings: {
						dropHereOr: 'Suelta la imagen o %{browse}',
						browse: 'pulsa aquí',
					},
				}}
			/>
			<DashboardModal
				showProgressDetails={true}
				onRequestClose={() => {
					uppy.reset();
					setModal(false);
				}}
				plugins={['ImageEditor']}
				open={modal}
				uppy={uppy}
			/>
			<div
				style={imageStyle}
				className='w-full h-full absolute top-0 pointer-events-none'
			/>
		</div>
	);
};

export default ImageDragDrop;
