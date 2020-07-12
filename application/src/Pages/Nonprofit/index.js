import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { loader } from 'graphql.macro';
import { Query } from "react-apollo";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import LinearProgress from '@material-ui/core/LinearProgress';

import Link from '../../__Common__/CustomLink';
import Confirmation from '../../__Common__/Confirmation';
import CustomMarkdown from '../../__Common__/CustomMarkdown';
import UserDialogList, { FollowingVal, FollowerVal } from '../../__Common__/UserDialogList';
import DonationList from '../DonationList';
import NewsList from '../NewsList';
import EventList from '../EventList';
import SimpleEdgeMutation, { FollowVal } from '../../__Common__/SimpleEdgeMutation';
import Truncated, { DEFAULT_TRUNCATE_LENGTH } from '../../__Common__/Truncated';
import Amount from '../../__Common__/Amount';

const styles = theme => ({
    root: {
	width: '100%',
    },
    titleWrapper: {
	textAlign: 'center',
    },
    name: {
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    username: {
	color: theme.palette.tertiary.main,
	paddingBottom: theme.spacing(2),
    },
    description: {
	paddingTop: theme.spacing(1.8),
	color: theme.palette.tertiary.main,
    },
    link: {
	color: theme.palette.secondary.main,
	paddingTop: theme.spacing(1),
	textDecoration: 'none',
	fontWeight: 'bold',
    },
    followStatWrapper: {
	textAlign: 'center',
	display: 'flex',
    },
    edgeMutations: {
	display: 'flex',
    },
    fundraised: {
	color: theme.palette.tertiary.main,
	fontWeight: 'bold',
    },
    progress: {
	marginTop: theme.spacing(-0.5),
    },
    card: {
	width: '100%',
	backgroundColor: theme.palette.lightBackground.main,
	marginBottom: theme.spacing(3),
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	width: '100%',
    },
    actionDonate: {
	width: '100%',
	color: theme.palette.secondary.main,
	backgroundColor: 'white',
	borderStyle: 'solid',
	borderWidth: '1px',
	borderColor: theme.palette.secondary.main,
	marginBottom: theme.spacing(1),
    },
    website: {
	paddingTop: theme.spacing(1),
	textTransform: 'none',
	color: theme.palette.secondary.main,
	fontWeight: 'bold',
    },
    seeMore: {
	textTransform: 'none',
	color: theme.palette.secondary.main,
	fontWeight: 'bold',
    },
    hide: {
	display: 'none',
    },
    heading: {
	fontSize: '18px',
	color: theme.palette.tertiary.main,
	paddingLeft: theme.spacing(1),
	width: '90%',
	textAlign: 'left',
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
});

const query = loader('../../Static/graphql/app/Nonprofit.gql')

class Nonprofit extends Component {
    
    state = {
	expanded: false,
	followingCount: null,
	followerCount: null,
    }
    
    toggleExpand() {
	this.setState({ expanded: !this.state.expanded });
    }

    processDonations(data) {
	return data;
    }
    
    processNews(data) {
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

	let imageHeight = Math.round(Math.min(window.innerWidth, context.maxWindowWidth)
	    * context.displayRatio);

	return (
	    <div className={classes.root}>
	      <Card raised className={classes.card}>
		<CardMedia
	            style={{ height: imageHeight }}
    		    image={node.banner}
		/>
		<CardContent>
  		  <Grid container direction="column" justify="center" alignItems="center" >
		    <div className={classes.titleWrapper}>
		      <Typography variant="h6" className={classes.name}>
			{node.name}
		      </Typography>
		      <Typography variant="body2" className={classes.username}>
			@{node.username}
		      </Typography>
		    </div>
		    <Typography
			variant="body2"
			className={classes.fundraised}
		    >
		      <Amount amount={node.fundraised} label="Fundraised"/>
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
			expanded ? (
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
		    <Confirmation
			onClick={() => {window.location = node.link}}
			autoconfirm
		    >
		      <Button>
			<Typography variant="body2" className={classes.website}>
			  Go to website
			</Typography>
		      </Button>
		    </Confirmation>
		  </Grid>
		</CardContent>
		<CardActions>
  		  <Grid container direction="column" justify="center" alignItems="center" >
		    <div className={classes.action}>
		      <div className={classes.edgeMutations}>
		      {
			  node.ibisuserPtr.id !== context.userID &&
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
		    { 
			node.ibisuserPtr.id !== context.userID ? (
			    <Button
			      component={Link}
			      to={`/Donation/DonationCreate?target=${id}`}
			      className={classes.actionDonate}
				>
			      Donate
			    </Button>
			):(
			    <Button
				component={Link}
				to="/_/Deposit"
				className={classes.actionDonate}
				>
			      Deposit
			    </Button>
			)
		    }
		  </Grid>
		</CardActions>
	      </Card>
	      <div className={classes.preview} >
  		<Grid
		    container
		    direction="column"
		    justify="center"
		    alignItems="center"
		    className={node.newsCount === 0 ? classes.hide : classes.none}
		>
		  <Typography variant="button" className={classes.heading} >
		    Recent News
		  </Typography>
		  <NewsList
		      minimal
		      context={context}
		      filterValue={`_Author:${id}`}
		      count={3}
		  />
		  <Typography
		      component={Link}
		      to={`/News/NewsList?filterValue=_Author:${id}`}
		      variant="body2"
		      className={classes.viewAll}
		  >
		    View all news
		  </Typography>
		</Grid>
  		<Grid
		    container
		    direction="column"
		    justify="center"
		    alignItems="center"
		    className={node.eventCount === 0 ? classes.hide : classes.none}
		>
		  <Typography variant="button" className={classes.heading} >
		    Upcoming Events
		  </Typography>
		  <EventList
		      minimal
		      context={context}
		      filterValue={`_Host:${id}`}
		      count={3}
		  />
		  <Typography
		      component={Link}
		      to={`/Event/EventList?filterValue=_Host:${id}`}
		      variant="body2"
		      className={classes.viewAll}
		  >
		    View all events
		  </Typography>
		</Grid>
  		<Grid
		    container
		    direction="column"
		    justify="center"
		    alignItems="center"
		    className={
		        (node.donationToCount + node.donationFromCount) === 0 ?
		        classes.hide :
		        classes.none
		    }
		>
		  <Typography variant="button" className={classes.heading} >
		    Donation History
		  </Typography>
		  <DonationList
		      minimal
		      context={context}
		      filterValue={`_User:${id}`}
		      count={3}
		  />
		    <Typography
			component={Link}
			to={`/Donation/DonationList?filterValue=_User:${id}`}
			variant="body2"
			className={classes.viewAll}
		    >
		      View all donations
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
		  return this.createPage(data.nonprofit);
	      }}
	    </Query>
	);
    };
};

Nonprofit.propTypes = {
    id: PropTypes.string.isRequired,
};

export default withStyles(styles)(Nonprofit);
