import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import Typography from '@material-ui/core/Typography';
import ToIcon from '@material-ui/icons/ArrowRightAlt';
import Avatar from '@material-ui/core/Avatar';

import Link from '../../__Common__/CustomLink';
import QueryHelper from "../__Common__/QueryHelper";
import ListView from '../__Common__/ListView';
import Filter from '../__Common__/Filter';
import SimpleEdgeMutation, { LikeVal } from '../__Common__/SimpleEdgeMutation';
import Truncated from '../__Common__/Truncated';

const styles = theme => ({
    title: {
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    subtitle: {
	color: theme.palette.tertiary.main,
    },
});

const DEFAULT_COUNT = 25;

const QUERY = gql`
    query DepositList($byUser: String $orderBy: String $first: Int $after: String) {
	allDeposits(byUser: $byUser orderBy: $orderBy first: $first after: $after) {
	    edges {
  		node {
		    id
		    amount
		    created
		    paymentId
		}
		cursor
	    }
	    pageInfo {
		hasNextPage
	    }
	}
    }
`;

class DepositList extends Component {

    makeLabel = (node) => {
	let { classes } = this.props;
	return (
	    <div>
	      <Typography variant="body2" className={classes.title}>
		{`$${(node.amount/100).toFixed(2)}`} - {new Date(node.created).toDateString()}
	      </Typography>
	    </div>
	);
    }

    render() {
	let { context, variant, filterValue, count } = this.props;

	let make = (data) => (
	    <ListView
		scrollButton
		makeLabel={this.makeLabel}
		data={data}
	    {...this.props}
	    />
	);

	let variables = {
	    byUser: context.userID,
	    orderBy: "-created",
	    first: DEFAULT_COUNT,
	}

	return (
	    <QueryHelper
		query={QUERY}
		variables={variables}
		make={make}
		infiniteScroll={true}
	    {...this.props}
	    />
	);
    };
};

DepositList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DepositList);
