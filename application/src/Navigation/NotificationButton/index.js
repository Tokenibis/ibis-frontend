import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withApollo } from 'react-apollo';
import { loader } from 'graphql.macro';
import IconButton from '@material-ui/core/IconButton';
import NotificationIconYes from '@material-ui/icons/NotificationsActive';
import NotificationIconNo from '@material-ui/icons/Notifications';

import Link from '../../__Common__/CustomLink';

const styles = theme => ({
    hasUnseen: {
	color: "#ffcfcf",
    }
})

const query = loader('../../Static/graphql/operations/Notifier.gql')

class NotificationButton extends Component {

    state = {
	hasUnseen: false,
    }

    componentDidMount() {
	let { context, client } = this.props;

	client.query({
	    query: query,
	    variables: { id: context.userID },
	    fetchPolicy:"no-cache",
	}).then(results => {
	    this.setState({
		hasUnseen: results.data.person.notifier.hasUnseen,
	    })
	}).catch(error => {
	    console.log(error);
	});
    };

    render() {
	let { hasUnseen } = this.state;
	let { classes } = this.props;

	return (
	    <Link to="/_/NotificationList">
		{
		    hasUnseen ? (
			<IconButton className={classes.hasUnseen}>
			  <NotificationIconYes className={classes.hasUnseen}/>
			</IconButton>
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
