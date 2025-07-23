import { RouterProvider } from 'react-router-dom';
import AuthInit from './components/AuthInit';
import router from './router';

const App = () => {
	return (
		<>
			<AuthInit />
			<RouterProvider router={router} />
		</>
	);
}

export default App;
