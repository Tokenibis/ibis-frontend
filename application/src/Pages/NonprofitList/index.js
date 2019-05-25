import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import ScrollToTop from "react-scroll-up";
import UpIcon from '@material-ui/icons/ArrowUpward';
import Fab from '@material-ui/core/Fab';

import Nonprofit from '../Nonprofit';
import CustomItem from '../__Common__/CustomItem';

const styles = theme => ({
    root: {
	width: '100%',
    },
    description: {
	textAlign: 'left',
	paddingLeft: theme.spacing.unit * 2,
	paddingRight: theme.spacing.unit * 2,
	color: theme.palette.tertiary.main,
	paddingBottom: theme.spacing.unit,
    },
    avatar: {
	borderStyle: 'solid',
	borderWidth: '2px',
	borderColor: theme.palette.secondary.main,
    },
    progress: {
	position: 'absolute',
	top: '50%',
	left: '50%',
        transform: 'translate(-50%, -50%)'
    }
})

const QUERY = gql`
    query {
	allNonprofits {
	    edges {
		node {
		    title
		    description
		}
	    }
	}
    }
`;

class NonprofitList extends Component {

    state = {
	expanded: -1,
    };

    handleExpand(expanded) {
	this.state.expanded === expanded ?
	this.setState({ expanded: -1 }) :
	this.setState({ expanded });
    };

    createItem(allTransactions) {
	let { classes, handleWindow } = this.props;
	let { expanded } = this.state;

	return (
	    allTransactions.edges.map((item, i) => ( 
		<CustomItem
		    key={i}
		    label={
			<Typography variant="body2" className={classes.notifications}>
			  {item.node.title}
			</Typography>
		    }
		    value={expanded === i}
		    icon={
  			<Avatar
		      onClick={(e) => handleWindow(<Nonprofit />)}
			      alt="Ibis"
  			      src={require('../../Static/Images/nonprofit.jpg')}
  			      className={classes.avatar} />
		  }
		  onClick={(e) => {this.handleExpand(i)}}>
		  <Typography variant="body2" className={classes.description}>
		    {`${item.node.description.substring(0, 300)} ...`}
		  </Typography>
		</CustomItem>
	    ))
	);
    };

    render() {
	let { classes } = this.props;

	return (
	    <div className={classes.root}>
	      <Query query={QUERY}>
		{({ loading, error, data }) => {
		    if (loading) return <CircularProgress className={classes.progress} />;
		    if (error) return `Error! ${error.message}`;
		    return this.createItem(data.allNonprofits);
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
};

NonprofitList.propTypes = {
    handleWindow: PropTypes.func.isRequired,
};

export default withStyles(styles)(NonprofitList);
