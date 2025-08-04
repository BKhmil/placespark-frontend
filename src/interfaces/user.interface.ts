export interface IUser {
	_id: string;
	name: string;
	photo: string;
	email: string;
	isVerified: boolean;
	createdAt: string;
	updatedAt: string;
	role: string;
	admin_establishments: string[];
	favorites: string[];
}
