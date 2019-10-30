import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { IbisProvider } from './Context'
import Authenticator from './Authenticator'
import Content from './Navigation/Content'

const client = new ApolloClient({
    link: new HttpLink({
	uri: "https://api.tokenibis.org/graphql/",
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
	    main: '#84ab3f',
	},
	tertiary: {
	    main: '#808080',
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
        this.state = {
	    userID: '',
	};
    };

    /* flag app the user as authenticated and set the token */
    authenticate = (userID) => {
	this.setState({ userID })
    };

    /* flag app the user as unauthenticated and clear the token */
    logout = () => {
	this.setState({ userID: '' })
    };

    render() {
	let { userID } = this.state;

	let content;

	if (userID === '') {
	    content = <Authenticator authenticate={this.authenticate} />;
	} else {
	    content = <Content />;
	}

	return (
	    <ApolloProvider client={client}>
	      <MuiThemeProvider theme={theme}>
		<IbisProvider value={{ userID, maxWindowWidth: 600, displayRatio: 0.4 }}>
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
