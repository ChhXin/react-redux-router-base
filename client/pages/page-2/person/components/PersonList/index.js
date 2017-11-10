import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import classNames from 'classnames/bind';
import {Button, Table, Icon, Input, Popconfirm} from 'antd';
import PersonItem from '../PersonItem';
import {getPersonList, deletePerson} from '../../action';
import callApi from '../../../../../utils/fetch';

import style from './style.scss';
const cx = classNames.bind(style);

const EditableCell = ({ editable, value, onChange, record, disable }) => (
  <div>
    {
      editable ?
        <Input style={{ margin: '-5px 0' }} disabled={disable} value={value} onChange={e => onChange(e.target.value)} /> : value
    }
  </div>
);
EditableCell.propTypes = {
  disable: PropTypes.bool,
  editable: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  record: PropTypes.object,
};

class PersonList extends Component {
  static propTypes = {
    person: PropTypes.object,
  };
  static contextTypes = {
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      editing: false,
      loading: false,
      person: this.props.person
    };
    this.cacheData = {};
    this.personDefault = this.props.person;
    this.columns = [{
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => this.renderColumns(text, record, 'id', false),
    }, {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (text, record) => this.renderColumns(text, record, 'firstName', true),
    }, {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      render: (text, record) => this.renderColumns(text, record, 'lastName', true),
    }, {
      title: 'Username',
      dataIndex: 'userName',
      key: 'userName',
      render: (text, record) => this.renderColumns(`${record.firstName}${record.lastName}`, record, 'userName', false),
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => {
        const { editable } = record;
        return (
          <div>
            {
              editable ?
                <span>
                  <a onClick={() => this.save(record.id)}>Save</a>
                  <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.id)}>
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
                : <a href="#" onClick={() => this.edit(record.id)}>编辑</a>
            }
            <span className="ant-divider" />
            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.id)}>
              <a href="#">删除</a>
            </Popconfirm>
          </div>
        )
      },
    }];
  }

  componentDidMount() {
    const {person} = this.props;
    const {dispatch} = this.context;
    // const me = this;
    // 如果第一次需加载列表
    const paging = person.get('paging');
    if (!paging) {
      dispatch(getPersonList(true, (data) => {
        // console.log(data);
        this.saveData(data.items);
      }));
    }
  }

  saveData(data) {
    console.log('data', data);
    this.setState({
      data
    });
  }
  renderColumns(text, record, column, inputEditable) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        disable={!inputEditable}
        record={record}
        onChange={value => this.handleChange(value, record.id, column)}
      />
    );
  }

  handleChange(value, key, column) {
    const {dispatch} = this.context;
    const paging = this.props.person.get('paging').toJS();
    const newPaging = {...paging};
    const target = newPaging.items.filter(item => key === item.id)[0];
    if (target) {
      target[column] = value;
      dispatch({type: 'person-list-success', data: newPaging, clear: true});
    }
  }

  edit(key) {
    const {dispatch} = this.context;
    const paging = this.props.person.get('paging').toJS();
    const newPaging = {...paging};
    const target = newPaging.items.filter(item => key === item.id)[0];
    if (target) { // 设置编辑态，更新store
      target.editable = true;
      dispatch({type: 'person-list-success', data: newPaging, clear: true});
      this.cacheData = newPaging.items.map(item => ({ ...item }));
    }
  }

  save(key) {
    const {dispatch} = this.context;
    const paging = this.props.person.get('paging').toJS();
    const newPaging = {...paging};
    const target = newPaging.items.filter(item => key === item.id)[0];
    if (target) {
      delete target.editable;
      dispatch({type: 'person-list-success', data: newPaging, clear: true});
      this.cacheData = newPaging.items.map(item => ({ ...item }));
    }
  }
  cancel(key) {
    const {dispatch} = this.context;
    const paging = this.props.person.get('paging').toJS();
    const newPaging = {...paging};
    const target = newPaging.items.filter(item => key === item.id)[0];
    if (target) {
      Object.assign(target, this.cacheData.filter(item => key === item.id)[0]);
      delete target.editable;
      dispatch({type: 'person-list-success', data: newPaging, clear: true});
    }
  }

  onDelete = (key) => {
    const {dispatch} = this.context;
    const url = 'page-2/person';
    console.log(key);
    return callApi({
      url,
      body: {
        id: key
      },
      method: 'delete'
    }).then((json) => {
      dispatch(deletePerson(key));
      }, (error) => {}
    );
  };

  handleTableChange = () => {
    this.refresh();
  };

  //加载更多
  loadMore = () => {
    const {person} = this.props;
    const {dispatch} = this.context;
    const isFetching = person.get('isFetching');
    const paging = person.get('paging');
    const lastPage = paging.get('lastPage');
    if (!isFetching && !lastPage) {
      dispatch(getPersonList(false, (data) => {
        this.saveData(data.items);
      }));
    }
  };

  refresh = (e) => {
    const {dispatch} = this.context;
    dispatch(getPersonList(true, (data) => {
      this.saveData(data.items);
    }));
  };

  renderList() {
    const {person} = this.props;
    const isFetching = person.get('isFetching');
    const paging = person.get('paging');

    if (!paging) {
      return (
        <div className={cx('page-loading')}>载入中，请稍后 ...</div>
      );
    }

    const lastPage = paging.get('lastPage');
    const items = paging.get('items');

    if (items.size === 0) {
      return (
        <div className={cx('no-items')}>
          <div className={cx('no-items-icon')}></div>
          <p>暂无记录</p>
        </div>
      );
    }

    return (
      <div>
        <table className={cx('table')}>
          <thead className={cx('thead-inverse')}>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
              <th/>
            </tr>
          </thead>
          <tbody>
            {
              items ? items.map((item) => {
                return (
                  <PersonItem key={item.get('id')} person={item}/>
                );
              }) : null
            }
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    const {person} = this.props;
    // const {data} = this.state;
    const paging = person.get('paging');
    const lastPage = paging && paging.get('lastPage');
    const dataSource = !paging ? [] : paging.get('items').toJS();

    return (
      <div>
        <div style={{marginTop: '20px'}}>
          <Button type="primary"><Link to="/person/create">Add Person</Link></Button>
        </div>
        {/*{this.renderList()}*/}
        <div style={{margin: '20px 0'}}>
          <Table columns={this.columns}
                 rowKey={(record) => record.id}
                 dataSource={dataSource}
                 pagination={false}
                 onChange={this.handleTableChange}
          />
        </div>
        <div className={cx('btn-group')} style={{marginBottom: '20px'}}>
          <Button type="primary" disabled={lastPage} onClick={this.loadMore}>Load More</Button>
          <Button type="primary" onClick={this.refresh}>Refresh</Button>
        </div>
      </div>
    );
  }
}

export default PersonList;
