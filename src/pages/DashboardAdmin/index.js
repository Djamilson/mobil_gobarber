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
import AppointmentAdmin from '~/components/AppointmentAdmin';
import Background from '~/components/Background/default';
import Header from '~/components/Header';
import Message from '~/components/Message';
import Toast from '~/components/MessageToast';
import enumAppointment from '~/enum/appointments';

import {
  Container,
  Content,
  Name,
  ProfileContainer,
  ContentList,
  List,
} from './styles';

export default function DashboardAdmin({ navigation }) {
  const profile = useSelector((state) => state.user.profile);
  const { id } = profile;

  const [appointments, setAppointments] = useState([]);
  const [appointmentsOld, setAppointmentsOld] = useState([]);
  const [loading, setLoading] = useState(false);

  const [messageCanceled, setMessageCanceled] = useState(false);
  const [dataFormat, setDataFormat] = useState();
  const [appointmentSelect, setAppointmentSelect] = useState('');

  const UrlSocketWeb = `https://${host.WEBHOST}`;
  const UrlSocketLocal = `http://${host.WEBHOST}:${host.PORT}`;

  const dateFormatted = useMemo(
    () =>
      formatRelative(new Date(), new Date(), {
        locale: pt,
      }),

    [],
  );

  function dateFormattedd(time) {
    console.log(' Time::: ', time);
    return formatRelative(parseISO(time), new Date(), {
      locale: pt,
    });
  }

  const isFocused = useIsFocused();
  const animatedValue = new Animated.Value(0);

  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [limit] = useState(3);

  const [appointmentInfo, setAppointmentInfo] = useState({});

  const [visible, setVisible] = useState(false);

  function closeToast() {
    setTimeout(() => {
      setVisible(false);
    }, 2000);
  }

  function callToast() {
    setVisible(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start(closeToast());
  }

  async function loadPage(pageNumber = page, shouldRefresh = false) {
    setCount(count + 1);
    try {
      if (loading) return;

      if (!shouldRefresh && page === appointmentInfo.pages) {
        callToast();
        return;
      }

      if (!shouldRefresh) {
        setLoading(true);
      }

      const res = await api.get(`appointments/provider`, {
        params: {
          limit,
          page: `${pageNumber}`,
        },
      });

      console.log('res.data', res.data);

      setLoading(false);
      const { appointments: list, appointmentInfo: infon } = res.data;

      setPage(pageNumber + 1);
      setAppointmentInfo(infon);
      setAppointments(shouldRefresh ? list : [...appointments, ...list]);
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function refreshList() {
    // setAppointments({});
    setRefreshing(true);
    await loadPage(1, true);
    setRefreshing(false);
  }

  async function init() {
    setAppointmentInfo({});
    await loadPage(1, true);
  }

  // para força, pois estava dando error
  useEffect(() => {
    if (isFocused) {
      setAppointments([]);
      setVisible(false);
      init();
    }
  }, [isFocused]);

  function removerAppoint(idAppointment) {
    setAppointments(
      appointments
        .filter((appointment) => {
          if (appointment.id !== idAppointment) {
            return { ...appointment };
          }
          console.log('===>:::', appointment);
          console.log('===>:::', appointment.date);

          setAppointmentSelect(appointment.user.name);

          setDataFormat(dateFormattedd(appointment.data));
          setMessageCanceled(!messageCanceled);
        })
        .map((ap, index) => {
          return { ...ap, index };
        }),
    );
  }

  const io = useMemo(
    () =>
      socket(UrlSocketWeb, {
        query: { id, value: 'dashboard_admin' },
      }),
    [UrlSocketWeb, id],
  );

  useEffect(() => {
    function subscribeToNewFiles() {
      io.on('appointment', (dta) => {
        setAppointments(dta);
      });

      io.on('cancel', (idAppointment) => {
        const { id: id_ } = idAppointment;
        removerAppoint(Number(id_));
      });
    }

    if (isFocused) {
      subscribeToNewFiles();
    }
  }, [io, isFocused, removerAppoint]);

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

  async function handleCancel(idAppointment, idProvider) {
    setAppointmentsOld(appointments);
    removerAppoint(idAppointment);

    await api
      .get(`appointment/${idAppointment}/finally`, {
        params: {
          status: statusAppointment.cancelado,
          idProvider,
        },
      })
      .then(() => {
        Alert.alert('Sucesso', 'Agendamento cancelado com sucesso!');
      })
      .catch(() => {
        setAppointments(appointmentsOld);
        Alert.alert(
          'Atenção',
          'Não foi possível fazer o cancelamento, tente novamente!',
        );
      });
  }

  async function onAtender(idAppointment, index) {
    if (index !== 0) {
      Alert.alert(
        'Atenção!',
        'Não pode atender esse cliente no momento, você deve finalizar o atendimento anterior!',
      );
      return;
    }

    mudaStatus(idAppointment, statusAppointment.atendendo);
    await api
      .get(`appointment/${idAppointment}/provider`, {
        params: {
          status: statusAppointment.atendendo,
        },
      })
      .catch(() => {
        mudaStatus(idAppointment, statusAppointment.aguardando);
        Alert.alert(
          'Atenção !',
          'Não foi possível fazer o atendimento, tente novamente!',
        );
      });
  }

  async function onFinally(idAppointment) {
    const fin = appointments
      .filter((appoint) => {
        if (appoint.id !== idAppointment) {
          return appoint;
        }
      })
      .map((p) => {
        const objCopy = { ...p };

        objCopy.index -= 1;
        return objCopy;
      });
    setAppointments(fin);

    await api
      .get(`appointment/${idAppointment}/finally`, {
        params: {
          status: statusAppointment.finalizado,
        },
      })
      .catch(() => {
        //  setLoading(false);
        mudaStatus(idAppointment, statusAppointment.atendendo);
        Alert.alert(
          'Atenção !',
          'Não foi possível finalizar o atendimento, tente novamente!',
        );
      });
  }

  function handleChamaCancel(idAppointment, idProvider) {
    Alert.alert(
      `Cancelar agendamento`,
      'Tem certeza que deseja cancelar esse agendamento?',
      [
        {
          text: 'Não',
          onPress: () => {},
          style: 'cancel',
        },
        { text: 'Sim', onPress: () => handleCancel(idAppointment, idProvider) },
      ],
      { cancelable: false },
    );
  }

  function closeMessage() {
    setMessageCanceled(!messageCanceled);
  }

  return (
    <Background>
      <Container>
        <Header navigation={navigation} />
        {!loading && appointments.length < 1 ? (
          <Message nameIcon="exclamation-triangle">
            Ooops!! Você não tem agendamentos no momento!!
          </Message>
        ) : (
          <Content>
            <ProfileContainer>
              <Name>Todos agendamentos de {dateFormatted}</Name>
            </ProfileContainer>
            <ContentList>
              <List
                data={appointments}
                keyExtractor={(item) => String(item.id)}
                showsVerticalScrollIndicator={false}
                onRefresh={refreshList}
                refreshing={refreshing}
                onEndReachedThreshold={0.1}
                onEndReached={() => loadPage()}
                renderItem={({ item }) => (
                  <AppointmentAdmin
                    onAtender={() => onAtender(item.id, item.index)}
                    onFinally={() => onFinally(item.id)}
                    onCancel={() =>
                      handleChamaCancel(item.id, item.user.id, item.status)
                    }
                    data={item}
                  />
                )}
              />

              <Toast visible={loading} message="Buscando ..." />

              <Toast
                visible={visible}
                message="Ops! Já não temos mais resgistros para buscar."
              />
            </ContentList>
          </Content>
        )}
      </Container>
    </Background>
  );
}

DashboardAdmin.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};
