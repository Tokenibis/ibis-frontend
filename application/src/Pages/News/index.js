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

import AnimalIcon from '@material-ui/icons/PetsOutlined';
import ArtIcon from '@material-ui/icons/PaletteOutlined';
import CivilIcon from '@material-ui/icons/RecordVoiceOverOutlined';
import DevelopmentIcon from '@material-ui/icons/LocationCityOutlined';
import EducationIcon from '@material-ui/icons/LocalLibraryOutlined';
import EnvironmentIcon from '@material-ui/icons/TerrainOutlined';
import HealthIcon from '@material-ui/icons/HealingOutlined';
import HumanIcon from '@material-ui/icons/GroupOutlined';

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
    media: {
	height: 160,
	paddingBottom: theme.spacing(1),
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
    query News($id: ID!){
	news(id: $id){
	    id
	    title
	    created
	    description
	    content
	    user {
		id
		nonprofit {
		    id
		    title
		}
	    }
	}
    }
`;

class News extends Component {

    constructor({ classes }) {
	super();
	this.icons = [
	    <AnimalIcon className={classes.categoryIcon} />,
	    <ArtIcon className={classes.categoryIcon} />,
	    <CivilIcon className={classes.categoryIcon} />,
	    <DevelopmentIcon className={classes.categoryIcon} />,
	    <EducationIcon className={classes.categoryIcon} />,
	    <EnvironmentIcon className={classes.categoryIcon} />,
	    <HealthIcon className={classes.categoryIcon} />,
	    <HumanIcon className={classes.categoryIcon} />,
	]
    };

    createPage(news) {
	let { classes } = this.props;

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
			to={`Nonprofit?id=${news.user.nonprofit.id}`}
  			alt="Ibis"
    			src={require(`../../Static/Images/birds/bird${(news.description.length) % 10}.jpg`)}
    			className={classes.avatar}
		    />
		  </ListItemIcon>
		  <ListItemText
		  primary={
		      <div>
  			<Typography variant="body2" className={classes.name}>
  			  {news.title}
  			</Typography>
  			<Typography variant="body2" className={classes.username}>
  			  {new Date(news.created).toDateString()}
  			</Typography>
		      </div>
		  }
		  />
		</ListItem>
  		<CardMedia
  		    className={classes.media}
    		    image={require(`../../Static/Images/egypt/pic${news.description.length % 10}.jpg`)}
  		    title={news.title}
  		/>
  		<Typography variant="body2" className={classes.body}>
		  <ReactMarkdown source={news.content} />
		</Typography>
		<CustomDivider/>
		<div className={classes.action}>
		  <div>
		    <IconButton className={classes.stats}>
		      <LikeIcon className={classes.statIcon}/> (0)
		    </IconButton>
  		    <IconButton>
  		      <BookmarkIcon className={classes.statIcon}/>
  		    </IconButton>
		  </div>
		  {this.icons[(news.description.length) % this.icons.length]}
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
	let { classes, id } = this.props

	return (
	    <Query query={QUERY} variables={{ id }}>
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
