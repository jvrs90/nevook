import { UserProfile } from '@Interfaces/user/user.interface';

/**
 * Interface for authentication properties.
 */
export interface AuthProps {
	user?: UserProfile;
	jwt?: string;
}

/**
 * Interface for props obtained trough getServerSideProps
 */
export interface GSSProps {
	authProps?: AuthProps;
	lostAuth?: boolean;
	componentProps?: any;
}
