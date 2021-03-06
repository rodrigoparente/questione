import React, {forwardRef, useState} from 'react';
import {NavLink as RouterLink, useHistory} from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {List, ListItem, Button, colors} from '@material-ui/core';
import {logout} from "../../../../../../services/auth";
import ExitToApp from '@material-ui/icons/ExitToApp';


const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: colors.blueGrey[800],
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.main
    }
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </div>
));



const SidebarNav = props => {
  const { pages, className, ...rest } = props;

  const classes = useStyles();

  const [isTourOpen, setIsTourOpen] = useState(true);

  const history = useHistory();

  async function handleLogout(event) {
    event.preventDefault();

    logout();
    history.push('/');
  }

  return (
      <div>
        <List
          {...rest}
          className={clsx(classes.root, className)}>
          {pages.map(page => (
              <div className={page.className}>
                <ListItem
                  className={classes.item}
                  disableGutters
                  key={page.title}>
                  <Button
                    activeClassName={classes.active}
                    className={classes.button}
                    component={CustomRouterLink}
                    to={page.href}>
                    <div className={classes.icon}>{page.icon}</div>
                    {page.title}
                  </Button>
                </ListItem>
              </div>
          ))}
          <div className="exit">
            <ListItem
                className={classes.item}
                disableGutters
                key="btExit">
              <Button
                  activeClassName={classes.active}
                  className={classes.button}
                  onClick={handleLogout}>
                <div className={classes.icon}><ExitToApp /></div>
                Sair
              </Button>
            </ListItem>
          </div>
        </List>
      </div>
  );
};

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired,
};

export default SidebarNav;
