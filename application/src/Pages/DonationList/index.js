import React from 'react';
import gql from "graphql-tag";
import QueryHelper from "../__Common__/QueryHelper";

import DonationSublist from './sublist';

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

function DonationList({ classes, handleWindow }) {
    function parseAll(data){
	return (
	    <DonationSublist
		scrollButton
		data={data[Object.keys(data)[0]]}
		handleWindow={handleWindow}
	    />
	);	
    };

    return <QueryHelper query={QUERY} makeList={parseAll} />
};

export default DonationList;
