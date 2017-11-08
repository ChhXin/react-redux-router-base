import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import HeaderModule from './components/Header'
import FooterModule from './components/Footer';
import SideBar from './components/sideBar/SideBar';
import {clearToast} from './action/toast';

import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { Content, Sider } = Layout;

export class App extends Component {

  static propTypes = {
    children: PropTypes.node,
    toast: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidUpdate() {
    const {
      toast, dispatch
    } = this.props;

    if (toast && toast.get('effect') === 'enter') {
      if (this.toastTimeoutId) {
        clearTimeout(this.toastTimeoutId);
      }
      this.toastTimeoutId = setTimeout(() => {
        dispatch(clearToast());
        this.toastTimeoutId = null;
      }, toast.get('time'));
    }
  }

  // React 16 新增方法，用来处理错误边界，可以捕获整个子组件树内发生的任何异常
  componentDidCatch(error, errorInfo) {
    // 可以打印异常，或者往后端日志中发送异常，方便定位跟踪
    console.info(error);
    console.error(errorInfo);
  }

  // toast 组件
  renderToast() {
    const {
      toast
    } = this.props;
    const content = toast.get('content');
    const effect = toast.get('effect');

    return (
      <div
        className={`toast-panel ${effect || ''}`}>
        <div className="toast">{content}</div>
      </div>
    );
  }

  render() {
    const {
      children
    } = this.props;

    const contentStyle = {
      minHeight: `${window.innerHeight - 120}px`,
      width: '90%',
      background: '#fff',
      overflow: 'auto'
    };

    // return (
    //   <div className="main">
    //     {this.renderToast()}
    //     <Header />
    //     {children}
    //     <Footer />
    //   </div>
    // );

    return (
      <Layout>
        {this.renderToast()}
        <HeaderModule/>
        <Content style={{ padding: '20px', boxShadow: '0 0 5px #ccc' }}>
          <Layout style={{ background: '#fff' }}>
            <Sider width={200} style={{ background: '#fff', borderRight: 'solid 1px #e9e9e9' }}>
              <SideBar />
            </Sider>
            <Content style={contentStyle}>
              {children}
            </Content>
          </Layout>
        </Content>
        <FooterModule />
      </Layout>
    );

  }
}

function mapStateToProps(state) {
  return {
    toast: state.get('toast'),
  };
}

export default connect(mapStateToProps)(App);
