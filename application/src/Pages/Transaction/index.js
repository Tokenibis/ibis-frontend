import React from 'react';
import Grid from '@material-ui/core/Grid';

import Person from '../Person';
import CommentList from '../CommentList';

function Transaction({ handlePage }) {
    return (
	<Grid container direction="column" justify="center" alignItems="center">
	  <p> Transaction </p>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handlePage(<Person />)}>
	    Sender
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handlePage(<Person />)}>
	    Receiver
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handlePage(<CommentList />)}>
	    Comment List
	  </div>
	</Grid>
    );
};

export default Transaction;
