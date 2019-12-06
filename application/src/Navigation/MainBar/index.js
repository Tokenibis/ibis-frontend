/*

   Topmost bar of the application which contains the hamburger menu,
   the home button, and the cyler. Invoked by the Content component,
   which stores the state necessary to customize the bar.

*/

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import NotificationIcon from '@material-ui/icons/Notifications';

import { IbisConsumer } from '../../Context';
import Link from '../../__Common__/CustomLink';
import IbisIcon from '../../__Common__/IbisIcon';
import Cycler from '../Cycler'
import SideMenu from '../SideMenu';

const styles = {
    root: {
	flexGrow: 1,
    },
    grow: {
	flexGrow: 1,
	textAlign: 'center'
    },
    menuButton: {
	marginLeft: -12,
	marginRight: 20,
    },
};

function MainBar({ classes, context, handleFrame, cycle, hideHome }) {

    return (
	<AppBar color="primary" position="static">
	  <Toolbar>
	    <IbisConsumer>
	      {context => (
		  <SideMenu context={context}/>
	      )}
	    </IbisConsumer> 
	    <Typography variant="h6" color="inherit" className={classes.grow}>
	      <Cycler value={cycle} handleFrame={handleFrame} />
	    </Typography>
	    {
		hideHome ? (
		    <Link to="/_/NotificationList">
		      <IconButton color="inherit">
			<NotificationIcon />
		      </IconButton>
		    </Link>
		):(
		    <Link to="/">
		      <IconButton color="inherit">
			<IbisIcon />
		      </IconButton>
		    </Link>
		)
	    }
          </Toolbar>
	</AppBar>
    );
};


MainBar.propTypes = {
    classes: PropTypes.object.isRequired,
    handleFrame: PropTypes.func.isRequired,
    cycle: PropTypes.number.isRequired,
};

export default withStyles(styles)(MainBar);
