import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PropTypes from 'prop-types';

import logo from '~/assets/logo.png';
import Background from '~/components/Background';
import { signUpRequest } from '~/store/modules/auth/actions';

import {
  Container,
  Form,
  Label,
  FormInput,
  LogoImg,
  SubmitButton,
  SignLink,
  SignLinkText,
} from './styles';

export default function CreateAccount({ navigation }) {
  const dispatch = useDispatch();

  const emailRef = useRef();
  const passwordRef = useRef();

  const loading = useSelector((state) => state.user.loading);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [privacy] = useState(false);

  function resetForm() {
    setName('');
    setEmail('');
    setPassword('');
    navigation.navigate('SignUpActive', {
      email,
    });
  }

  function handleSubmit() {
    dispatch(signUpRequest(name, email, password, privacy, () => resetForm()));
  }

  return (
    <Background>
      <Container>
        <LogoImg source={logo} />
        <Form>
          <Label>Nome completo</Label>
          <FormInput
            icon="person-outline"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Nome completo"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current.focus()}
            value={name}
            onChangeText={setName}
          />

          <Label>Email</Label>
          <FormInput
            icon="mail-outline"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Digite seu e-mail"
            ref={emailRef}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current.focus()}
            value={email}
            onChangeText={setEmail}
          />

          <Label>Sua senha</Label>
          <FormInput
            icon="lock-outline"
            secureTextEntry
            placeholder="Sua senha secreta"
            ref={passwordRef}
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            value={password}
            onChangeText={setPassword}
          />
          <SubmitButton loading={loading} onPress={handleSubmit}>
            Criar
          </SubmitButton>
        </Form>
        <SignLink onPress={() => navigation.navigate('SignIn')}>
          <SignLinkText>Já tenho conta</SignLinkText>
        </SignLink>
      </Container>
    </Background>
  );
}

CreateAccount.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
