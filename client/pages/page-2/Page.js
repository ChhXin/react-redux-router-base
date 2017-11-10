import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import { Menu, Icon } from 'antd';

class Page extends Component {
  static propTypes = {
    children: PropTypes.node,
    dispatch: PropTypes.func,
    caches: PropTypes.object,
    person: PropTypes.object,
    film: PropTypes.object,
    location: PropTypes.object,
  };

  static childContextTypes = {
    dispatch: PropTypes.func
  };

  state = {
    current: 'person',
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
    if (pathname.indexOf('/page2/film') !== -1) {
      this.setMenuKey('film');
    } else {
      this.setMenuKey('person');
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
      children, caches, person, film, location
    } = this.props;

    const {pathname} = location;
    const type = pathname.indexOf('/person') !== -1 ? 'person' : 'film';
    const props = type === 'person'
      ? {person}
      : {caches, film};

    return (
      <div className="container mt-1">
        <Menu
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
        >
          <Menu.Item key="person">
            <Link to="/person">Person</Link>
          </Menu.Item>
          <Menu.Item key="film">
            <Link to="/film">Film</Link>
          </Menu.Item>
        </Menu>

        {children && React.cloneElement(children, props)}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const person = state.get('person');
  const film = state.get('film');
  const caches = state.get('caches');
  return {
    person,
    film,
    caches
  };
}

export default connect(mapStateToProps)(Page);


