import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Query } from "react-apollo";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import ScrollToTop from "react-scroll-up";
import Fab from '@material-ui/core/Fab';
import UpIcon from '@material-ui/icons/ArrowUpward';

const styles = theme => ({
    root: {
	width: '100%',
    },
    toIcon: {
	marginBottom: -8,
	marginLeft: 4,
	marginRight: 4,
    },
    progress: {
	position: 'absolute',
	top: '50%',
	left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    body: {
	textAlign: 'left',
	paddingLeft: theme.spacing.unit * 3,
	paddingRight: theme.spacing.unit * 2,
	color: theme.palette.tertiary.main,
    },
})

class ListView extends Component {

    state = {
	expanded: -1,
    };

    handleExpand(expanded) {
	this.state.expanded === expanded ?
	this.setState({ expanded: -1 }) :
	this.setState({ expanded });
    };

    createItem(data) {
	let { classes, makeImage, makeLabel, makeBody, makeActions, filter } = this.props;
	let { expanded } = this.state;

	return (data.edges.map((item, i) => ( 
	    (filter === undefined || filter(item.node) === true) &&
	    <div key={i}>
	      <ListItem button onClick={(e) => {this.handleExpand(i)}}>
		<ListItemIcon>
		  {makeImage(item.node)}
		</ListItemIcon>
		<ListItemText primary={makeLabel(item.node)} />
		{expanded === i ?
		 <ExpandLess color="secondary"/> :
		 <ExpandMore color="secondary"/>}
	      </ListItem>
	      <Collapse in={expanded === i} timeout="auto" unmountOnExit>
		<div className={classes.body}>
		  {makeBody(item.node)}
		</div>
		{makeActions(item.node)}
	      </Collapse>
	      <Divider />
	    </div>
	)));
    };

    render() {
	let { classes, query } = this.props;

	return (
	    <div className={classes.root}>
	      <Query query={query}>
		{({ loading, error, data }) => {
		    if (loading) return <CircularProgress className={classes.progress} />;
		    if (error) return `Error! ${error.message}`;
		    return this.createItem(data[Object.keys(data)[0]]);
		}}
	      </Query>
	      <ScrollToTop showUnder={160}>
		<Fab color="primary">
		  <UpIcon />
		</Fab>
	      </ScrollToTop>
	    </div>
	);
    };
}

ListView.propTypes = {
    classes: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    makeImage: PropTypes.func.isRequired,
    makeLabel: PropTypes.func.isRequired,
    makeBody: PropTypes.func.isRequired,
    makeActions: PropTypes.func.isRequired,
};


export default withStyles(styles)(ListView);
