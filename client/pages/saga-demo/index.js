import React from 'react';
import PropTypes from 'prop-types';
import {Link, BrowserRouter, Route, Switch, Redirect} from 'dva/router';
import Loadable from 'react-loadable';
import App from '../../common/App';
import {URL_CONTEXT} from '../../../common/constants';
import models from './models';

import Root from '../../Root';
import LoadingComponent from '../../components/LoadingComponent';

const basename = `${URL_CONTEXT}/`;

const Container = ({history, location}) => {
  return (
    <BrowserRouter basename={basename}>
      <App>
        <Switch location={location}>
          <Route
            path="/"
            component={Loadable({
              loader: () => import('./components/Persons'),
              loading: LoadingComponent,
            })}
          />
        </Switch>
      </App>
    </BrowserRouter>
  );
};

Container.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};

Root({models, Container});
