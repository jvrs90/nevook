import { Gender } from '@Enums/generic/gender.enum';
import { LoginStrategies } from '@Enums/config/login-strategies.enum';
export interface UserProfile {
	email: string;
	name: string;
	surname: string;
	username: string;
	alias?: string;
	photo?: string;
}

export interface UserProfileOtherInfo {
	bio?: string;
	gender?: Gender;
	birthDate?: string;
	isSocialLogin: boolean;
	socialAccounts: SocialAccount[];
}

export interface SocialAccount {
	id: string;
	type: LoginStrategies;
}


export interface FullUserProfile extends UserProfile, UserProfileOtherInfo {}
