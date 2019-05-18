import React from 'react';
import Grid from '@material-ui/core/Grid';
import gql from "graphql-tag";
import { Query } from "react-apollo";

import Transaction from '../Transaction';
import TransactionCreate from '../TransactionCreate';

const GET_TRANSACTIONS = gql`
    query {
	allTransactions {
	    edges {
		node {
		    id
		    amount
		    target {
			username
		    }
		    user {
        		username
		    }
		}
	    }
	}
    }
`;

function TransactionRetrieve(props) {
    return (
	<Query query={GET_TRANSACTIONS}>
	  {({ loading, error, data }) => {
	      if (loading) return "Loading...";
	      if (error) return `Error! ${error.message}`;

	      return (
		  <Grid container direction="column" justify="center" alignItems="center">
		    {data.allTransactions.edges.map((x, i) => (
			<div style={{ color: "#b0bf25" }}
			     onClick={(e) => props.handleWindow(<Transaction />)}>
			  {x.node.user.username} sent {x.node.amount} to {x.node.target.username}
			</div>
		    ))}
		  </Grid>
	      );
	  }}
	</Query>
    );
};

function TransactionList(props) {
    return (
	<Grid container direction="column" justify="center" alignItems="center">
	  {TransactionRetrieve(props)}
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => props.handleWindow(<TransactionCreate />)}>
	    Transaction Create
	  </div>
	</Grid>
    );
}

export default TransactionList;
