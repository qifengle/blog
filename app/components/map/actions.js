import WOW from 'wowjs';

import { fetchInfo } from '../common/actions';
import { FETCH_START, FETCH_SUCCEED, FETCH_FAIL } from './actionTypes';

export const getMap = () => {
  const url = `/get-map-data`;
  return fetchInfo(url, [FETCH_START, FETCH_SUCCEED, FETCH_FAIL], () => { new WOW.init(); });
};
