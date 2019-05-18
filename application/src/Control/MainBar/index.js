import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';

import Cycler from '../Cycler';
import Home from '../Home';
import MainMenu from '../MainMenu';

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

function MainBar({ classes, handlePage, cycle }) {

    return (
	<AppBar color="primary" position="static">
	  <Toolbar>
	    <MainMenu handlePage={handlePage}/>
	    <Typography variant="h6" color="inherit" className={classes.grow}>
	      <Cycler value={cycle} handlePage={handlePage} />
	    </Typography>
	    <IconButton 
	      color="inherit" 
	      onClick={(e) => handlePage(<Home handlePage={handlePage} />, '')}
	    >
	      <HomeIcon /> 
	    </IconButton>
          </Toolbar>

	</AppBar>
    );
};


MainBar.propTypes = {
    classes: PropTypes.object.isRequired,
    handlePage: PropTypes.func.isRequired,
    cycle: PropTypes.number.isRequired,
};

export default withStyles(styles)(MainBar);
