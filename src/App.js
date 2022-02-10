import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './views/Header';
import { MainContainer } from './views/MainContainer';
import { Footer } from './views/Footer';

function App() {
	return (
		<>
			<Header />
			<Routes>
				<Route
					exact
					path="/"
					element={<Navigate replace to="/transactions/1" />}
				/>
				<Route
					exact
					path="transactions/:page"
					element={<MainContainer />}
				/>
			</Routes>
			<Footer />
		</>
	);
}

export default App;
