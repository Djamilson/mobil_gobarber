import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { formatRelative, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Avatar from '~/components/Avatar';
import Background from '~/components/Background/default';
import { signOut } from '~/store/modules/auth/actions';

import {
  Container,
  ContainerAvatar,
  Content,
  Label,
  InfoText,
  SubmitButton,
} from './styles';

export default function Logout() {
  const user = useSelector((state) => state.user.profile);

  const dateFormatted = useMemo(
    () =>
      formatRelative(parseISO(user.created_at), new Date(), {
        locale: pt,
      }),

    [user.created_at],
  );

  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(signOut());
  }

  return (
    <Background>
      <Container>
        <ContainerAvatar>
          <Avatar data={user} number={2.5} />
        </ContainerAvatar>
        <Content>
          <Label>Nome completo</Label>
          <InfoText>{user.name}</InfoText>
          <Label>Email</Label>
          <InfoText>{user.email}</InfoText>
          <Label>Data de cadastro</Label>
          <InfoText>{dateFormatted}</InfoText>
        </Content>
        <SubmitButton loading={false} onPress={() => handleLogout()}>
          Logout
        </SubmitButton>
      </Container>
    </Background>
  );
}
