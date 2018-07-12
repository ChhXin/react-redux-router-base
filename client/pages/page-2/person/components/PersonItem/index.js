import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import classNames from 'classnames/bind';
import style from './style.scss';
const cx = classNames.bind(style);
@connect()
class PersonItem extends Component {
  static propTypes = {
    person: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      person: this.props.person
    };

    this.personDefault = this.props.person;
  }

  // 编辑
  handleEdit = (e) => {
    e.preventDefault();
    this.setState({
      editing: true
    });
  };

  // 取消编辑
  handleCancel = (e) => {
    e.preventDefault();
    this.setState({
      editing: false,
      person: this.personDefault
    });
  };

  // 保存
  handleSave = (e) => {
    e.preventDefault();
    const {person} = this.state;
    this.props.dispatch({
      type: 'person/updatePerson',
      payload: { person },
    })

    this.setState({
      editing: false
    }, () => {
      this.personDefault = person;
    });
  };

  handleDelete = (id) => {
    return (e) => {
      e.preventDefault();

      this.props.dispatch({
        type: 'person/deletePerson',
        payload: { id },
      });
    }
  };

  textOrInput(field, val) {
    const {editing} = this.state;
    if (editing) {
      // 这里使用可控输入框组件
      return (
        <input type="text" value={val} onChange={this.handleChange(field)}/>
      );
    }
    return (
      <span>{val}</span>
    );
  }

  handleChange = (field) => {
    return (event) => {
      const {person} = this.state;
      const val = event.target.value;
      this.setState({
        person: person.set(field, val)
      });
    }
  };

  render() {
    const {editing, person} = this.state;
    const id = person.get('id');
    const firstName = person.get('firstName');
    const lastName = person.get('lastName');

    return (
      <tr>
        <th>{id}</th>
        <td>{this.textOrInput('firstName', firstName)}</td>
        <td>{this.textOrInput('lastName', lastName)}</td>
        <td>{firstName + lastName}</td>
        <td className={cx('link-group')}>
          <a href="" style={{display: !editing ? 'inline' : 'none'}}
             onClick={this.handleEdit}>编辑</a>
          <a href="" style={{display: editing ? 'inline' : 'none'}}
             onClick={this.handleCancel}>取消</a>
          <a href="" style={{display: editing ? 'inline' : 'none'}}
             onClick={this.handleSave}>保存</a>
          <a href="" onClick={this.handleDelete(id)}>删除</a>
        </td>
      </tr>
    );
  }
}


export default PersonItem;
