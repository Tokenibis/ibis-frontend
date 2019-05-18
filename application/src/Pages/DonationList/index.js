import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import Donation from '../Donation';
import DonationCreate from '../DonationCreate';

function DonationList({ handleWindow }) {
    return (
	<Grid container direction="column" justify="center" alignItems="center">
	  <p> Donation List </p>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<Donation />)}>
	    Donation 1
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<Donation />)}>
	    Donation 2
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<Donation />)}>
	    ...
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<DonationCreate />)}>
	    DonationCreate
	  </div>
	</Grid>
    );
};

DonationList.propTypes = {
    handleWindow: PropTypes.func.isRequired,
};

export default (DonationList);
