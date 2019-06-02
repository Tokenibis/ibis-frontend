import React from 'react';
import gql from "graphql-tag";
import QueryHelper from "../__Common__/QueryHelper";

import NewsSublist from './sublist';

const QUERY = gql`
    query {
	allArticles {
	    edges {
		node {
		    id
		    title
		    description
		    created
		    user {
			id
			nonprofit {
			    id
			}
		    }
		}
	    }
	}
    }
`;

function NewsList({ classes, handleWindow }) {
    function parseAll(data){
	return (
	    <NewsSublist
		scrollButton
		data={data[Object.keys(data)[0]]}
		handleWindow={handleWindow}
	    />
	);	
    };

    return <QueryHelper query={QUERY} makeList={parseAll} />
};

export default NewsList;
