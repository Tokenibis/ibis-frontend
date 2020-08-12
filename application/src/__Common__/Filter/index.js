/*

   Filter is the standard type of component that gets displayed by the
   filter buttons in Navigation/TabBar; it lives here in the Pages
   directory to ensure there are no backwards dependencies between
   Pages -> Navigation. It accepts the following inputs:

   - options: a list of strings that simultaneously serves as the
     displayed options for the filter but ALSO as outputs that the
     filter returns upon close

   - onClose: a function that gets called when the filter exits

   - custom: The standard filter renders all of the given options as
     well as a search bar. For anything else that should appear, the
     custom option (basically) serves as a slot for "children" props
     to get passed in

   The filter shoes up as a dialog box with some options. When the
   user makes a selection, it is passed into the onClose function as a
   string in the following format:

   <selection>:<comma-separated args>

*/

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { fade } from '@material-ui/core/styles/colorManipulator';

const styles = theme => ({
    item: {
	color: theme.palette.secondary.main,
    },
    list: {
	paddingLeft: theme.spacing(2),
	paddingRight: theme.spacing(2),
    },
    dialogPaper: {
	margin: theme.spacing(2),
    },
    searchItem: {
	maxWidth: theme.spacing(20),
	marginLeft: 0,
	paddingLeft: 0,
    },
    search: {
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: fade(theme.palette.common.white, 0.15),
	'&:hover': {
	    backgroundColor: fade(theme.palette.common.white, 0.25),
	},
	marginLeft: 0,
    },
    searchIcon: {
	width: theme.spacing(7),
	color: theme.palette.secondary.main,
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
    },
    inputRoot: {
	color: theme.palette.secondary.main,
    },
    inputInput: {
	padding: theme.spacing(1, 1, 1, 7),
    },
});

function Filter({ classes, options, custom, value, onClose, defaultVal, ...other}) {

    let onSearch = (event) => {
	event.stopPropagation();
	event.preventDefault();
	onClose(event, `_Search:${document.getElementById("search_input").value}`)
    }

    return (
	<Dialog
	    PaperProps={{className: classes.dialogPaper}}
	    onClose={(e) => onClose(e, null)}
	    aria-labelledby="simple-dialog-title"
	  {...other}
	>
	  <List className={classes.list}>
            {options.map((opt, i) => (
		<div key={i}>
		  <ListItem button onClick={(e) => onClose(e, opt)} key={opt}>
		    <ListItemText primary={
			<Typography variant="button" className={classes.item}>
			  {opt === value || (!value && opt === defaultVal) ?
			   `> ${opt} <` :
			   opt
			  }
			</Typography>
		    } />
		  </ListItem>
		</div>
            ))}
	    {
		custom && (
		    <div className={classes.item}>
		      <Divider />
		      {custom}
		    </div>
		)
	    }
	    <Divider />
	    <ListItem button className={classes.searchItem}>
	      <div className={classes.search}>
		<div className={classes.searchIcon}>
		  <SearchIcon />
		</div>
		<form onSubmit={onSearch}>
		  <InputBase
		      id="search_input"
		      name="search"
		      type="text"
		      placeholder="Search…"
		      classes={{
			  root: classes.inputRoot,
			  input: classes.inputInput,
		      }}
		      inputProps={{ 'aria-label': 'Search' }}
		  />
		</form>
              </div>
	    </ListItem>
	  </List>
	</Dialog>
    );
}

Filter.propTypes = {
    classes: PropTypes.object.isRequired,
    options: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(Filter);
