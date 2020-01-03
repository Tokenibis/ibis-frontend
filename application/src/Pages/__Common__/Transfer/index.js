import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { loader } from 'graphql.macro';
import { Query } from "react-apollo";
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import ToIcon from '@material-ui/icons/ArrowRightAlt';

import CustomDivider from '../../../__Common__/CustomDivider';
import Link from '../../../__Common__/CustomLink';
import CustomMarkdown from '../CustomMarkdown';
import UserDialogList, { LikeVal as DialogLikeVal} from '../UserDialogList';
import SimpleEdgeMutation, { LikeVal } from '../SimpleEdgeMutation';
import CommentTree from '../CommentTree';
import CustomDate from '../CustomDate';
import Amount from '../Amount';

const styles = theme => ({
    content: {
	paddingTop: theme.spacing(4),
	width: '90%',
    },
    title: {
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    categoryIcon: {
	color: theme.palette.tertiary.main,
	fontSize: 20,
	marginBottom: -4,
    },
    progress: {
	margin: theme.spacing(-0.5),
    },
    divider: {
	paddingTop: theme.spacing(1),
    },
    avatarContainer: {
	width: '100%',
	height: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
    },
    avatar: {
 	borderStyle: 'solid',
  	borderWidth: '2px',
  	borderColor: theme.palette.secondary.main,
	position: 'absolute',
	width: 60,
	height: 60,
    },
    userLinkWrapper: {
	marginTop: theme.spacing(0.7),
    },
    userLink: {
	textDecoration: 'none',
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
    },
    label: {
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
	paddingTop: theme.spacing(1),
    },
    info: {
	color: theme.palette.tertiary.main,
	paddingTop: theme.spacing(1),
    },
    toIcon: {
	paddingRight: theme.spacing(1),
	paddingLeft: theme.spacing(1),
	position: 'relative',
	transform: 'translateY(25%)',
    }, 
    gift: {
	paddingBottom: theme.spacing(1),
	color: theme.palette.tertiary.main,
	fontWeight: 'bold',
    },
    commentCount: {
	color: theme.palette.tertiary.main,
	fontSize: 14,
    },
    commentCountIcon: {
	fontSize: 20,
	marginBottom: -7,
	paddingRight: theme.spacing(0.5),
	color: theme.palette.tertiary.main,
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
    },
    reply: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
	paddingRight: theme.spacing(1),
    },
    bottom: {
	height: theme.spacing(5),
    },
});

class Transfer extends Component {

    onSubmit() {
	console.log('submitted')
    }

    createPage(node) {
	let { classes, context, variant, id } = this.props;

	return (
  	    <Grid container direction="column" justify="center" alignItems="center" >
	      <Grid container className={classes.content}>
		<Grid item xs={3}>
		  <div className={classes.avatarContainer}>
    		    <Avatar
			component={Link}
			prefix={1}
			to={`Person?id=${node.user.person.id}`}
  			alt="Ibis"
    			src={node.user.avatar}
    			className={classes.avatar}
		    />
		  </div>
		</Grid>
		<Grid item xs={7}>
		  <div>
		    <Typography variant="body2" className={classes.title}>
		      {`${node.user.name}`}
		      {<ToIcon className={classes.toIcon} />}
		      {node.target.name}
		    </Typography>
		  </div>
		</Grid>
		<Grid item xs={2}></Grid>

		<Grid item xs={3}></Grid>
		<Grid item xs={2}>
		  <Typography variant="body2" className={classes.label}>
		    From:
		  </Typography>
		</Grid>
		<Grid item xs={5}>
		  <div className={classes.userLinkWrapper}>
		    <Typography
			component={Link}
			prefix={1}
			to={`Person?id=${node.user.person.id}`}
			variant="body2"
			className={classes.userLink}
		    >
		      <span>@{node.user.username}</span>
		    </Typography>
		  </div>
		</Grid>
		<Grid item xs={2}></Grid>

		<Grid item xs={3}></Grid>
		<Grid item xs={2}>
		  <Typography variant="body2" className={classes.label}>
		    To:
		  </Typography>
		</Grid>
		<Grid item xs={5}>
		  <div className={classes.userLinkWrapper}>
		    <Typography
			component={Link}
			prefix={1}
			to={variant === 'donation' ? (
			    `Nonprofit?id=${node.target.id}`
			):(
			    `Person?id=${node.target.id}`
			)}
			variant="body2"
			className={classes.userLink}
		    >
		      <span>@{node.target.username}</span>
		    </Typography>
		  </div>
		</Grid>
		<Grid item xs={2}></Grid>

		<Grid item xs={3}></Grid>
		<Grid item xs={2}>
		  <Typography variant="body2" className={classes.label}>
		    Value:
		  </Typography>
		</Grid>
		<Grid item xs={5}>
		  <Typography variant="body2" className={classes.info}>
		    <Amount amount={node.amount} />
		  </Typography>
		</Grid>
		<Grid item xs={2}></Grid>

		<Grid item xs={3}></Grid>
		<Grid item xs={2}>
		  <Typography variant="body2" className={classes.label}>
		    Time:
		  </Typography>
		</Grid>
		<Grid item xs={5}>
		  <Typography variant="body2" className={classes.info}>
		    <CustomDate date={node.created} />
		  </Typography>
		</Grid>
		<Grid item xs={2}></Grid>

		<Grid item xs={3}></Grid>
		<Grid item xs={7}>
		  <div className={classes.divider}>
		    <CustomDivider />
		  </div>
		</Grid>
		<Grid item xs={2}></Grid>

		<Grid item xs={3}></Grid>
		<Grid item xs={7}>
		  <CustomMarkdown source={node.description} />
		</Grid>
		<Grid item xs={2}></Grid>

		<Grid item xs={12} className={classes.divider}>
		  <div className={classes.action}>
		    {context.userID === node.user.person.id ? (
			<UserDialogList
			variant={DialogLikeVal}
			count={node.likeCount}
			node={node.id}
			/>
		    ):(
			<SimpleEdgeMutation
			variant={LikeVal}
			user={context.userID}
			target={node.id}
			initial={node.hasLiked.edges.length === 1}
			/>
		    )}
		  </div>
		</Grid>

		<Grid item xs={12}>
		  <CommentTree
		      showReplyRoot
		      parent={id}
		      context={context}
		      onSubmitParent={() => this.onSubmit()}
		  />
		</Grid>
		<Grid item xs={12}><div className={classes.bottom} /></Grid>
	      </Grid>
	   </Grid>
	);
    }

    render() {
	let { classes, context, variant, id } = this.props

	let query;

	if (variant === 'donation') {
	    query = loader('../../../Static/graphql/operations/Donation.gql')
	} else {
	    query = loader('../../../Static/graphql/operations/Transaction.gql')
	}

	return (
	    <Query
		fetchPolicy="no-cache"
		query={query} 
		variables={{ id, self: context.userID }}
	    >
	    {({ loading, error, data }) => {
		if (loading) return <LinearProgress className={classes.progress} />;
		if (error) return `Error! ${error.message}`;
		return this.createPage(data[Object.keys(data)[0]]);
	    }}
	    </Query>
	);
    };
};

Transfer.propTypes = {
    classes: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
};

export const DonationVal = 'donation';
export const TransactionVal = 'transaction';

export default withStyles(styles)(Transfer);
