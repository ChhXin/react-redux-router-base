import { fromJS } from 'immutable';
import * as mainService from '../services/main';
// import { SUCCESS_CODE } from '../../../../common/constants';

// 初始化数据
const initialState = {
  pageNum: 1,
  pageSize: 20,
  items: [], // 分页数据
  totalPages: 0,
};

export default {
  namespace: 'person',
  state: fromJS(initialState),
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        console.log(location);
      });
    },
  },
  reducers: {
    // 历史 items 会被新的 items 覆盖
    save(
      state,
      {
        payload: { data },
      }
    ) {

      return state.merge(fromJS(data))// { ...state, ...data };
    },
    // 追加 items
    append(
      state,
      {
        payload: { data },
      }
    ) {
      const {pageNum, items} = data;
      return state.update('items', _oldItems => _oldItems.concat(fromJS(items))).setIn(['pageNum'], pageNum)
    },
    // 清空/初始化数据
    clearPersonList(state) {

      return state.setIn(['items'], []).setIn(['pageNum'], 1);
      // { ...state, pageNum: 1,  items: [] };
    },

    // 修改
    updatePerson(
      state,
      {
        payload: { pageSize },
      }
    ) {
      return { ...state, pageSize };
    },

    // 删除
    deletePerson(
      state,
      {
        payload: { id },
      }
    ) {
      return state.update('items', _oldItems => _oldItems.filter(item => item.get('id') !== id))
    },

    // 添加一列
    addPerson(
      state,
      {
        payload: { person },
      }
    ) {
      return state.update('items', (items) => items.unshift(fromJS(person)));
    },
  },
  effects: {
    // (action, effects)
    // 拉取分页数据
    *getPersonList({ payload = {} }, { call, put, select }) {
      const person = yield select(state => state.person);
      const pageNum = person.get('pageNum');
      const { data } = yield call(mainService.person, {
        body: { pageNum, pageSize: person.get('pageSize')},
      });

      if (pageNum === 1) {
        yield put({
          type: 'save',
          payload: { data: { ...data, pageNum: pageNum + 1 } },
        });
      } else {
        yield put({
          type: 'append',
          payload: { data: { ...data, pageNum: pageNum + 1 } },
        });
      }
    },
  },
};
