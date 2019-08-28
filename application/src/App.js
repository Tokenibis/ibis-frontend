import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { IbisProvider } from './Context'
import Authenticator from './Authenticator'
import Content from './Navigation/Content'

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const client = new ApolloClient({
    link: new HttpLink({
	uri: 'https://api.tokenibis.org/graphql/',
	credentials: 'include',
    }),
    cache: new InMemoryCache(),
});

const theme = createMuiTheme({
    typography: {
	useNextVariants: true,
    },
    palette: {
	primary: {
	    main: '#3b3b3b',
	},
	secondary: {
	    main: '#b0bf24',
	},
	tertiary: {
	    main: '#9b9b9b',
	},
	light: {
	    main: '#f2f2f2',
	},
	lightBackground: {
	    main: '#f4f4f4',
	},
    },
});


class App extends Component {

    constructor() {
        super();
	// Temorarily allow authentication for developing
        this.state = {
	    isAuthenticated: true,
	    userID: 'SWJpc1VzZXJOb2RlOjc1',
	    token: '',
	};
    };

    componentWillMount() {
	document.title = 'Token Ibis';
    };

    /* flag app the user as authenticated and set the token */
    authenticate = (token) => {
	this.setState({isAuthenticated: true, token: token})
    };

    /* flag app the user as unauthenticated and clear the token */
    logout = () => {
	this.setState({isAuthenticated: false, token: ''})
    };

    render() {

	let { isAuthenticated, userID } = this.state;

	let authenticatorView = <Authenticator authenticate={this.authenticate} />;
	let appView = <Content />;

	let content = !!isAuthenticated ? appView : authenticatorView;

	return (
	    <ApolloProvider client={client}>
	      <MuiThemeProvider theme={theme}>
		<IbisProvider value={{ userID }}>
		  <div className="App">
		    {content}
		  </div>
		</IbisProvider>
	      </MuiThemeProvider> 
	    </ApolloProvider>
	);
    };
};

export default App;
