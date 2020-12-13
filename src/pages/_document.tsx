import { ThemeEnum } from '@Enums/config/theme.enum';
import Document, {
	DocumentContext,
	Head,
	Html,
	Main,
	NextScript,
} from 'next/document';

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);

		return initialProps;
	}

	render() {
		return (
			<Html
				lang='es'
				className={`${
					this.props.__NEXT_DATA__.props.pageProps.componentProps?.theme ||
					ThemeEnum.LIGHT
				}`}>
				<Head>
					<meta name='msapplication-tap-highlight' content='no'></meta>
					<meta name='msapplication-TileColor' content='#00aba9' />
					<meta name='theme-color' content='#ffffff' />
					<meta name='apple-mobile-web-app-title' content='LearnThis' />
					<meta name='apple-mobile-web-app-capable' content='yes' />
					<meta name='apple-mobile-web-app-status-bar-style' content='black' />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;