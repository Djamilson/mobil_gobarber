import React, { useEffect, useMemo, useState } from 'react';
import { Animated, Alert } from 'react-native';
import { useSelector } from 'react-redux';

import PropTypes from 'prop-types';

import { useIsFocused } from '@react-navigation/native';
import { formatRelative, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import socket from 'socket.io-client';

import host from '~/_config/host';
import api from '~/_services/api';
import Appointment from '~/components/Appointment';
import Background from '~/components/Background/default';
import Header from '~/components/Header';
import enumAppointment from '~/enum/appointments';
import Message from '~/pages/Dashboard/Message';

import {
  Container,
  Content,
  Name,
  ProfileContainer,
  ContentList,
  List,
} from './styles';

export default function Dashboard({ navigation }) {
  const isFocused = useIsFocused();
  const profile = useSelector((state) => state.user.profile);
  const [appointments, setAppointments] = useState([]);
  const [appointmentsOld, setAppointmentsOld] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageCanceled, setMessageCanceled] = useState(false);
  const [dataFormat, setDataFormat] = useState();
  const [appointmentSelect, setAppointmentSelect] = useState('');

  const [refreshing, setRefreshing] = useState(false);
  const [page] = useState(1);

  const UrlSocketWeb = `https://${host.WEBHOST}`;
  const UrlSocketLocal = `http://${host.WEBHOST}:${host.PORT}`;

  function dateFormatted(time) {
    return formatRelative(parseISO(time), new Date(), {
      locale: pt,
    });
  }

  async function loadAppointments(pageNumber = page) {
    try {
      if (loading) return;
      setLoading(true);

      const res = await api.get(`appointments`, {
        params: {
          page: `${pageNumber}`,
        },
      });
      setLoading(false);
      setAppointments(res.data);
    } catch (err) {
      setLoading(false);
    }
  }

  const { id } = profile;

  const io = useMemo(
    () =>
      socket(UrlSocketWeb, {
        query: { id, value: 'dashboard' },
      }),
    [UrlSocketWeb, id],
  );

  useEffect(() => {
    function subscribeToNewFiles() {
      io.on('atender', (dta) => {
        const listTes = appointments.map((appointment) => {
          if (appointment.id === dta.id) {
            const newap = {
              ...appointment,
              status: enumAppointment.atendendo,
            };

            return newap;
          }
          return appointment;
        });

        setAppointments(listTes);
      });

      io.on('finally', (dta) => {
        if (
          dta.id !== null &&
          dta.id !== undefined &&
          appointments !== undefined &&
          appointments.length > 0
        ) {
          const listTes = appointments.filter((appointment) => {
            if (appointment.id !== dta.id) {
              return { ...appointment };
            }
            // appSelected = appointment;
            setAppointmentSelect(appointment.provider.name);
            setDataFormat(dateFormatted(appointment.date));

            return '';
          });

          setAppointments(listTes);

          if (dta.status === enumAppointment.cancelado) {
            setMessageCanceled(!messageCanceled);
            // setAppointmentSelect(appSelected.provider.name);
            // setDataFormat(dateFormatted(appSelected.date));
          }
        }
      });
    }

    if (isFocused) {
      subscribeToNewFiles();
    }
  }, [
    appointmentSelect,
    appointments,
    appointments.length,
    dataFormat,
    io,
    isFocused,
    messageCanceled,
  ]);

  useEffect(() => {
    if (isFocused) {
      loadAppointments();
    }
  }, [isFocused]);

  async function handleCancel(idAppointment) {
    setAppointmentsOld(appointments);
    setAppointments(
      appointments
        .filter((appointment) => appointment.id !== idAppointment)
        .map((ap, index) => {
          return { ...ap, index };
        }),
    );
    await api
      .delete(`appointments/${idAppointment}`)
      .then(() => {
        Alert.alert('Sucesso', 'Agendamento cancelado com sucesso!');
      })
      .catch((error) => {
        setAppointments(appointmentsOld);
        Alert.alert(
          'Atenção',
          'Não foi possível fazer o cancelamento, tente novamente!',
        );
      });
  }

  function handleChamaCancel(idAppointment) {
    Alert.alert(
      `Cancelar agendamento`,
      'Tem certeza que deseja cancelar esse agendamento?',
      [
        {
          text: 'Não',
          onPress: () => {},
          style: 'cancel',
        },
        { text: 'Sim', onPress: () => handleCancel(idAppointment) },
      ],
      { cancelable: false },
    );
  }

  async function refreshList() {
    setRefreshing(true);
    await loadAppointments(1, true);
    setRefreshing(false);
  }

  return (
    <Background>
      <Container>
        <Header navigation={navigation} />
        {!loading && appointments.length < 1 ? (
          <Message nameIcon="exclamation-triangle" refreshList={refreshList}>
            Ooops!! Você não tem horário agendado no momento!!
          </Message>
        ) : (
          <Content>
            <ProfileContainer>
              <Name>Meus agendamentos</Name>
            </ProfileContainer>
            <ContentList>
              <List
                data={appointments}
                keyExtractor={(item) => String(item.id)}
                showsVerticalScrollIndicator={false}
                onRefresh={refreshList}
                refreshing={refreshing}
                onEndReached={() => loadAppointments()}
                renderItem={({ item }) => (
                  <Appointment
                    onCancel={() => handleChamaCancel(item.id)}
                    data={item}
                  />
                )}
              />
            </ContentList>
          </Content>
        )}
      </Container>
    </Background>
  );
}

Dashboard.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};
