import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProfileLayout from '../layouts/ProfileLayout';
import NotFoundPage from '../pages/404/NotFoundPage';
import SignInPage from '../pages/Auth/SignInPage';
import SignUpPage from '../pages/Auth/SignUpPage';
import VerifyEmailPage from '../pages/Auth/VerifyEmailPage';
import HomePage from '../pages/Home/HomePage';
import PlacePage from '../pages/Places/PlacePage';
import PlacesPage from '../pages/Places/PlacesPage';
import AdminPage from '../pages/Profile/AdminPage';
import CreatePlacePage from '../pages/Profile/CreatePlacePage';
import EditPlacePage from '../pages/Profile/EditPlacePage';
import FavoritesPage from '../pages/Profile/FavoritesPage';
import MyPlacesPage from '../pages/Profile/MyPlacesPage';
import ProfileMainPage from '../pages/Profile/ProfileMainPage';
import ProfileSecurityPage from '../pages/Profile/ProfileSecurityPage';

export const routes: RouteObject[] = [
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{ index: true, element: <HomePage /> },
			{
				path: 'profile',
				element: <ProfileLayout />,
				children: [
					{ index: true, element: <ProfileMainPage /> },
					{ path: 'my-places', element: <MyPlacesPage /> },
					{ path: 'edit-place/:placeId', element: <EditPlacePage /> },
					{ path: 'create-place', element: <CreatePlacePage /> },
					{ path: 'favorites', element: <FavoritesPage /> },
					{ path: 'security', element: <ProfileSecurityPage /> },
					{ path: 'admin', element: <AdminPage /> },
				],
			},
			{ path: 'places', element: <PlacesPage /> },
			{ path: 'places/:placeId', element: <PlacePage /> },
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
