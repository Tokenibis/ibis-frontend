import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { loader } from 'graphql.macro';
import Typography from '@material-ui/core/Typography';

import QueryHelper from "../__Common__/QueryHelper";
import ListView from '../__Common__/ListView';

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

const query = loader('../../GraphQL/DepositList.gql')

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
		query={query}
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
