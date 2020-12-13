import { registerEnumType } from '@nestjs/graphql';

/**
 * Gender enum
 */
export enum Gender {
	MALE = 'MALE',
	FEMALE = 'FEMALE',
	OTHER_GENDER = 'OTHER_GENDER',
	RATHER_NOT_SAY = 'RATHER_NOT_SAY',
}

export const GenderValues = Object.values(Gender);

registerEnumType(Gender, { name: 'Gender' });
