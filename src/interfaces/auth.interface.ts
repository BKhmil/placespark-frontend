import type { ITokenPair } from "./token-pair.interface";
import type { IUser } from "./user.interface";

export interface ISignUpRequest {
	email: string;
	password: string;
	name: string;
	role: string;
}
export interface ISignInRequest {
	email: string;
	password: string;
}
export interface IAuthResponse {
	user: IUser;
	tokens: ITokenPair;
}