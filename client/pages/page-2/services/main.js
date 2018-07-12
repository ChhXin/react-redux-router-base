import { callApiWithHeader } from '../../../utils/fetch';

export function person({ body = {} }) {
  const {pageNum, pageSize} = body;
  return callApiWithHeader({
    url: `page-2/person?pageNum=${pageNum}&&pageSize=${pageSize}`,
    options: {
      method: 'get',
    },
  });
}

export function film({ body = {} }) {
  const {type} = body;
  return callApiWithHeader({
    url: `page-2/film/${type}`,
  });
}
