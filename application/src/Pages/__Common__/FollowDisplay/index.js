import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { loader } from 'graphql.macro';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import Link from '../../../__Common__/CustomLink';
import { IbisConsumer } from '../../../Context';
import PersonList from '../../PersonList';

const query = loader('../../../Static/graphql/operations/PersonList.gql')

const styles = theme => ({
    button: {
	textTransform: 'none',
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
    },
    dialogPaper: {
	width: '70%',
    },
    dialogInner: {
	textAlign: 'center',
    },
    viewAllWrapper: {
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(3),
    },
    viewAll: {
	color: theme.palette.secondary.main,
	textAlign: 'right',
	textDecoration: 'none',
    },
});

class FollowDisplay extends Component {

    state = {
	opened: false,
    };

    handleOpen() {
	this.setState({ opened: true })
    };

    handleClose() {
	this.setState({ opened: false })
    };

    render() {
	let { classes, context, variant, count, user } = this.props;
	let { opened } = this.state;

	return (
	    <div>
	      <Dialog
		  PaperProps={{className: classes.dialogPaper}}
		  open={opened}
		  onClose={() => this.handleClose()}
	      >
		<div className={classes.dialogInner}>
		  <IbisConsumer>
		    {context => (
			<PersonList
			    minimal
			    context={context}
			    filterValue={`_${variant === 'following' ? 'Following' : 'Followers'}:${user}`}
			    count={10}
			/>
		    )}
		  </IbisConsumer>
		  <div className={classes.viewAllWrapper}>
		    <Typography
			component={Link}
			prefix={1}
			to={`PersonList?filterValue=_${variant === 'following' ? 'Following' : 'Followers'}:${user}`}
			variant="body2"
			className={classes.viewAll}
		    >
		      View all {variant === 'following' ? 'Following' : 'Followers'}
		    </Typography>
		  </div>
		</div>
	      </Dialog>
	      <Button onClick={() => this.handleOpen()}>
		<Typography variant="body2" className={classes.button}>
		  {`${variant === 'following' ? 'Following' : 'Followers'}: ${count}`}
		</Typography>
	      </Button>
	    </div>
	);
    };
};

export const FollowingVal = 'following';
export const FollowerVal = 'follower';
export default withStyles(styles)(FollowDisplay);
