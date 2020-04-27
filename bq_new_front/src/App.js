import React, { Component } from 'react';
import { Router } from 'react-router-dom';
import './global.css';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import Routes from './routes/routes.js';
import { createBrowserHistory } from 'history';

const browserHistory = createBrowserHistory();

export default class App extends Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <Router history={browserHistory}>
                    <Routes />
                </Router>
            </ThemeProvider>
        );
    }
}