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
import HomeIcon from '@material-ui/icons/Home';

import { IbisConsumer } from '../../Context';
import Link from '../../__Common__/CustomLink';
import Cycler from '../Cycler'
import SideMenu from '../SideMenu';
import NotificationMenu from '../NotificationMenu';

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

function MainBar({ classes, context, cycle, showHome }) {

    return (
	<AppBar color="primary" position="static">
	  <Toolbar>
	    <IbisConsumer>
	      {context => (
		  <SideMenu context={context}/>
	      )}
	    </IbisConsumer> 
	    <Typography variant="h6" color="inherit" className={classes.grow}>
	      <Cycler value={cycle} />
	    </Typography>
	    <IbisConsumer>
	      {context => (
		  showHome ? (
		      <Link to="/">
			<IconButton color="inherit">
			  <HomeIcon />
			</IconButton>
		      </Link>
		  ):(
		      <NotificationMenu context={context}/>
		  )
	      )}
	    </IbisConsumer> 
          </Toolbar>
	</AppBar>
    );
};


MainBar.propTypes = {
    classes: PropTypes.object.isRequired,
    cycle: PropTypes.number.isRequired,
};

export default withStyles(styles)(MainBar);
