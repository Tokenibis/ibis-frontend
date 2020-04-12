import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import Link from '../CustomLink';
import { IbisConsumer } from '../../Context';
import PersonList from '../../Pages/PersonList';
import NonprofitList from '../../Pages/NonprofitList';

const styles = theme => ({
    button: {
	textTransform: 'none',
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
    },
    buttonDisabled: {
	opacity: '50%',
	textTransform: 'none',
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
    },
    dialogPaper: {
	width: '70%',
    },
    dialogInner: {
	textAlign: 'center',
	padding: theme.spacing(1),
    },
    viewAllWrapper: {
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),
    },
    viewAll: {
	color: theme.palette.secondary.main,
	textAlign: 'right',
	textDecoration: 'none',
    },
});

const VARIANTS = {
    following: {
	display: 'Following',
	filter: '_Following',
    },
    follower: {
	display: 'Followers',
	filter: '_Followers',
    },
    like: {
	display: 'Likes',
	filter: '_LikeFor',
    },
    rsvp: {
	display: 'Going',
	filter: '_RsvpFor',
    },
    nonprofitFollow: {
	display: 'Nonprofits',
	filter: '_Following',
    },
}

const NUM = 25;

class UserDialogList extends Component {

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
	let { classes, variant, count, node, hideZero } = this.props;
	let { opened } = this.state;

	return (
	    <div>
	      <Dialog
		  PaperProps={{className: classes.dialogPaper}}
		  open={opened && count > 0}
		  onClose={() => this.handleClose()}
	      >
		<div className={classes.dialogInner}>
		  <IbisConsumer>
		    {context => (
			variant === 'nonprofitFollow' ?
			(
			    <NonprofitList
				minimal
				context={context}
				filterValue={`${VARIANTS[variant].filter}:${node}`}
				count={NUM}
			    />
			):(
			    <PersonList
				minimal
				context={context}
				filterValue={`${VARIANTS[variant].filter}:${node}`}
				count={NUM}
			    />
			)
		    )}
		  </IbisConsumer>
		  {count > NUM &&
		   <div className={classes.viewAllWrapper}>
		     <Typography
		       component={Link}
		       prefix={1}
		       to={`PersonList?filterValue=${VARIANTS[variant].filter}:${node}`}
		       variant="body2"
		       className={classes.viewAll}
		       >
		       View all {VARIANTS[variant].display}
		     </Typography>
		   </div>
		  }
		</div>
	      </Dialog>
	      {(hideZero && count === 0) ? (
		  <div style={{ height: 50 }}></div>
	      ):(
	       <Button onClick={() => this.handleOpen()}>
		 <Typography
		     variant="body2"
		     className={count === 0 ? classes.buttonDisabled : classes.button}
		   >
		   {`${VARIANTS[variant].display}: ${count}`}
		 </Typography>
	       </Button>
	      )}
	    </div>
	);
    };
};

export const FollowingVal = 'following';
export const FollowerVal = 'follower';
export const LikeVal = 'like';
export const RsvpVal = 'rsvp';
export const NonprofitFollowVal = 'nonprofitFollow';
export default withStyles(styles)(UserDialogList);
