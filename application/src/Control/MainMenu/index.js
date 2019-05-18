import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import Avatar from '@material-ui/core/Avatar';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { BlankVal, GiveVal, SendVal, ConnectVal } from '../Cycler';
import Give, { NonprofitVal, DonationVal } from '../Give';
import Send, { PersonVal, TransactionVal } from '../Send';
import Connect, { NewsVal, EventVal } from '../Connect';
import Account from '../../Pages/Account';
import Settings from '../../Pages/Settings';
import QRScan from '../../Pages/QRScan';
import Help from '../../Pages/Help';

const styles = theme => ({
    avatar: {
	margin: 10,
	width: 80,
	height: 80,
    },
    avatarItem: {
	height: 80,
    }
});

function SubMenu({ name, options, expanded, onChange }) {
    return (
	<ExpansionPanel 
	    expanded={expanded} 
	    onChange={onChange}
	>
	  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
	    {name}
	  </ExpansionPanelSummary>
	  <ExpansionPanelDetails>
	    <Grid container direction="column">
	      {options.map((opt, i) => opt)}
	    </Grid>
	  </ExpansionPanelDetails>
	</ExpansionPanel>
    )
};

SubMenu.propTypes = {
    name: PropTypes.string.isRequired,
    expanded: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
};


class MainMenu extends Component {

    state = {
	anchorEl: null,
	expanded: null,
    };

    handleOpen = (event) => {
	this.setState({ anchorEl: event.currentTarget });
    };

    handleClick = (page, switchVal) => {
	let { handlePage } = this.props

	this.setState({ 
	    anchorEl: null,
	    expanded: false 
	});

	handlePage(page, switchVal);
    };

    handleExpand = (panel) => (event, expanded) => {
	this.setState({
	    expanded: expanded ? panel : false
	});
    };

    render() {
	let { classes } = this.props;
	let { anchorEl, expanded } = this.state;

	return (
	    <div>
	      <IconButton 
		  color="inherit" 
		  aria-owns={anchorEl ? 'main-menu' : undefined}
		  aria-haspopup="true" 
		  onClick={this.handleOpen}>
		<MenuIcon /> 
	      </IconButton>
              <Menu
		  id="main-menu"
		  anchorEl={anchorEl}
		  open={Boolean(anchorEl)}
		  onClose={(e) => this.handleClick(null, BlankVal)}
              >
		<MenuItem className={classes.avatarItem}>
		<Avatar onClick={(e) => this.handleClick(<Account />, BlankVal)}
			alt="Ibis"
			src={require('../../Static/Images/avatar.jpg')}
			className={classes.avatar}
		/>
		</MenuItem>
		<SubMenu 
		    name="Give"
		    expanded={expanded === 1}
		    onChange={this.handleExpand(1)}
		    options={[
			<MenuItem
			    key={1.1}
		            onClick={(e) => this.handleClick(<Give value={NonprofitVal} />, GiveVal)}
			>
			  Nonprofits
			</MenuItem>,
			<MenuItem
			    key={1.2}
		            onClick={(e) => this.handleClick(<Give value={DonationVal} />, GiveVal)}
			>
			  Donations
			</MenuItem>
		    ]}
		/>
		<SubMenu 
		    name="Send"
		    expanded={expanded === 2}
		    onChange={this.handleExpand(2)}
		    options={[
			<MenuItem
			    key={2.1}
		            onClick={(e) => this.handleClick(<Send value={PersonVal} />, SendVal)}
			>
			  People
			</MenuItem>,
			<MenuItem
			    key={2.2}
		            onClick={(e) => this.handleClick(<Send value={TransactionVal} />, SendVal)}
			>
			  Transactions
			</MenuItem>
		    ]}
		/>
		<SubMenu 
		    name="Connect"
		    expanded={expanded === 3}
		    onChange={this.handleExpand(3)}
		    options={[
			<MenuItem
			    key={3.1}
		            onClick={(e) => this.handleClick(<Connect value={NewsVal} />, ConnectVal)}
			>
			  News
			</MenuItem>,
			<MenuItem
			    key={3.2}
		            onClick={(e) => this.handleClick(<Connect value={EventVal} />, ConnectVal)}
			>
			  Events
			</MenuItem>
		    ]}
		/>
		<MenuItem
		    key={4}
		    onClick={(e) => this.handleClick(<Account />, BlankVal)}
		>
		  Account
		</MenuItem>
		<MenuItem
		    key={5}
		    onClick={(e) => this.handleClick(<Settings />, BlankVal)}
		>
		  Settings
		</MenuItem>
		<MenuItem
		    key={6}
		    onClick={(e) => this.handleClick(<Help />, BlankVal)}
		>
		  Help
		</MenuItem>
		<MenuItem
		    key={6}
		    onClick={(e) => this.handleClick(<QRScan />, BlankVal)}
		>
		  QR Code Scanner
		</MenuItem>
              </Menu>
	    </div>
	);
    }
};

MainMenu.propTypes = {
    handlePage: PropTypes.func.isRequired,
};

export default withStyles(styles)(MainMenu);
