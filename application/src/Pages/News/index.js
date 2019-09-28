import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CardMedia from '@material-ui/core/CardMedia';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import LikeIcon from '@material-ui/icons/FavoriteBorder';
import BookmarkIcon from '@material-ui/icons/BookmarkBorder';
import CommentIcon from '@material-ui/icons/CommentOutlined';
import ReactMarkdown from 'react-markdown';

import NonprofitCategoryIcon from '../__Common__/NonprofitCategoryIcon';
import Link from '../../__Common__/CustomLink';
import CustomDivider from '../../__Common__/CustomDivider';
import SimpleEdgeMutation, { LikeVal, BookmarkVal } from '../__Common__/SimpleEdgeMutation';

const styles = theme => ({
    content: {
	width: '90%',
    },
    avatar: {
 	borderStyle: 'solid',
  	borderWidth: '2px',
  	borderColor: theme.palette.secondary.main,
    },
    categoryIcon: {
	color: theme.palette.tertiary.main,
	fontSize: 20,
	marginBottom: -4,
    },
    name: {
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    username: {
	color: theme.palette.tertiary.main,
    },
    image: {
	marginLeft: '0px',
	paddingLeft: '0px',
    },
    body: {
	color: theme.palette.tertiary.main,
	paddingBottom: theme.spacing(2),
	paddingTop: theme.spacing(2),
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	width: '100%',
    },
    stats: {
	color: theme.palette.secondary.main,
	fontSize: 14,
    },
    statIcon: {
	fontSize: 20,
	marginBottom: -7,
	paddingRight: theme.spacing(0.5),
	color: theme.palette.secondary.main,
    },
    divider: {
	width: '100%',
    },
    bottom: {
	height: theme.spacing(5),
    },
});

const QUERY = gql`
    query News($id: ID! $self: String){
	news(id: $id){
	    id
	    title
	    created
	    description
	    content
	    image
	    user {
		id
		avatar
		nonprofit {
		    id
		    title
		    category {
			id
		    }
		}
	    }
	    hasLiked: like(id: $self) {
		edges {
		    node {
			id
		    }
		}
	    }
	    hasBookmarked: bookmark(id: $self) {
		edges {
		    node {
			id
		    }
		}
	    }
	}
    }
`;

class News extends Component {

    createPage(node) {
	let { classes, context } = this.props;
	
	let imageHeight = Math.round(Math.min(window.innerWidth, context.maxWindowWidth)
	    * context.displayRatio);

	return (
  	    <Grid container direction="column" justify="center" alignItems="center" >
	      <Grid className={classes.content} item xs={12}>
		<ListItem
		    className={classes.image}
		>
		  <ListItemIcon>
    		    <Avatar
			component={Link}
			prefix={1}
			to={`Nonprofit?id=${node.user.nonprofit.id}`}
  			alt="Ibis"
    			src={node.user.avatar}
    			className={classes.avatar}
		    />
		  </ListItemIcon>
		  <ListItemText
		  primary={
		      <div>
  			<Typography variant="body2" className={classes.name}>
  			  {node.title}
  			</Typography>
  			<Typography variant="body2" className={classes.username}>
  			  {new Date(node.created).toDateString()}
  			</Typography>
		      </div>
		  }
		  />
		</ListItem>
  		<CardMedia
		    style={{ height: imageHeight }}
    		    image={node.image}
  		    title={node.title}
  		/>
  		<Typography variant="body2" className={classes.body}>
		  <ReactMarkdown source={node.content} />
		</Typography>
		<CustomDivider/>
		<div className={classes.action}>
		  <div>
		    <SimpleEdgeMutation
			variant={LikeVal}
			user={context.userID}
			target={node.id}
			initial={node.hasLiked.edges.length === 1}
		    />
		    <SimpleEdgeMutation
			variant={BookmarkVal}
			user={context.userID}
			target={node.id}
			initial={node.hasBookmarked.edges.length === 1}
		    />
		  </div>
		  <NonprofitCategoryIcon
		      id={node.user.nonprofit.category.id}
		      className={classes.categoryIcon}
		  />
		  <IconButton className={classes.stats}>
		    <CommentIcon className={classes.statIcon}/> (0)
		  </IconButton>
		</div>
		<CustomDivider/>
	      </Grid>
	      <Grid item xs={12}><div className={classes.bottom} /></Grid>
	    </Grid>
	);
    }

    render() {
	let { classes, context, id } = this.props

	return (
	    <Query
		fetchPolicy="network-only"
		query={QUERY}
		variables={{ id, self: context.userID }}
	    >
	      {({ loading, error, data }) => {
		  if (loading) return <LinearProgress className={classes.progress} />;
		  if (error) return `Error! ${error.message}`;
		  return this.createPage(data.news);
	      }}
	    </Query>
	);
    };
};

export default withStyles(styles)(News);
