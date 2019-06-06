import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import UnfoldLess from '@material-ui/icons/UnfoldLess';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import Divider from '@material-ui/core/Divider';
import ScrollToTop from "react-scroll-up";
import Fab from '@material-ui/core/Fab';
import UpIcon from '@material-ui/icons/ArrowUpward';

const styles = theme => ({
    root: {
	width: '100%',
    },
    media: {
	paddingBottom: theme.spacing.unit,
    },
    body: {
	textAlign: 'left',
	paddingLeft: theme.spacing.unit * 3,
	paddingRight: theme.spacing.unit * 2,
	color: theme.palette.tertiary.main,
    },
    expandAll: {
	position: 'fixed',
	bottom: '50px',
	right: '30px',
    },
})

class ListView extends Component {

    constructor({ expanded, expandedAll }) {
	super();
	this.state = {
	    expanded: expanded ? expanded : -1,
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
	      <div>
		{
		    data.edges.map((item, i) => ( 
			(filter === undefined || filter(item.node) === true) &&
			<div key={i}>
			  <Divider />
			  <ListItem button onClick={(e) => {this.handleExpand(i)}}>
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
				    <div className={classes.media}>
				      {makeMedia(item.node)}
				    </div>
				)
			    }
			    <div className={classes.body}>
			      {makeBody(item.node)}
			    </div>
			    {makeActions(item.node)}
			  </Collapse>
			</div>
		    ))
		}
	      </div>
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
