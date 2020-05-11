import React, { useMemo, useState } from 'react';
import { Alert } from 'react-native';

import PropTypes from 'prop-types';

import { formatRelative, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import api from '~/_services/api';
import Background from '~/components/Background';
import Header from '~/pages/New/Header';

import { Container, Content, Avatar, Name, Time, SubmitButton } from './styles';

export default function Confirm({ navigation, route }) {
  const { provider, time, data_, router } = route.params;
  const { id, status, agendar, name, avatar } = provider;

  const [loading, setLoading] = useState(false);

  const dateFormatted = useMemo(
    () =>
      formatRelative(parseISO(time), new Date(), {
        locale: pt,
      }),

    [time],
  );

  async function handleAddAppointment() {
    setLoading(true);
    await api
      .post(router, {
        provider_id: id,
        date: data_,
        status,
        agendar,
      })
      .then(() => {
        setLoading(false);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        });
        Alert.alert('Sucesso', 'Agendamento efetuado com sucesso!');
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert(
          'Atenção',
          'Não foi possível finalizar o agendamento, tente novamente!',
        );
      });
  }

  return (
    <Background>
      <Container>
        <Header navigation={navigation} />
        <Content>
          <Avatar
            source={{
              uri: avatar
                ? avatar.url
                : `https://api.adorable.io/avatar/50/${name}.png`,
            }}
          />
          <Name>{name}</Name>
          <Time>{dateFormatted}</Time>
          <SubmitButton loading={loading} onPress={handleAddAppointment}>
            Confirmar Agendamento
          </SubmitButton>
        </Content>
      </Container>
    </Background>
  );
}

Confirm.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    reset: PropTypes.func,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      time: PropTypes.string,
      data_: PropTypes.string,
      router: PropTypes.string,
      provider: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        status: PropTypes.string,
        agendar: PropTypes.string,
        avatar: PropTypes.shape({
          url: PropTypes.string,
        }),
      }),
    }),
  }).isRequired,
};
