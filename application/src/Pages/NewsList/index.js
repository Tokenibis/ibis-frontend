import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Fab from '@material-ui/core/Fab';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import LikeIcon from '@material-ui/icons/FavoriteBorder';
import BookmarkIcon from '@material-ui/icons/BookmarkBorder';
import NonprofitIcon from '@material-ui/icons/CardGiftcard';
import UpIcon from '@material-ui/icons/ArrowUpward';

import News from '../News';
import Nonprofit from '../Nonprofit';

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
	color: theme.palette.secondary.main,
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
    fab: {
	position: 'fixed',
	float: 'right',
	bottom: theme.spacing.unit * 3,
	right: theme.spacing.unit * 3,
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

const QUERY = gql`
    query {
	allArticles {
	    edges {
		node {
		    title
		    description
		    created
		}
	    }
	}
    }
`;

class NewsList extends Component {

    createItem(allArticles) {
	let { classes, handleWindow } = this.props;

	return (
	    allArticles.edges.map((item, i) => ( 
		<Card raised className={classes.card}>
		  <CardHeader
		      avatar={
			  <div>
  			  <Avatar
		              onClick={(e) => handleWindow(<Nonprofit />)}
			      alt="Ibis"
  			      src={require('../../Static/Images/nonprofit.jpg')}
  			      className={classes.avatar} />
			  </div>

		      }
		      title={
			  <Typography
		              onClick={(e) => handleWindow(<News />)}
			      variant="body2"
			      className={classes.title}
			  >
			  {item.node.title}
			</Typography>
		      }
		      subheader={
			<Typography variant="body2" className={classes.subheader}>
			  {<NonprofitIcon className={classes.nonprofitIcon} />}
			  {new Date(allArticles.edges[0].node.created).toDateString()}
			</Typography>
		      }
		  />
		  {
		      i === 0 &&
		      <CardMedia
			  className={classes.media}
  			  image={require('../../Static/Images/news.jpg')}
			  title={item.node.title}
		      />
		  }
		  <CardContent>
		    <Typography variant="body2" className={classes.description}>
		      {item.node.description}
		    </Typography>
		  </CardContent>
		  <CardActions>
		    <IconButton color="secondary" aria-label="Like">
		      <LikeIcon />
		    </IconButton>
		    <IconButton color="secondary" aria-label="Bookmark">
		      <BookmarkIcon />
		    </IconButton>
		    <Typography
		        onClick={(e) => handleWindow(<News />)}
			variant="body2"
			className={classes.readMore}
		    >
		      Read more...
		    </Typography>
		  </CardActions>
		</Card>

	    ))
	);
    };

    render() {
	let { classes } = this.props;

	return (
	    <div className={classes.root}>
	      <Query query={QUERY}>
		{({ loading, error, data }) => {
		    if (loading) return <CircularProgress className={classes.progress} />;
		    if (error) return `Error! ${error.message}`;
		    return this.createItem(data.allArticles);
		}}
	      </Query>
	      <div className={classes.fab} onClick={(e) => {window.scrollTo(0, 0)}}>
		<Fab color="primary">
		  <UpIcon />
		</Fab>
	      </div>
	    </div>
	);
    };
};

NewsList.propTypes = {
    handleWindow: PropTypes.func.isRequired,
};

export default withStyles(styles)(NewsList);
