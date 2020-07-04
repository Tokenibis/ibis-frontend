import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withApollo } from 'react-apollo';
import { loader } from 'graphql.macro';
import IconButton from '@material-ui/core/IconButton';
import NotificationIconYes from '@material-ui/icons/NotificationsActive';
import NotificationIconNo from '@material-ui/icons/Notifications';

import Link from '../../__Common__/CustomLink';

const styles = theme => ({
    unseenWrapper: {
	display: 'flex',
    },
    hasUnseen: {
	color: "#ffcfcf",
    },
    stat: {
	fontSize: 12,
	fontWeight: 'bold',
	marginTop: theme.spacing(-2),
    },
})

const query = loader('../../Static/graphql/app/Notifier.gql')

class NotificationButton extends Component {

    state = {
	unseenCount: false,
    }

    componentDidMount() {
	let { context, client } = this.props;

	client.query({
	    query: query,
	    variables: { id: context.userID },
	    fetchPolicy:"no-cache",
	}).then(results => {
	    this.setState({
		unseenCount: results.data.ibisUser.notifier.unseenCount,
	    })
	}).catch(error => {
	    console.log(error);
	});
    };

    render() {
	let { unseenCount } = this.state;
	let { classes } = this.props;

	return (
	    <Link to="/_/NotificationList">
		{
		    unseenCount > 0 ? (
			<div className={classes.unseenWrapper}>
			  <IconButton className={classes.hasUnseen}>
			    <NotificationIconYes/>
			    <div className={classes.stat}>
			      {unseenCount}
			    </div>
			  </IconButton>
			</div>
		    ):(
			<IconButton color="inherit">
			  <NotificationIconNo />
			</IconButton>
		    )
		}
	    </Link>
	);
    };
    
};

export default withApollo(withStyles(styles)(NotificationButton));
