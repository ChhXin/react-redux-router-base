import React from 'react';
import PropTypes from 'prop-types';
import dva from 'dva';
import createLoading from 'dva-loading';
import createBrowserHistory from 'history/createBrowserHistory';
import commonModels from './common/models';
import './scss/index.scss'

// middlewares
const middleware = [];
if (process.env.NODE_ENV !== 'production') {
  const { createLogger } = require('redux-logger');
  middleware.push(createLogger());
}

// 创建 app
const app = dva({
  history: createBrowserHistory(),
  onAction: middleware,
  onError(e, dispatch) {
    console.log(e.message);
  },
});

app.use(createLoading());

const Root = ({ models = [], Container }) => {
  const RouterConfig = ({ history, location }) => (
    <Container history={history} locaiton={location} />
  );

  RouterConfig.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
  };

  const ms = commonModels.concat(models);

  ms.forEach(model => {
    app.model(model.default);
  });

  app.router(RouterConfig);

  app.start('#layout');
};

export default Root;
