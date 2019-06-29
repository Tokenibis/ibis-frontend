import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ToIcon from '@material-ui/icons/ArrowRightAlt';
import LikeIcon from '@material-ui/icons/FavoriteBorder';

import QueryHelper from "../__Common__/QueryHelper";
import ListView from '../__Common__/ListView';
import Transaction from '../Transaction';
import Filter from '../__Common__/Filter';

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
    label: {
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	paddingRight: theme.spacing(2),
    },
    amount: {
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
    },
    details: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
    }
});

const DEFAULT_COUNT = 25;

class TransactionList extends Component {

    constructor({ handlePage, count }) {
	super();

	this.dummyCount = 0;
	this.dummySeen = [];
	this.query = gql`
	    query {
		allTransfers(isDonation: false, first: ${count ? count : DEFAULT_COUNT}) {
		    edges {
			node {
			    id
			    amount
			    description
			    created
			    target {
				firstName
				lastName
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

    makeImage = (node) => {
	let { classes, handlePage } = this.props;
	return (
	    <IconButton
	      className={classes.categoryIcon}
	      onClick={(e) => handlePage(<Transaction />)}
	    >
	      {this.icons[(node.description.length) % this.icons.length]}
	    </IconButton>
	);
    };

    makeLabel = (node) => {
	let { classes } = this.props;
	return (
	    <Typography variant="body2" className={classes.label}>
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
	let { classes, handlePage } = this.props;
	return (
	    <div className={classes.action}>
	      <IconButton color="secondary" aria-label="Like">
		<LikeIcon />
	      </IconButton>
	      <Typography variant="body2" className={classes.amount}>
		{`$${node.amount}`}
	      </Typography>
	      <Button onClick={(e) => handlePage(<Transaction />)}>
		<Typography variant="body2" className={classes.details}>
		  Details
		</Typography>
	      </Button>
	    </div>
	);
    };

    makeListDefault = (data) => {
	return (
	    <ListView
		scrollButton
		makeImage={this.makeImage}
		makeLabel={this.makeLabel}
		makeBody={this.makeBody}
		makeActions={this.makeActions}
		data={data[Object.keys(data)[0]]}
	    {...this.props}
	    />
	);
    };

    makeListMinimal = (data) => {
	return (
	    <ListView
		filter={this.filter}
		makeLabel={this.makeLabel}
		makeBody={this.makeBody}
		makeActions={this.makeActions}
		data={data[Object.keys(data)[0]]}
	    {...this.props}
	    />
	);
    };

    render() {
	let { variant } = this.props;
	let makeList;

	switch (variant) {
	    case 'minimal':
		makeList = this.makeListMinimal;
		break;
	    default:
		makeList = this.makeListDefault;
	};

	return <QueryHelper query={this.query} makeList={makeList} {...this.props} />;
    };
};

TransactionList.propTypes = {
    classes: PropTypes.object.isRequired,
};

function TransactionFilter(props) {
    return <Filter options={['Me', 'Following', 'Public']} {...props} />;
}

export { TransactionFilter };
export default withStyles(styles)(TransactionList);
