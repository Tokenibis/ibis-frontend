/*

   The ListView provides support and formatting for any Ibis entities
   that need to be displayed as a list. Namely, it fits them into a
   slightly configurable expandable list. It takes the following
   inputs:

   - data: This should be the output of a graphql query. ListView
     expects the followin data structure:

	<some graphql list> { edges { <list of nodes> } }

   - make*: These are all simple Render Props functions that ListView
     calls at various places in the strucutre render the specific type
     of list. These are passed a single node in the graph.

*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import UnfoldLess from '@material-ui/icons/UnfoldLess';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import ScrollToTop from "react-scroll-up";
import Fab from '@material-ui/core/Fab';
import UpIcon from '@material-ui/icons/ArrowUpward';

import CustomDivider from '../../../__Common__/CustomDivider';

const styles = theme => ({
    root: {
	width: '100%',
    },
    mediaWrapper: {
	paddingBottom: theme.spacing(1),
    },
    item: {
	width: '90%',
    },
    image: {
	marginLeft: '0px',
	paddingLeft: '0px',
    },
    body: {
	textAlign: 'left',
	color: theme.palette.tertiary.main,
    },
    expandAll: {
	position: 'fixed',
	bottom: '50px',
	right: '30px',
    },
})

class ListView extends Component {

    constructor(props) {
	super(props);

	let { expanded, expandedAll } = this.props;
	this.state = {
	    expanded: expanded !== undefined ? expanded : -1,
	    expandedAll: expandedAll ? expandedAll : false,
	}
    }

    handleExpand(expanded) {
	this.state.expanded === expanded ?
	this.setState({ expanded: -1 }) :
	this.setState({ expanded });
    };

    render() {
	let {
	    classes,
	    scrollButton,
	    data,
	    makeImage,
	    makeLabel,
	    makeMedia,
	    makeBody,
	    makeActions,
	    filter
	} = this.props;
	let { expandedAll, expanded } = this.state;

	return (
	    <div className={classes.root}>
  	      <Grid container direction="column" justify="center" alignItems="center" >
		{
		    data.map((item, i) => ( 
			(filter === undefined || filter(item.node) === true) &&
			<div className={classes.item} key={i}>
			  <ListItem
			      button
			      className={classes.image}
			      onClick={(e) => {this.handleExpand(i)}}
			    >
			    {
				makeImage && 
				<ListItemIcon>
				  {makeImage(item.node)}
				</ListItemIcon>
			    }
			    <ListItemText primary={makeLabel(item.node)} />
			    {!expandedAll && (
				expanded === i ?
				<ExpandLess color="secondary"/> :
				<ExpandMore color="secondary"/>)}
			  </ListItem>
			  <Collapse in={expandedAll || expanded === i} timeout="auto" unmountOnExit>
			    {
				makeMedia && (
				    <div className={classes.mediaWrapper}>
				      {makeMedia(item.node)}
				    </div>
				)
			    }
			    <div className={classes.body}>
			      {makeBody(item.node)}
			    </div>
			    {makeActions && makeActions(item.node)}
			  </Collapse>
			  <CustomDivider />
			</div>
		    ))
		}
	      </Grid>
	      {
		  scrollButton && 
		  <div>
		    <Fab color="primary" className={classes.expandAll}>
		      {expandedAll ?
		       <UnfoldLess onClick={(e) => this.setState({ expandedAll: false})}/> :
		       <UnfoldMore onClick={(e) => this.setState({ expandedAll: true})}/>
		      }
		    </Fab>
		    <ScrollToTop showUnder={200}>
		      <Fab color="primary">
			<UpIcon />
		      </Fab>
		    </ScrollToTop>
		  </div>
	      }
	    </div>
	);
    };
}

ListView.propTypes = {
    classes: PropTypes.object.isRequired,
    makeImage: PropTypes.func.isRequired,
    makeLabel: PropTypes.func.isRequired,
    makeBody: PropTypes.func.isRequired,
    makeActions: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
};


export default withStyles(styles)(ListView);
