import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import NewsList from '../NewsList';
import EventList from '../EventList';
import DonationList from '../DonationList';

function Nonprofit({ handleWindow }) {
    return (
	<Grid container direction="column" justify="center" alignItems="center">
	  <p> Nonprofit </p>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<NewsList />)}>
	    News List
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<EventList />)}>
	    Events List
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<DonationList />)}>
	    Donations List 
	  </div>
	</Grid>
    );
};

Nonprofit.propTypes = {
    handleWindow: PropTypes.func.isRequired,
};

export default Nonprofit;
