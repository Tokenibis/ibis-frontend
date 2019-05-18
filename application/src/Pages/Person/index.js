import React from 'react';
import Grid from '@material-ui/core/Grid';

import DonationList from '../DonationList';
import TransactionList from '../TransactionList';
import PersonList from '../PersonList';
import CommentList from '../CommentList';

function Person({ handleWindow }) {
    return (
	<Grid container direction="column" justify="center" alignItems="center">
	  <p> Person </p>
	  <div style={{ color: "#b0bf25" }}
	       onClick={(e) => handleWindow(<DonationList />)}>
	    Donation List
	  </div>
	  <div style={{ color: "#b0bf25" }}
	       onClick={(e) => handleWindow(<TransactionList />)}>
	    Transaction List
	  </div>
	  <div style={{ color: "#b0bf25" }}
	       onClick={(e) => handleWindow(<PersonList />)}>
	    Following
	  </div>
	  <div style={{ color: "#b0bf25" }}
	       onClick={(e) => handleWindow(<PersonList />)}>
	    Followers
	  </div>
	  <div style={{ color: "#b0bf25" }}
	       onClick={(e) => handleWindow(<CommentList />)}>
	    Comment List (User Activity)
	  </div>
	</Grid>
    );
};

export default Person;
