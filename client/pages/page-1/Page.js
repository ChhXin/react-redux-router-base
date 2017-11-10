import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import { Menu, Icon } from 'antd';

class Page extends Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    caches: PropTypes.object,
    module1: PropTypes.object,
    module2: PropTypes.object,
  };
  static childContextTypes = {
    dispatch: PropTypes.func
  };

  state = {
    current: 'module1',
  };

  /**
   * 注意：在子组件中使用 context 的值，不要修改，只能使用或调用
   * Updating Context
   * Don't do Updating Context.
   */
  getChildContext() {
    const {dispatch} = this.props;
    return {dispatch};
  }

  componentDidMount() {
    const {pathname} = location;
    if (pathname.indexOf('/page1/module2') !== -1) {
      this.setMenuKey('module2');
    } else {
      this.setMenuKey('module1');
    }
  }

  setMenuKey = (key) => {
    this.setState({
      current: key,
    });
  };

  handleClick = (e) => {
    console.log('click ', e.key);
    this.setMenuKey(e.key);
  };

  render() {
    const {
      children, location, caches, module1, module2
    } = this.props;

    const {pathname} = location;
    const props = pathname.indexOf('/module1') !== -1
      ? {location, caches, module1}
      : {location, caches, module2};

    return (
      <div className="container mt-1">
        <Menu
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
        >
          <Menu.Item key="module1">
            <Link to="/module1">Module1</Link>
          </Menu.Item>
          <Menu.Item key="module2">
            <Link to="/module2">Module2</Link>
          </Menu.Item>
        </Menu>

        {children && React.cloneElement(children, props)}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    caches: state.get('caches'),
    module1: state.get('module1'),
    module2: state.get('module2'),
  };
}

export default connect(mapStateToProps)(Page);
