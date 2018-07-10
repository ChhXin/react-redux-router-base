import React from 'react';
import PropTypes from 'prop-types';
import {Link, BrowserRouter, Route, Switch, Redirect, NavLink} from 'dva/router';
import Loadable from 'react-loadable';
import App from '../../common/App';
import {URL_CONTEXT} from '../../../common/constants';
import models from './models';

import Root from '../../Root';
import LoadingComponent from '../../components/LoadingComponent';

const basename = `${URL_CONTEXT}/page2/`;

const Container = ({history, location}) => {
  return (
    <BrowserRouter basename={basename}>
      <App>
        <div className="container m-t-3">
          <nav className="tab-bar tab-bar-primary">
            <NavLink className="tab" activeClassName="active" to="/person">Person</NavLink>
            <NavLink className="tab" activeClassName="active" to="/film">Film</NavLink>
          </nav>
          <div className="m-t-2">
            <Switch location={location}>
              <Route path="/person" component={Loadable({
                loader: () => import('./person/components/Person'),
                loading: LoadingComponent,
              })}/>
              <Route path="/film" component={Loadable({
                loader: () => import('./film/components/Film'),
                loading: LoadingComponent,
              })}/>
            </Switch>
          </div>
        </div>
      </App>
    </BrowserRouter>
  );
};

Container.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};

Root({models, Container});
