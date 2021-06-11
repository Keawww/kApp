import React, { useState } from 'react';
import { BrowserRouter as Router, Route   } from 'react-router-dom';
import fire from './fire.js';
import Login from './components/session/Login';
import Main from './components/Main';


function App() {

	const [isLoggedIn, setIsLoggedIn] = useState(false);

	fire.auth().onAuthStateChanged((user) => {
		return user ? setIsLoggedIn(true) : setIsLoggedIn(false);
	});

	const signOut = () => {
		fire.auth().signOut()
	};

	console.log(isLoggedIn);

	return (
		<>
			<Router>
			{
				!isLoggedIn
				? (
					<Route exact to="/Login" component={Login} />
				): (

					<Route exact to="/" component={Main} />
				)
			}	
			</Router>
		</>
	)
}

export default App;
