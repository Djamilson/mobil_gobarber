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
import Message from '~/components/Message';
import Toast from '~/components/MessageToast';
import enumAppointment from '~/enum/appointments';

import {
  Container,
  Content,
  SubLinhaButton,
  ProfileInfo,
  Name,
  ProfileContainer,
  OrderDeliveredLink,
  OrderWithdrawLink,
  SignLinkText,
  ContentList,
  List,
  PendingLinkText,
} from './styles';

export default function Dashboard({ navigation }) {
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

  function dateFormatted(time) {
    return formatRelative(parseISO(time), new Date(), {
      locale: pt,
    });
  }

  const io = useMemo(
    () =>
      socket(UrlSocketWeb, {
        query: { id, value: 'dashboard' },
      }),
    [UrlSocketWeb, id],
  );

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

      const res = await api.get(`appointments`, {
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
      .catch(() => {
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
          console.log('DataFormat:::', dataFormat);

          const listTes = appointments.filter((appointment) => {
            if (appointment.id !== dta.id) {
              return { ...appointment };
            }
            // appSelected = appointment;
            setAppointmentSelect(appointment.provider.name);
            setDataFormat(dateFormatted(appointment.date));
            console.log('==>>: ', appointment);
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

  return (
    <Background>
      <Container>
        <Header navigation={navigation} />
        {!loading && appointments.length < 1 ? (
          <Message nameIcon="exclamation-triangle">
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
                onEndReachedThreshold={0.1}
                onEndReached={() => loadPage()}
                renderItem={({ item }) => (
                  <Appointment
                    onCancel={() => handleChamaCancel(item.id)}
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

Dashboard.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};
