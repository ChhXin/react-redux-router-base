import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Header from './components/Header';
import Footer from './components/Footer';

import { webLog, webView } from '../utils/ping';
import '../scss/index.scss';

class App extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    dispatch: PropTypes.func,
  };

  static childContextTypes = {
    dispatch: PropTypes.func,
    webLog: PropTypes.func,
    webView: PropTypes.func,
  };

  /**
   * 注意：在子组件中使用 context 的值，不要修改，只能使用或调用
   * Updating Context
   * Don't do Updating Context.
   */
  getChildContext() {
    const { dispatch } = this.props;

    return { dispatch, webLog, webView };
  }

  // React 16 新增方法，用来处理错误边界，可以捕获整个子组件树内发生的任何异常
  componentDidCatch(error, errorInfo) {
    // 可以打印异常，或者往后端日志中发送异常，方便定位跟踪
    console.info(error);
    console.error(errorInfo);
  }

  render() {
    const { children } = this.props;

    return (
      <div>
        <Header/>
        {children}
        <Footer/>
      </div>
    );
  }
}

export default connect()(App);

