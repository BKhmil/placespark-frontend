import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import NotFoundPage from '../pages/404/NotFoundPage';
import VerifyEmailPage from '../pages/Auth/VerifyEmailPage';
import HomePage from '../pages/Home/HomePage';
import ProfilePage from '../pages/Profile/ProfilePage';
import SignInPage from "../pages/Auth/SignInPage";
import SignUpPage from "../pages/Auth/SignUpPage";

export const routes: RouteObject[] = [
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{ index: true, element: <HomePage /> },
			{ path: 'profile', element: <ProfilePage /> },
			{
				path: 'auth',
				children: [
					{ path: 'sign-in', element: <SignInPage /> },
					{ path: 'sign-up', element: <SignUpPage /> },
				],
			},
		],
	},
	{
		path: '/auth/verify-email',
		element: <VerifyEmailPage />,
	},
	{
		path: '*',
		element: <NotFoundPage />,
	},
];

const router = createBrowserRouter(routes);
export default router;
