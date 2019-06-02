import React from 'react';
import gql from "graphql-tag";
import QueryHelper from "../__Common__/QueryHelper";

import TransactionSublist from './sublist';

const QUERY = gql`
    query {
	allTransactions {
	    edges {
		node {
		    id
		    amount
		    description
		    created
		    target {
			firstName
			lastName
			nonprofit {
			    id
			    title
			}
		    }
		    user {
        		firstName
			lastName
		    }
		}
	    }
	}
    }
`;

function TransactionList({ classes, handleWindow }) {
    function parseAll(data){
	return (
	    <TransactionSublist
		scrollButton
		data={data[Object.keys(data)[0]]}
		handleWindow={handleWindow}
	    />
	);	
    };

    return <QueryHelper query={QUERY} makeList={parseAll} />
};

export default TransactionList;
