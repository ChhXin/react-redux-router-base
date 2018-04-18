import React from 'react';
import {Provider} from 'react-redux';
import Immutable from 'immutable';
// 引入 renderToString
import {renderToString, renderToNodeStream} from 'react-dom/server';
// 服务端是没有BrowserRouter 所以用 StaticRouter
import {StaticRouter, Route} from 'react-router-dom';

import {configureStore} from '../../client/Root';
import loading from '../../client/common/reducers/loading';
import {combineReducers} from 'redux-immutable';
import App from '../../client/common/App';
import HomePage from '../../client/pages/home/HomePage';
import home from '../../client/pages/home/reducer';
import toast from '../../client/common/reducers/toast';

function getReducers(page) {
  const reducers = combineReducers({
    toast,
    loading,
    home,
  });

  return reducers;
}

function getContainer(page) {
  const container = () => {
    return (
      <App>
        <Route path="/" component={HomePage}/>
      </App>
    );
  };
  return container;
}

// 服务端渲染主函数
function serverRender(req, page) {

  const Container = getContainer(page);
  const reducers = getReducers(page);

  // 初始化 store
  const store = configureStore(reducers, Immutable.fromJS({}));

  const frontComponents = renderToString(
    <Provider store={store}>
      <StaticRouter
        location={req.url}>
        <Container/>
      </StaticRouter>
    </Provider>,
  );

  return frontComponents;
}

module.exports = serverRender;
