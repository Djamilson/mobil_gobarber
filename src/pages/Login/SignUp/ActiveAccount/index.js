import React, { useRef, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import PropTypes from 'prop-types';

import AsyncStorage from '@react-native-community/async-storage';

import api from '~/_services/api';
import logo from '~/assets/logo.png';
import Background from '~/components/Background';
import Loading from '~/components/Loading';
import Message from '~/pages/Login/SignUp/ActiveAccount/Message';

import {
  Container,
  Form,
  LogoImg,
  Label,
  FormInput,
  SignLink,
  SignLinkText,
  Name,
  SubmitButton,
} from './styles';

export default function ActiveAccount({ navigation, route }) {
  const { email } = route.params;

  const code_active_Ref = useRef();
  const [code_active, setCode_active] = useState('');

  const [loading, setLoading] = useState(false);

  function handlerSignIn() {
    navigation.navigate('SignIn');
  }

  useEffect(() => {
    async function loadToken() {
      setLoading(true);
      await api
        .get(`mobile/active_account/${email}`)
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);

          const str = error.toString();
          const final = str.replace(/\D/g, '');

          if (final === '401') {
            navigation.navigate('SignIn');
            Alert.alert(
              'Atenção!',
              'Esse email já esta ativo, acesse sua conta!',
            );
          }
        });
    }
    loadToken();
  }, [email, navigation]);

  const deleteEmailStorage = async () => {
    await AsyncStorage.removeItem('@emailgobarber');
  };

  const saveStorage = async () => {
    await AsyncStorage.setItem('@gobarberAtivo', 'true');
  };

  async function newCodeActive() {
    setLoading(true);
    await api
      .put(`proccess_active_account/new_code_active`, {
        data: {
          email,
        },
      })
      .then(() => {
        setLoading(false);

        Alert.alert(
          'Sucesso',
          `Novo código criando com sucesso, acesse seu email para vê o código de ativação!`,
        );
      })
      .catch((error) => {
        setLoading(false);
        const str = error.toString();
        const final = str.replace(/\D/g, '');

        if (final === '401' || final === '403') {
          Alert.alert('Error', 'Gerar um novo código, tente novamente!');
        }
      });
  }

  async function handleActiveAccount() {
    setLoading(true);
    await api
      .put(`proccess_active_account`, {
        data: {
          email,
          code_active,
        },
      })
      .then(() => {
        setLoading(false);
        handlerSignIn();
        Alert.alert('Sucesso', `Conta ativada com sucesso!`);
        deleteEmailStorage();
        saveStorage();
      })
      .catch((error) => {
        setLoading(false);
        setCode_active('');
        const str = error.toString();
        const final = str.replace(/\D/g, '');

        if (final === '400') {
          Alert.alert(
            'Error',
            'Código de ativação incorreto, crie um novo código ou tente novamente!',
          );
        }

        if (final === '402') {
          Alert.alert(
            'Error',
            'Código de ativação incorreto, tente novamente!',
          );
        }

        if (final === '401' || final === '403') {
          Alert.alert(
            'Error',
            'Não foi possível encontra um usuário, crie sua conta!',
          );
        }
      });
  }

  return (
    <Background>
      <Container>
        {loading && <Loading loading={loading}>Carregando ...</Loading>}
        <Message nameIcon="exclamation-triangle" email={email} />

        <LogoImg source={logo} />
        <Name>Ativando sua conta</Name>
        <Form>
        <Label>Seu código de ativação</Label>
          <FormInput
            icon="lock-outline"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Código de ativação"
            ref={code_active_Ref}
            returnKeyType="send"
            onSubmitEditing={handleActiveAccount}
            value={code_active}
            onChangeText={setCode_active}
          />

          <SubmitButton loading={false} onPress={handleActiveAccount}>
            Ativar Conta
          </SubmitButton>
        </Form>
        <SignLink onPress={newCodeActive}>
          <SignLinkText>Novo código de ativação</SignLinkText>
        </SignLink>

        <SignLink onPress={handlerSignIn}>
          <SignLinkText>Já tenho conta ativa</SignLinkText>
        </SignLink>
      </Container>
    </Background>
  );
}

ActiveAccount.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      email: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
