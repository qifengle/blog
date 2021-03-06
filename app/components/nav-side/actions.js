import { fetchInfo } from '../common/actions';
import { FETCH_START, FETCH_SUCCEED, FETCH_FAIL } from './actionTypes';

export const getNavInfo = () => {
  const url = '/get-navside-info';
  return fetchInfo(url, [FETCH_START, FETCH_SUCCEED, FETCH_FAIL]);
};
