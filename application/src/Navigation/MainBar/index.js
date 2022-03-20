/*

   Topmost bar of the application which contains the hamburger menu,
   the home button, and the cyler. Invoked by the Content component,
   which stores the state necessary to customize the bar.

*/

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

import { IbisConsumer } from '../../Context';
import Cycler from '../Cycler'
import SideMenu from '../SideMenu';
import NotificationMenu from '../NotificationMenu';

const styles = theme => ({
    root: {
	flexGrow: 1,
    },
    flex: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	paddingTop: theme.spacing(0.5),
	paddingBottom: theme.spacing(0.5),
	paddingRight: theme.spacing(2),
	paddingLeft: theme.spacing(2),
    },
    grow: {
	flexGrow: 1,
	textAlign: 'center'
    },
    menuButton: {
	marginLeft: -12,
	marginRight: 20,
    },
    toolbar: {
	visibility: 'hidden',
    },
});

function MainBar({ classes, context, cycle, position = 'static' }) {

    return (
	<div>
	  <AppBar color={context.userType === 'person' ? 'primary' : 'secondary'} position={position}>
	    <div className={classes.flex}>
	      <SideMenu context={context}/>
	      <Typography variant="h6" color="inherit" className={classes.grow}>
		<Cycler value={cycle} />
	      </Typography>
	      <NotificationMenu context={context}/>
	    </div>
	  </AppBar>
	  {position === 'fixed' && <Toolbar className={classes.toolbar}/>}
	</div>
    );
};


MainBar.propTypes = {
    classes: PropTypes.object.isRequired,
    cycle: PropTypes.number.isRequired,
};

export default withStyles(styles)(MainBar);
