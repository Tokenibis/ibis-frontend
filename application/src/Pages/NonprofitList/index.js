import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import QueryHelper from "../__Common__/QueryHelper";

import NonprofitSublist from './sublist';

const QUERY = gql`
    query {
  	allNonprofits(first: 25) {
  	    edges {
  		node {
		    id
  		    title
  		    description
		    user {
			username
		    }
  		}
  	    }
  	}
    }
`;

function NonprofitList({ classes, handleWindow }) {
    function parseAll(data){
	return (
	    <NonprofitSublist
		scrollButton
		data={data[Object.keys(data)[0]]}
		handleWindow={handleWindow}
	    />
	);	
    };

    return <QueryHelper query={QUERY} makeList={parseAll} />
};

export default NonprofitList;
