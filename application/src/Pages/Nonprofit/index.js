import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';

import Link from '../../__Common__/CustomLink';
import DonationList from '../DonationList';
import NewsList from '../NewsList';
import EventList from '../EventList';
import AddButton from '../__Common__/AddButton';

const styles = theme => ({
    root: {
	width: '100%',
    },
    descriptionText: {
	color: theme.palette.tertiary.main,
    },
    descriptionToggle: {
	color: theme.palette.secondary.main,
	textAlign: 'right',
    },
    link: {
	color: theme.palette.secondary.main,
	paddingTop: theme.spacing(1),
    },
    progress: {
	marginTop: theme.spacing(1),
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
	marginBottom: theme.spacing(3),
    },
    followers: {
	textTransform: 'none',
	color: theme.palette.secondary.main,
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
	paddingBottom: theme.spacing(3),
	textDecoration: 'none',
    },
});

const QUERY = gql`
    query Nonprofit($id: ID!){
	nonprofit(id: $id){
	    followerCount
	    description
	    title
	    link
	    avatar
	}
    }
`;

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
	      <Card className={classes.card}>
		<CardMedia
	            style={{ height: imageHeight }}
    		    image={node.avatar}
		/>
		<CardContent>
  		  {
		      expanded ? (
			  <Typography variant="body2" className={classes.descriptionText}>
			    node.description
			  </Typography>
		      ):(
			  <Typography variant="body2" className={classes.descriptionText}>
			    {`${node.description.substring(0, 300)}...`} readmore
			  </Typography>
		      )
		  }
		  <Typography variant="body2" className={classes.link}>
		    {node.link}
		  </Typography>
		</CardContent>
		<CardActions>
  		  <Grid container direction="column" justify="center" alignItems="center" >
		    <div className={classes.action}>
		      <div className={classes.actionLeft}>
  			<IconButton color="secondary" aria-label="Like">
  			  <AddButton label="Follow" />
  			</IconButton>
		      </div>
		      <Button>
			<Typography variant="body2" className={classes.followers}>
			  {`Followers: ${node.followerCount}`}
			</Typography>
		      </Button>
		    </div>
		    <Button className={classes.actionDonate}>
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
		      variant="minimal"
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
		      variant="minimal"
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
		      variant="minimal"
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
	let { classes, id } = this.props

	return (
	    <Query query={QUERY} variables={{ id: id }}>
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
