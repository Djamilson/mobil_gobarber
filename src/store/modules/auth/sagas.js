import { Alert } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import api from '~/_services/api';

import {
  signInFaileru,
  signUpSuccess,
  updateProfileSuccess,
} from '../user/actions';
import { signFailure, signInSuccess } from './actions';

const saveEmail = async (email) => {
  await AsyncStorage.setItem('@emailgobarber', email);
  await AsyncStorage.setItem('@emailgobarber', 'false');
};

export function* signIn({ payload }) {
  const { email, password, navPageActiveAccount } = payload;

  try {
    const response = yield call(api.post, 'sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    api.defaults.headers.Authorization = ` Bearer ${token}`;

    yield put(signInSuccess(token, user));
  } catch (error) {
    const str = error.toString();
    const final = str.replace(/\D/g, '');

    if (final === '400') {
      Alert.alert(
        'Falha na autenticação',

        'Não foi possível encontra um usuário, crie sua conta!',
      );
      yield put(signFailure());
      return;
    }

    // Make sure the user has been verified
    if (final === '401') {
      Alert.alert(
        'Falha na autenticação',

        'Sua conta ainda não foi validada, acesse seu email para vê o código de ativação!',
      );

      saveEmail(email);
      navPageActiveAccount();

      yield put(signFailure());
      return;
    }

    // Make sure the user has been verified
    if (final === '402') {
      Alert.alert(
        'Falha na autenticação',

        'No momento esse usuário está desativado, entre em contato com o administrador!',
      );
      yield put(signFailure());
      return;
    }
    if (final === '403') {
      Alert.alert('Falha na autenticação', 'Usuário não encontrado!');
      yield put(signFailure());
      return;
    }
    if (final === '404') {
      Alert.alert(
        'Falha na autenticação',

        'Usúario ou senha incorreta, verifique seus dados!',
      );
      yield put(signFailure());
      return;
    }

    if (final === '429') {
      Alert.alert(
        'Falha na autenticação',

        'Não foi possível conectar ao servidor, tente novamente!',
      );
      yield put(signFailure());
      return;
    }

    if (str === 'Error: Network Error') {
      Alert.alert(
        'Falha na autenticação',
        'Não foi possível conectar ao servidor, tente novamente!',
      );

      yield put(signFailure());
      return;
    }

    Alert.alert(
      'Falha na autenticação',
      'Houve um erro no login, verifique seus dados',
    );

    yield put(signFailure());
  }
}

export function* signUp({ payload }) {
  try {
    const { name, email, password, privacy, resetForm } = payload;

    yield call(api.post, 'usersmobil', {
      name,
      email,
      password,
      privacy,
    });

    resetForm(); // navegação esta aqui nessa function

    Alert.alert(
      'Sucesso',
      `Cadastro efetuado, acesse o email ${email} para ter acesso ao código de ativar de sua conta!`,
    );

    saveEmail(email); // save locaStorage

    // AsyncStorage.setItem('@emailgobarber', email);
    // AsyncStorage.setItem('user', email);

    yield put(signUpSuccess());
  } catch (error) {
    const str = error.toString();
    const final = str.replace(/\D/g, '');

    if (final === '400') {
      Alert.alert('Error', 'Campos inválidos!');

      yield put(signInFaileru());
      return;
    }

    if (final === '401') {
      Alert.alert('Falha ao tentar fazer o cadastro', 'Usuário já cadastrado!');

      yield put(signInFaileru());
      return;
    }

    if (final === '402') {
      Alert.alert('Error', 'Não foi possível encontrar o grupo para associar.');

      yield put(signInFaileru());
      return;
    }

    if (final === '403') {
      Alert.alert(
        'Error',
        'Código da empresa está incorreto, tente novamente!',
      );

      yield put(signInFaileru());
      return;
    }

    yield put(signInFaileru());
  }
}

export function* acceptRegulationUp({ payload }) {
  try {
    const { newPrivacy } = payload.newPrivacy;

    const resp = yield call(api.put, 'accept_regulation', {
      newPrivacy,
    });

    yield put(updateProfileSuccess(resp.data.user));
    yield put(signUpSuccess());

    if (newPrivacy === true) {
      Alert.alert('Sucesso', 'Termos aceitos com sucesso!');
      return;
    }

    Alert.alert('Sucesso', 'Os termos não foram aceitos!');
  } catch (error) {
    Alert.alert(
      'Falha ao aceitar os termos',
      'Não foi possível aceitar os termos, tente novamente!',
    );

    yield put(signInFaileru());
  }
}

export function* createImage({ payload }) {
  try {
    const { data } = payload.data;

    const resp = yield call(api.post, 'files/mobile', data);

    yield put(updateProfileSuccess(resp.data.user));

    Alert.alert('Sucesso', 'Imagem inserida com sucesso!');
  } catch (error) {
    Alert.alert(
      'Falha ao tentar inserir a imagem',
      'Houve um erro ao tentar inserir a imagem,  tente novamente',
    );

    yield put(signInFaileru());
  }
}

export function* updateImage({ payload }) {
  try {
    const { data } = payload.data;

    yield put(updateProfileSuccess(data.user));

    Alert.alert('Sucesso', 'Imagem atualizada com sucesso!');
  } catch (error) {
    Alert.alert(
      'Falha ao tentar atualizar a imagem',
      'Não foi possível alterar a imagem, tente novamente!',
    );

    yield put(signInFaileru());
  }
}

export function setToken({ payload }) {
  if (!payload) return;
  const { token } = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = ` Bearer ${token}`;
  }
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
  takeLatest('@auth/ACCEPT_REGULATION', acceptRegulationUp),
  takeLatest('@auth/CREATE_IMAGE', createImage),
  takeLatest('@auth/UPDATE_IMAGE', updateImage),
  takeLatest('@user/SIGN_UP_SUCCESS', signUp),
]);
