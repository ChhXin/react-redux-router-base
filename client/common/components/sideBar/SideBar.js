import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './sidebar.scss';
import {Menu, Icon} from 'antd';
import {connect} from 'react-redux';
import {browserHistory, hashHistory} from 'react-router';
import {urlContext} from '../../../utils/config';

class SideBar extends Component {
  state = {
    current: 'home',
  };

  componentDidMount() {
    const {pathname} = location;
    if (pathname.indexOf(`${urlContext}/page1`) !== -1) {
      this.setMenuKey('page1');
    } else if (pathname.indexOf(`${urlContext}/page2`) !== -1) {
      this.setMenuKey('page2');
    } else if (pathname.indexOf(`${urlContext}/about`) !== -1) {
      this.setMenuKey('about');
    } else {
      this.setMenuKey('home');
    }
  }

  setMenuKey = (key) => {
    this.setState({
      current: key,
    });
  };

  handleClick = (e) => {
    console.log('click ', e.key);
  };

  render() {

    return (
      <Menu
        onClick={this.handleClick}
        defaultSelectedKeys={['home']}
        selectedKeys={[this.state.current]}
        mode="inline"
      >
        <Menu.Item key="home" style={{fontSize: '14px'}}>
          <a href={`${urlContext}/home`}><Icon type="home" />Home</a>
        </Menu.Item>
        <Menu.Item key="page1" style={{fontSize: '14px'}}>
          <a href={`${urlContext}/page1/module1`}><Icon type="layout" />Page1</a>
        </Menu.Item>
        <Menu.Item key="page2" style={{fontSize: '14px'}}>
          <a href={`${urlContext}/page2/person`}><Icon type="flag" />Page2</a>
        </Menu.Item>
        <Menu.Item key="about" style={{fontSize: '14px'}}>
          <a href={`${urlContext}/about`}><Icon type="contacts" />About</a>
        </Menu.Item>
      </Menu>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    // caches: state.get('caches'),
  };
}

export default connect(mapStateToProps)(SideBar);
