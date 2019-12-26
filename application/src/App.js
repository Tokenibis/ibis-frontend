import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import axios from "axios";

import { IbisProvider } from './Context'
import Authenticator from './Authenticator'
import Content from './Navigation/Content'

const config = require('./config.json');

axios.defaults.baseURL = config.ibis.api
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const client = new ApolloClient({
    link: new HttpLink({
	uri: `${config.ibis.api}/graphql/`,
	credentials: 'include',
	headers: {
	    'pwa-standalone': window.matchMedia('(display-mode: standalone)').matches,
	},
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


function App() {
    return (
	<ApolloProvider client={client}>
	  <MuiThemeProvider theme={theme}>
	    <IbisProvider value={{
		maxWindowWidth: 600,
		displayRatio: 0.4
	    }}>
	      <Authenticator>
		<Content />
	      </Authenticator>
	    </IbisProvider>
	  </MuiThemeProvider> 
	</ApolloProvider>
    );
};

export default App;
