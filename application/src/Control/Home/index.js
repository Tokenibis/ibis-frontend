import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';

import { BlankVal, GiveVal, SendVal, ConnectVal } from '../Cycler';
import Account from '../../Pages/Account';
import Give, { NonprofitVal, DonationVal } from '../Give';
import Send, { PersonVal, TransactionVal } from '../Send';
import Connect, { NewsVal, EventVal } from '../Connect';

const styles = theme => ({
    avatar: {
	margin: 10,
	width: 80,
	height: 80,
    }
});

function Home({ classes, handlePage }) {
    return (
	<Grid container direction="column" justify="center" alignItems="center">
	  <Avatar onClick={(e) => handlePage(<Account />, BlankVal)}
		  alt="Ibis"
		  src={require('../../Static/Images/avatar.jpg')}
		  className={classes.avatar} />
	  <p> Balance ${0}</p>

	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handlePage(<Give value={NonprofitVal} />, GiveVal)}>
	    Nonprofits
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handlePage(<Give value={DonationVal} />, GiveVal)}>
	    Donations
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handlePage(<Send value={PersonVal} />, SendVal)}>
	    People
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handlePage(<Send value={TransactionVal} />, SendVal)}>
	    Transactions
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handlePage(<Connect value={NewsVal} />, ConnectVal)}>
	    News
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handlePage(<Connect value={EventVal} />, ConnectVal)}>
	    Events
	  </div>
	</Grid>
    )
};

Home.propTypes = {
    handlePage: PropTypes.func.isRequired,
};

export default withStyles(styles)(Home);
