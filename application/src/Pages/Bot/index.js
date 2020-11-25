import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { loader } from 'graphql.macro';
import { Query } from "react-apollo";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import LinearProgress from '@material-ui/core/LinearProgress';

import Link from '../../__Common__/CustomLink';
import CustomMarkdown from '../../__Common__/CustomMarkdown';
import UserDialogList, { FollowingVal, FollowerVal } from '../../__Common__/UserDialogList';
import ActivityList from '../ActivityList';
import DonationList from '../DonationList';
import RewardList from '../RewardList';
import EventList from '../EventList';
import SimpleEdgeMutation, { FollowVal } from '../../__Common__/SimpleEdgeMutation';
import Truncated, { DEFAULT_TRUNCATE_LENGTH } from '../../__Common__/Truncated';
import Amount from '../../__Common__/Amount';


const styles = theme => ({
    root: {
	width: '100%',
    },
    username: {
	color: theme.palette.tertiary.main,
	paddingBottom: theme.spacing(2),
    },
    name: {
	color: theme.palette.primary.main,
    },
    description: {
	paddingTop: theme.spacing(1.8),
	color: theme.palette.tertiary.main,
    },
    rewarded: {
	paddingTop: theme.spacing(1),
	color: theme.palette.tertiary.main,
	textDecoration: 'none',
    },
    link: {
	color: theme.palette.secondary.main,
    },
    followStatWrapper: {
	paddingTop: theme.spacing(1),
	display: 'flex',
    },
    progress: {
	marginTop: theme.spacing(-0.5),
    },
    card: {
	width: '100%',
	backgroundColor: theme.palette.lightBackground.main,
	marginBottom: theme.spacing(3),
    },
    avatar: {
	backgroundColor: 'white',
	marginTop: theme.spacing(3),
	width: 100,
	height: 100,
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	width: '100%',
    },
    actionPay: {
	width: '100%',
	color: theme.palette.secondary.main,
	backgroundColor: 'white',
	borderStyle: 'solid',
	borderWidth: '1px',
	borderColor: theme.palette.secondary.main,
	marginBottom: theme.spacing(3),
    },
    followers: {
	textTransform: 'none',
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
    },
    edgeMutations: {
	display: 'flex',
    },
    seeMore: {
	textTransform: 'none',
	color: theme.palette.secondary.main,
	fontWeight: 'bold',
    },
    heading: {
	fontSize: '18px',
	color: theme.palette.tertiary.main,
	paddingLeft: theme.spacing(1),
	width: '90%',
	textAlign: 'left',
    },
    hide: {
	display: 'none',
    },
    viewAll: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
	width: '90%',
	textAlign: 'right',
	paddingTop: theme.spacing(1),
	paddingBottom: theme.spacing(3),
	textDecoration: 'none',
    },
    bottom: {
	height: theme.spacing(5),
    },
    none: {},
})

const query = loader('../../Static/graphql/app/Bot.gql')

class Bot extends Component {

    state = {
	expanded: false,
	followerCount: null,
    }

    toggleExpand() {
	this.setState({ expanded: !this.state.expanded });
    }
    
    processDonations(data) {
	return data;
    }

    processRewards(data) {
	return data;
    }
    
    processEvents(data) {
	return data;
    }
    
    createPage(node) {
	let { classes, context, id } = this.props;
	let { expanded, followerCount } = this.state;

	let followerCallback = (change) => {
	    this.setState({ followerCount: node.followerCount + change });
	}
	if (followerCount === null) {
	    this.setState({ followerCount: node.followerCount });
	}

	return (
	    <div className={classes.root}>
	      <Card raised className={classes.card}>
		<CardContent>
  		  <Grid container direction="column" justify="center" alignItems="center" >
  		    <Avatar 
  			alt="Ibis"
    			src={node.avatar}
  			className={classes.avatar}
		    />
		    <Typography variant="h6" className={classes.name}>
		      {node.name}
		    </Typography>
		    <Typography variant="body2" className={classes.username}>
		      @{node.username}
		    </Typography>
		    <Typography
			variant="body2"
			className={classes.rewarded}
		    >
		      <Amount amount={node.rewarded} label="Rewarded"/>
		    </Typography>
		    <div className={classes.followStatWrapper}>
		      <UserDialogList
		      variant={FollowingVal}
		      count={node.followingCount}
		      node={node.id}
		      />
		      <UserDialogList
		      variant={FollowerVal}
		      count={followerCount}
		      node={node.id}
		      />
		    </div>
  		    {
			expanded || node.description.length <= DEFAULT_TRUNCATE_LENGTH ? (
			    <CustomMarkdown safe source={node.description} />
			):(
			    <Typography variant="body2" className={classes.description}>
			      <Truncated
				  text={node.description}
				  length={DEFAULT_TRUNCATE_LENGTH}
			      />
			    </Typography>
			)
		    }
		  </Grid>
		</CardContent>
		<CardActions>
  		  <Grid container direction="column" justify="center" alignItems="center" >
		    <div className={classes.action}>
		      <div className={classes.edgeMutations}>
			{
			    node.id !== context.userID &&
			    <SimpleEdgeMutation
				variant={FollowVal}
				user={context.userID}
				target={node.id}
				initial={node.isFollowing.edges.length === 1}
				countCallback={followerCallback}
			    />
			}
		      </div>
		      {
			  node.description && node.description.length > DEFAULT_TRUNCATE_LENGTH && (
			      <Button onClick={() => {this.setState({ expanded: !expanded })}}>
				<Typography
				  variant="body2"
				  className={classes.seeMore}
				  >
				  {expanded ? 'See Less' : 'See More'}
				</Typography>
			      </Button>
			  )
		      }
		    </div>
		  </Grid>
		</CardActions>
	      </Card>
	      <div className={classes.preview} >
  		<Grid
		    container
		    direction="column"
		    justify="center"
		    alignItems="center"
		    className={node.activityCount === 0 ? classes.hide : classes.none}
		>
		  <Typography variant="button" className={classes.heading} >
		    Activity History
		  </Typography>
		  <ActivityList
		      minimal
		      context={context}
		      filterValue={`_User:${id}`}
		      count={3}
		  />
		  <Typography
		      component={Link}
		      to={`/Activity/ActivityList?filterValue=_User:${id}`}
		      variant="body2"
		      className={classes.viewAll}
		  >
		    View all activities
		  </Typography>
		</Grid>
  		<Grid
		    container
		    direction="column"
		    justify="center"
		    alignItems="center"
		    className={
		        (node.rewardCount) === 0 ?
		        classes.hide :
		        classes.none
		    }
		>
		  <Typography variant="button" className={classes.heading} >
		    Reward History
		  </Typography>
		  <RewardList
		      minimal
		      context={context}
		      filterValue={`_User:${id}`}
		      count={3}
		  />
		  <Typography
		      component={Link}
		      to={`/Reward/RewardList?filterValue=_User:${id}`}
		      variant="body2"
		      className={classes.viewAll}
		  >
		    View all rewards
		  </Typography>
		</Grid>
		<Grid item xs={12}><div className={classes.bottom} /></Grid>
	      </div>
	    </div>
	); 
    }
    
    render() {
	let { classes, context, id } = this.props

	return (
	    <Query
		fetchPolicy="no-cache"
		query={query}
		variables={{ id, self: context.userID }}
	    >
	      {({ loading, error, data }) => {
		  if (loading) return <LinearProgress className={classes.progress} />;
		  if (error) return `Error! ${error.message}`;
		  return this.createPage(data.bot);
	      }}
	    </Query>
	);
    };
};

Bot.propTypes = {
    id: PropTypes.string.isRequired,
};

export default withStyles(styles)(Bot);
