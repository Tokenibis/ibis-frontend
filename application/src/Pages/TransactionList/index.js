import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Typography from '@material-ui/core/Typography';
import ToIcon from '@material-ui/icons/ArrowRightAlt';
import CircularProgress from '@material-ui/core/CircularProgress';

import Transaction from '../Transaction';
import CustomItem from '../__Common__/CustomItem';
import TransactionIcon from '@material-ui/icons/SwapHoriz';
import UpIcon from '@material-ui/icons/ArrowUpward';
import Fab from '@material-ui/core/Fab';

const styles = theme => ({
    root: {
	width: '100%',
    },
    fab: {
	position: 'fixed',
	float: 'right',
	bottom: theme.spacing.unit * 3,
	right: theme.spacing.unit * 3,
    },
    toIcon: {
	marginBottom: -8,
	marginLeft: 4,
	marginRight: 4,
    },
    description: {
	textAlign: 'left',
	paddingLeft: theme.spacing.unit * 2,
	paddingRight: theme.spacing.unit * 2,
	color: theme.palette.tertiary.main,
	paddingBottom: theme.spacing.unit,
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
	allTransactions {
	    edges {
		node {
		    id
		    amount
		    description
		    target {
			firstName
			lastName
			nonprofit {
			    id
			}
		    }
		    user {
        		firstName
			lastName
		    }
		}
	    }
	}
    }
`;

class TransactionList extends Component {

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
		!item.node.target.nonprofit &&
		<CustomItem
		    key={i}
		    label={
			<Typography variant="body2" className={classes.notifications}>
			  {`${item.node.user.firstName} ${item.node.user.lastName}`}
			  {<ToIcon className={classes.toIcon} />}
			  {`${item.node.target.firstName} ${item.node.target.lastName}`}
			</Typography>
		    }
		    value={expanded === i}
		    icon={
			<TransactionIcon
			    color="secondary"
			  onClick={(e) => handleWindow(<Transaction handleWindow={handleWindow}/>)}
			/>
		    }
		    onClick={(e) => {this.handleExpand(i)}}>
		  <Typography variant="body2" className={classes.description}>
		    {item.node.description}
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
		    return this.createItem(data.allTransactions);
		}}
	      </Query>
	      <div className={classes.fab} onClick={(e) => {window.scrollTo(0, 0)}}>
		<Fab color="primary">
		<UpIcon />
		</Fab>
	      </div>
	    </div>
	);
    };
};

TransactionList.propTypes = {
    handleWindow: PropTypes.func.isRequired,
};

export default withStyles(styles)(TransactionList);
