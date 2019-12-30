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
import ReactMarkdown from 'react-markdown';

import Link from '../../__Common__/CustomLink';
import FollowDisplay, { FollowingVal, FollowerVal } from '../__Common__/FollowDisplay';
import DonationList from '../DonationList';
import NewsList from '../NewsList';
import EventList from '../EventList';
import SimpleEdgeMutation, { FollowVal } from '../__Common__/SimpleEdgeMutation';
import Truncated from '../__Common__/Truncated';

const removeMd = require('remove-markdown');

const styles = theme => ({
    root: {
	width: '100%',
    },
    description: {
	color: theme.palette.tertiary.main,
    },
    descriptionToggle: {
	color: theme.palette.secondary.main,
	textAlign: 'right',
    },
    link: {
	color: theme.palette.secondary.main,
	paddingTop: theme.spacing(1),
	textDecoration: 'none',
	fontWeight: 'bold',
    },
    endWrapper: {
	textAlign: 'center',
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
	textTransform: 'none',
	color: theme.palette.secondary.main,
	fontWeight: 'bold',
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
    viewAll: {
	color: theme.palette.secondary.main,
	width: '90%',
	textAlign: 'right',
	paddingTop: theme.spacing(1),
	paddingBottom: theme.spacing(3),
	textDecoration: 'none',
    },
});

const query = loader('../../Static/graphql/operations/Nonprofit.gql')

class Nonprofit extends Component {
    
    state = {
	expanded: false,
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
	let { expanded } = this.state;

	let imageHeight = Math.round(Math.min(window.innerWidth, context.maxWindowWidth)
	    * context.displayRatio);

	return (
	    <div className={classes.root}>
	      <Card raised className={classes.card}>
		<CardMedia
	            style={{ height: imageHeight }}
    		    image={node.avatar}
		/>
		<CardContent>
  		  {
		      expanded ? (
			  <div>
			    <Typography variant="body2" className={classes.description}>
			      <ReactMarkdown
				  source={node.description}
			      />
			    </Typography>
			    <div className={classes.endWrapper}>
			      <Button>
				<Typography variant="body2" className={classes.website}>
				  <a className={classes.link} href={node.link}>Go to website</a>
				</Typography>
			      </Button>
			      <Typography variant="body2" className={classes.fundraised}>
				Fundraised: ${(node.fundraised/100).toFixed(2)}
			      </Typography>
			      <FollowDisplay
				  variant={FollowerVal}
				  count={node.followerCount}
				  user={node.id}
			      />
			    </div>
			  </div>
		      ):(
			  <Typography variant="body2" className={classes.description}>
			    <Truncated
				text={removeMd(node.description)}
			    />
			  </Typography>
		      )
		  }
		</CardContent>
		<CardActions>
  		  <Grid container direction="column" justify="center" alignItems="center" >
		    <div className={classes.action}>
		      <div className={classes.edgeMutations}>
			<SimpleEdgeMutation
			    variant={FollowVal}
			    user={context.userID}
			    target={node.id}
			    initial={node.isFollowing.edges.length === 1}
			/>
		      </div>
		      <Button onClick={() => {this.setState({ expanded: !expanded })}}>
			<Typography
			    variant="body2"
			    className={classes.seeMore}
			>
			  {expanded ? 'See Less' : 'See More'}
			</Typography>
		      </Button>
		    </div>
		    <Button
			component={Link}
			prefix={1}
			to={`DonationCreate?target=${id}`}
			className={classes.actionDonate}
		    >
		      Donate
		    </Button>
		  </Grid>
		</CardActions>
	      </Card>
	      <div className={classes.preview} >
  		<Grid container direction="column" justify="center" alignItems="center" >
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
		      prefix={1}
		      to={`NewsList?filterValue=_Author:${id}`}
		      variant="body2"
		      className={classes.viewAll}
		  >
		    View all news
		  </Typography>
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
		      prefix={1}
		      to={`EventList?filterValue=_Host:${id}`}
		      variant="body2"
		      className={classes.viewAll}
		  >
		    View all events
		  </Typography>
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
			prefix={1}
			to={`DonationList?filterValue=_User:${id}`}
			variant="body2"
			className={classes.viewAll}
		    >
		      View all donations
		    </Typography>
		</Grid>
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
