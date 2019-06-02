import React from 'react';
import gql from "graphql-tag";
import QueryHelper from "../__Common__/QueryHelper";

import PersonSublist from './sublist';

const QUERY = gql`
    query {
  	allIbisUsers {
  	    edges {
  		node {
  		    id
       		    firstName
  		    lastName
		    username
		    balance
		    followerCount
		    followingCount
		    user {
			dateJoined
		    }
  		    nonprofit {
  			id
  		    }
  		}
  	    }
  	} 
    }    
`;

function PersonList({ classes, handleWindow }) {
    function parseAll(data){
	return (
	    <PersonSublist
		scrollButton
		data={data[Object.keys(data)[0]]}
		handleWindow={handleWindow}
	    />
	);	
    };

    return <QueryHelper query={QUERY} makeList={parseAll} />
};

export default PersonList;
