import {takeLatest, put, all} from 'redux-saga/effects';

import {selectLogoSuccess} from './actions';
// construo as funções que iram acessar o banco de dados
export function* selectCompany({payload}) {
  yield put(selectLogoSuccess(payload.data));
}

export default all([takeLatest('@company/SELECT_LOGO_SUCCESS', selectCompany)]);
