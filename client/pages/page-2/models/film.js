import { fromJS } from 'immutable';
import * as mainService from '../services/main';
// import { SUCCESS_CODE } from '../../../../common/constants';

// 初始化数据
const initialState = {
  all: [],
  popularity: [],
};

export default {
  namespace: 'film',
  state: fromJS(initialState),
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        console.log(location);
      });
    },
  },
  reducers: {

    save(
      state,
      {
        payload: { data, type },
      }
    ) {
      return state.set(type, fromJS(data))

    },
  },
  effects: {
    // (action, effects)
    // 拉取数据
    *getFilmList({ payload = {} }, { call, put, select }) {

      const { type } = payload;
      const { data } = yield call(mainService.film, {
        body: { type },
      });
      yield put({
        type: 'save',
        payload: { data, type },
      });
    },
  },
};
