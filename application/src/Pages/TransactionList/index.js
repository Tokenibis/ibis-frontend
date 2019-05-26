import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ToIcon from '@material-ui/icons/ArrowRightAlt';
import LikeIcon from '@material-ui/icons/FavoriteBorder';

import ListView from '../__Common__/ListView';
import Transaction from '../Transaction';

import GiftIcon from '@material-ui/icons/CakeOutlined';
import MoodIcon from '@material-ui/icons/MoodOutlined';
import TradeIcon from '@material-ui/icons/TransferWithinAStationOutlined';
import KudosIcon from '@material-ui/icons/StarsOutlined';
import GameIcon from '@material-ui/icons/VideogameAssetOutlined';
import SchoolIcon from '@material-ui/icons/SchoolOutlined';
import Commercial from '@material-ui/icons/ShoppingCartOutlined';

const styles = theme => ({
    categoryIcon: {
	color: theme.palette.secondary.main,
	padding: 0,
    },
    toIcon: {
	marginBottom: -8,
	marginLeft: 4,
	marginRight: 4,
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	paddingRight: theme.spacing.unit * 2,
    },
    amount: {
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
    },
    details: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
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
		    created
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

    constructor({ handleWindow }) {
	super();
	this.icons = [
	    <GiftIcon />,
	    <MoodIcon />,
	    <TradeIcon />,
	    <KudosIcon />,
	    <GameIcon />,
	    <SchoolIcon />,
	    <Commercial />,
	]
    };

    filter = (node) => {
	return node.target.nonprofit === null;
    }
    
    makeImage = (node) => {
	let { classes, handleWindow } = this.props;
	return (
	    <IconButton
	      className={classes.categoryIcon}
	      onClick={(e) => handleWindow(<Transaction handleWindow={handleWindow}/>)}
	    >
	      {this.icons[(node.description.length) % this.icons.length]}
	    </IconButton>
	);
    };

    makeLabel = (node) => {
	let { classes } = this.props;
	return (
	    <Typography variant="body2">
	      {`${node.user.firstName} ${node.user.lastName}`}
	      {<ToIcon className={classes.toIcon} />}
	      {`${node.target.firstName} ${node.target.lastName}`}
	    </Typography>
	);
    }

    makeBody = (node) => {
	return (
	    <Typography variant="body2">
	      {node.description}
	    </Typography>
	);
    }

    makeActions = (node) => {
	let { classes } = this.props;
	return (
	    <div className={classes.action}>
	      <IconButton color="secondary" aria-label="Like">
		<LikeIcon />
	      </IconButton>
	      <Typography variant="body2" className={classes.amount}>
		{`$${node.amount}`}
	      </Typography>
	      <Typography variant="body2" className={classes.details}>
		Details
	      </Typography>
	    </div>
	);
    };

    render() {
	return (
	    <ListView
	      query={QUERY}
	      filter={this.filter}
	      makeImage={this.makeImage}
	      makeLabel={this.makeLabel}
	      makeBody={this.makeBody}
	      makeActions={this.makeActions}
	    />
	)
    };
};

TransactionList.propTypes = {
    handleWindow: PropTypes.func.isRequired,
};

export default withStyles(styles)(TransactionList);
