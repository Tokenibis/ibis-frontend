import React from 'react';
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

function Filter({ classes, title, icon, options, custom, onClose, ...other}) {
    return (
	<Dialog
	    PaperProps={{className: classes.dialogPaper}}
	    onClose={() => onClose(null)}
	    aria-labelledby="simple-dialog-title"
	  {...other}
	>
	  <List className={classes.list}>
            {options.map((opt, i) => (
		<div key={i}>
		  <ListItem button onClick={() => onClose(opt)} key={opt}>
		    <ListItemText primary={
			<Typography variant="button" className={classes.item}>
			  {opt}
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
		<InputBase
		    placeholder="Search…"
		    classes={{
			root: classes.inputRoot,
			input: classes.inputInput,
		    }}
		    inputProps={{ 'aria-label': 'Search' }}
		/>
              </div>
	    </ListItem>
	  </List>
	</Dialog>
    );
}

export default withStyles(styles)(Filter);
