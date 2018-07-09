import { callApiWithHeader } from '../utils/fetch';

// productSearch
export function productSearch({ body = {} }) {
  return callApiWithHeader({
    url: 'common/productSearch',
    body,
  });
}
