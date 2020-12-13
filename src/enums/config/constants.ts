export enum AlertMessages {
	WELCOME = 'Bienvenido a Nevook',
	SERVER_ERROR = 'Se ha producido un error en el servidor',
	FORGOT_PASS_SENT = 'Se han enviado las instrucciones de recuperación a su correo. Por favor, revíselo.',
	ACTIVATION_SUCCESS = 'Ya puede iniciar sesión con su cuenta',
	PASSWORD_CHANGED = 'Contraseña cambiada con éxito',
	REGISTER_SUCCESS = 'Se le ha enviado un correo de activación, active su cuenta para poder iniciar sesión',
	SOCIAL_LOGIN_ERROR = 'Se ha producido un error en su inicio de sesión',
	SOCIAL_UNLINK_SUCCESS = 'Cuenta desvinculada',
	MODIFY_PROFILE_SUCCESS = 'Perfil modificado con éxito',
	MODIFY_PROFILE_ERROR = 'Completa el formulario correctamente',
	MODIFY_EMAIL_SUCCESS = 'Email modificado con éxito',
	MODIFY_USERNAME_SUCCESS = 'Nombre de usuario modificado con éxito',
	CHECKOUT_SUCCESS = 'Ya puede disfrutar del contenido adquirido',
	NOTHING_TO_MODIFY = 'Nada que modificar',
}

export enum FormMessages {
	NAME_REQUIRED = 'Introduce tu nombre',
	SURNAME_REQUIRED = 'Introduce tus apellidos',
	EMAIL_REQUIRED = 'Introduce un email',
	PASSWORD_REQUIRED = 'Introduce contraseña',
	CONFIRM_PASSWORD_REQUIRED = 'Introduce contraseña de nuevo',

	NAME_ERROR = 'Formato de nombre no válido',
	SURNAME_ERROR = 'Formato de apellidos no válido',
	EMAIL_ERROR = 'Email no válido',
	PASSWORD_ERROR = 'Formato de contraseña no válido',
	USERNAME_ERROR = 'Nombre de usuario no válido',
	BIRTHDATE_ERROR = 'Fecha de nacimiento no válida',
	BIO_ERROR = 'Bio no válida',

	PASSWORD_CHECK = 'Las contraseñas no coinciden',
}

export const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export const MONTHS = [
	'Enero',
	'Febrero',
	'Marzo',
	'Abril',
	'Mayo',
	'Junio',
	'Julio',
	'Agosto',
	'Septiembre',
	'Octubre',
	'Noviembre',
	'Diciembre',
];
