import * as commonService from '../services';

/**
 * header
 */

export default {
  namespace: 'header',
  state: {
    PRODUCT: [], // 产品列表
    SECURITY: [], // 证券列表
  },
  reducers: {
    // 名称为 action 名称，可以 dispatch、put
    save(state, { payload = {} }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    /**
     * 头部搜索证券
     * (action, effects)
     */
    *search({ payload }, { call, put }) {
      const { data = {} } = yield call(commonService.productSearch, {
        body: payload,
      });
      const { PRODUCT = [], SECURITY = [] } = data;
      yield put({ type: 'save', payload: { PRODUCT, SECURITY } });
    },
  },
};
