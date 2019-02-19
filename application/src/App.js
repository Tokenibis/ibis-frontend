import React, { Component } from 'react';

import Authenticator from './Authenticator/Authenticator'

class App extends Component {

    constructor() {
        super();
        this.state = { isAuthenticated: false, token: ''};
    }

    /* flag app the user as authenticated and set the token */
    authenticate = (token) => {
	this.setState({isAuthenticated: true, token: token})
    }

    /* flag app the user as unauthenticated and clear the token */
    logout = () => {
	this.setState({isAuthenticated: false, token: ''})
    }

    render() {

	let authenticatorView = <Authenticator authenticate={this.authenticate} />;

	// TODO: this will be replaced with logic for the rest of the app
	let appView = (
	    <div>
	      <p>Authenticated</p>
	      <div>
		<button onClick={this.logout} className="button">
		  Log out
		</button>
	      </div>
	    </div>
	)

	let content = !!this.state.isAuthenticated ? appView : authenticatorView;

	return (
            <div className="App">
	      {content}
            </div>
	);
    }
}

export default App;
