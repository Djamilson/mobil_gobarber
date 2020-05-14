import React, { useEffect, useState, useMemo } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';

import PropTypes from 'prop-types';

import { formatRelative, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import socket from 'socket.io-client';

import host from '~/_config/host';
import api from '~/_services/api';
import AppointmentFila from '~/components/AppointmentFila';
import Background from '~/components/Background';
import Loading from '~/components/Loading';
import Message from '~/components/Message';
import MessageCanceled from '~/components/MessageCancel';
import enumAppointment from '~/enum/appointments';
import Header from '~/pages/New/Header';

import { Container, List } from './styles';

export default function FilaUser({ navigation, route }) {
  const { provider } = route.params;
  const profile = useSelector((state) => state.user.profile);
  const { id } = profile;
  const [page, setPage] = useState(1);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [messageCanceled, setMessageCanceled] = useState(false);
  const [dataFormat, setDataFormat] = useState();
  const [appointmentSelect, setAppointmentSelect] = useState('');

  const UrlSocketWeb = `https://${host.WEBHOST}/gobarber`;
  const UrlSocketLocal = `http://${host.WEBHOST}:${host.PORT}`;

  const io = useMemo(
    () =>
      socket(UrlSocketLocal, {
        query: { id, value: 'fila' },
      }),
    [UrlSocketLocal, id],
  );

  function dateFormatted(time) {
    return formatRelative(parseISO(time), new Date(), {
      locale: pt,
    });
  }

  function closeMessage() {
    setMessageCanceled(!messageCanceled);
  }

  function setSelecioneProvaider(item) {
    setAppointmentSelect(item.provider.name);
    setDataFormat(dateFormatted(item.data));
  }

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
        const { listAppointments, appointmentSelect: appoint, user_id } = dta;

        if (dta.status === enumAppointment.cancelado && user_id === id) {
          setAppointmentSelect(appoint.provider.name);
          setMessageCanceled(true);
          setDataFormat(dateFormatted(appoint.date));
        }
        setAppointments(listAppointments);
      });

      io.on('cancel', (novaLista) => {
        setAppointments(novaLista);
      });
    }

    subscribeToNewFiles();
  }, [
    appointmentSelect,
    appointments,
    appointments.length,
    id,
    io,
    messageCanceled,
  ]);

  useEffect(() => {
    async function loadAppointments(pageNumber = page) {
      try {
        if (loading) return;
        setLoading(true);

        const res = await api.get(`appointments/${provider.id}/fila`, {
          params: {
            page: `${pageNumber}`,
          },
        });
        setLoading(false);
        console.log('==>> EStou aqui no admin', res.data);
        setAppointments(res.data);
      } catch (err) {
        setLoading(false);
      }
    }
    loadAppointments();
  }, [provider]);

  function mudaStatus(appointment_id, status) {
    const novoStatus = appointments.map((appointment) =>
      appointment.id === appointment_id
        ? {
            ...appointment,
            status,
          }
        : appointment,
    );

    setAppointments(novoStatus);
  }

  async function handleCancel(idAppointmente, oldStatus) {
    // setLoading(true);
    Alert.alert('Sucesso', 'Agendamento cancelado com sucesso!');

    mudaStatus(idAppointmente, enumAppointment.cancelado);

    await api.delete(`appointments/${idAppointmente}`).catch(() => {
      mudaStatus(idAppointmente, oldStatus);
      Alert.alert(
        'Atenção',
        'Não foi possível fazer o cancelamento no momento, tente novamente!',
      );
    });
  }

  function handleChamaCancel(idAppointmente, item) {
    Alert.alert(
      `Cancelar agendamento`,
      'Tem certeza que cancelar esse agendamento?',
      [
        {
          text: 'Não',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: () => {
            setSelecioneProvaider(item);
            handleCancel(idAppointmente, item.status);
          },
        },
      ],
      { cancelable: false },
    );
  }

  return (
    <Background>
      <Container>
        <Header navigation={navigation} />
        {loading && <Loading loading={loading}>Carregando ...</Loading>}
        {!loading && appointments.length < 1 ? (
          <Message nameIcon="exclamation-triangle">
            Não tem usuário na fila no momento!
          </Message>
        ) : (
          <List
            data={appointments}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <AppointmentFila
                onCancel={() => handleChamaCancel(item.id, item)}
                data={item}
              />
            )}
          />
        )}

        {messageCanceled && dataFormat !== undefined && (
          <MessageCanceled
            nameIcon="exclamation-triangle"
            closeMessage={closeMessage}
            dataFormat={dataFormat}
            appointmentSelect={appointmentSelect}
          />
        )}
      </Container>
    </Background>
  );
}

FilaUser.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      provider: PropTypes.shape({
        id: PropTypes.string,
      }),
    }),
  }).isRequired,
};
