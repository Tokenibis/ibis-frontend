import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import IbisIcon from '../../__Common__/IbisIcon';
import Cycler, { BlankVal } from '../Cycler';
import Home from '../Home';
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

function MainBar({ classes, handleFrame, cycle, hideHome }) {

    return (
	<AppBar color="primary" position="static">
	  <Toolbar>
	    <SideMenu handleFrame={handleFrame}/>
	    <Typography variant="h6" color="inherit" className={classes.grow}>
	      <Cycler value={cycle} handleFrame={handleFrame} />
	    </Typography>
	    {
		(hideHome === undefined || hideHome === false) &&
		<IconButton
		    color="inherit"
		    onClick={(e) => handleFrame(<Home handleFrame={handleFrame} />, BlankVal, true)}
		>
		  <IbisIcon />
		</IconButton>
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
