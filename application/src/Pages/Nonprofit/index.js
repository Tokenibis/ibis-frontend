import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Grid from '@material-ui/core/Grid';

import NewsList from '../NewsList';
import EventList from '../EventList';
import ListView from '../__Common__/ListView';
import DonationSublist from '../DonationList/sublist';
import NewsSublist from '../DonationList/sublist';
import EventSublist from '../DonationList/sublist';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import LikeIcon from '@material-ui/icons/FavoriteBorder';
import BookmarkIcon from '@material-ui/icons/BookmarkBorder';
import NonprofitIcon from '@material-ui/icons/CardGiftcard';
import ScrollToTop from "react-scroll-up";
import UpIcon from '@material-ui/icons/ArrowUpward';
import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
    root: {
	width: '100%',
    },
    avatar: {
	borderStyle: 'solid',
	borderWidth: '2px',
	borderColor: theme.palette.secondary.main,
    },
    title: {
	color: theme.palette.primary.main,
	fontWeight: 'bold',
    },
    subheader: {
	color: theme.palette.tertiary.main,
    },
    nonprofitIcon: {
	fontSize: 18,
	marginBottom: -4,
	marginRight: theme.spacing.unit,
    },
    description: {
	color: theme.palette.tertiary.main,
    },
    progress: {
	position: 'absolute',
	top: '50%',
	left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    card: {
	width: '100%',
	marginBottom: theme.spacing.unit,
    },
    media: {
	height: 160,
    },
    readMore: {
	marginLeft: 'auto',
	marginRight: theme.spacing.unit * 2,
	color: theme.palette.secondary.main,
	fontWeight: 'bold',
	float: 'right',
    }
})

class Nonprofit extends Component {

    processDonations(data) {
	return data;
    }
    
    processNews(data) {
	return data;
    }

    processEvents(data) {
	return data;
    }
    
    createPage(nonprofit) {
	let { classes } = this.props
	return (
	    <div className={classes.root}>
	      <Card raised className={classes.card}>
		<CardMedia
		    className={classes.media}
  		    image={require(`../../Static/Images/egypt/pic1.jpg`)}
		/>
		<CardContent>
		  {nonprofit.description}
		  <Typography variant="body2" className={classes.description}>
		  </Typography>
		  <Typography variant="body2" className={classes.description}>
		    https://www.trevornoahfoundation.org
		  </Typography>
		</CardContent>
		<CardActions>
		  <IconButton color="secondary" aria-label="Like">
		    <LikeIcon />
		  </IconButton>
		</CardActions>
	      </Card>
	      <Typography variant="h6">
		Donations
	      </Typography>
	      <DonationSublist data={nonprofit.user.transactionSet} />
	      <Typography variant="h6">
		News
	      </Typography>
	      <NewsSublist data={(nonprofit.user.transactionSet)} />
	      <Typography variant="h6">
		Events
	      </Typography>
	    </div>
	); 
    }
    
    render() {
	let { classes, id } = this.props

	const query = gql`
	    query {
		nonprofit(id: "${id}") {
		    description
		    title
		    user {
			followerCount
			transactionSet {
			    edges {
				node {
				    id
				    amount
				    description
				    created
				    user {
					id
					firstName
					lastName
				    }
				    target {
					id
					firstName
					lastName
					nonprofit {
					    id 
					    title
					}
				    }
				}
			    }
			}
			postSet {
			    edges {
				node {
				    id
				    event {
					id
					title
				    }
				    article {
					id
					title
				    }
				}
			    }
			}
		    }
		}
	    }
	`;

	return (
	    <Query query={query}>
	      {({ loading, error, data }) => {
		  if (loading) return <CircularProgress className={classes.progress} />;
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
