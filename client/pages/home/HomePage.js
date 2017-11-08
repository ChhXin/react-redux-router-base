import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classNames from 'classnames/bind';
import {Button, Tag, message} from 'antd';
import {hello, clearHello} from './action';
import {setToast} from '../../common/action/toast';
import style from './home.scss';
const cx = classNames.bind(style);
const ButtonGroup = Button.Group;

export class Home extends Component {
  static propTypes = {
    home: PropTypes.object,
    dispatch: PropTypes.func
  };

  helloHandle = (clear) => {
    return (e) => {
      e.stopPropagation();
      const {dispatch} = this.props;
      if (clear) {
        dispatch(clearHello());
      } else {
        dispatch(hello('开启 React Router Redux Immutable 之旅吧！'));
      }
    };
  };

  toastHandle = (e) => {
    e.stopPropagation();
    this.props.dispatch(setToast({
      content: '你好，这是一个 Toast，来体验 React 的美妙之处吧。希望能给你带去快乐！'
    }));
  };

  messageHandle = (type) => {
    return (e) => {
      e.stopPropagation();

      switch (type) {
        case 'success':
          message.success('This is a message of success');
          break;
        case 'error':
          message.error('This is a message of error');
          break;
        case 'warning':
          message.warning('This is message of warning');
          break;
        default:
          message.info('This is a normal message');
      }
    };
  };

  render() {
    const {home} = this.props;
    return (
      <div className={style.home}>
        <h1 className="mt-3 mb-1">React Redux Router 脚手架</h1>
        <p>
          <Tag color="pink">React</Tag>
          <Tag color="orange">Redux</Tag>
          <Tag color="red">Router</Tag>
          <Tag color="cyan">Immutable</Tag>
          <Tag color="purple">Webpack</Tag>
          <Tag color="blue">Less</Tag>
          etc.
        </p>
        <hr className="mt-2 mb-2" style={{opacity: '0.4'}}/>
        <div>
          <h3 className="mb-1">{home.get('content')}</h3>
          <div>
            <ButtonGroup className="mr-1">
              <Button icon="smile-o" onClick={this.helloHandle()}>欢迎您来到这里</Button>
              <Button icon="frown-o" onClick={this.helloHandle(true)}>悄悄的离开</Button>
            </ButtonGroup>
            <Button className="mr-1" type="primary" onClick={this.toastHandle}>Toast</Button>
            <br />
            <br />
            <ButtonGroup>antd message:
              <Button onClick={this.messageHandle()}>Info</Button>
              <Button onClick={this.messageHandle('success')}>Success</Button>
              <Button onClick={this.messageHandle('error')}>Error</Button>
              <Button onClick={this.messageHandle('warning')}>Warning</Button>
            </ButtonGroup>

          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    home: state.get('home')
  };
}


export default connect(mapStateToProps)(Home);
