import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { connect } from 'dva';

import style from './style.scss';

const cx = classNames.bind(style);
// 采用装饰器处理
@connect()
export default class PersonForm extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    dispatch: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      firstName: '',
      lastName: '',
    };
  }

  savePerson = () => {
    const {firstName, lastName} = this.state;

    this.props.dispatch({
      type: 'person/addPerson',
      payload: { firstName, lastName },
    });

    this.goBack();
  };

  goBack = () => {
    const {router} = this.context;
    router.history.goBack();
  };

  handleChange = (field) => {
    return (event) => {
      const val = event.target.value;
      this.setState({
        [field]: val,
      });
    };
  };

  render() {
    const {firstName, lastName} = this.state;
    return (
      <div className="form-panel">
        <div className="form-field">
          <label htmlFor="firstName">First Name</label>
          <div className="input input-primary" id="firstName">
            <input type="text" className="input-field" placeholder="First Name"
                   value={firstName} onChange={this.handleChange('firstName')}/>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="lastName">Last Name</label>
          <div className="input input-primary" id="lastName">
            <input type="text" className="input-field" placeholder="Last Name"
                   value={lastName} onChange={this.handleChange('lastName')}/>
          </div>
        </div>

        <div className="btn-group m-t-2">
          <button className="btn btn-raised btn-primary" onClick={this.savePerson}>Save</button>
          <button className="btn btn-raised btn-secondary" onClick={this.goBack}>Go Back</button>
        </div>
      </div>
    );
  }
}
