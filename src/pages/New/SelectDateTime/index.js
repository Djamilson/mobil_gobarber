import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import { parseISO, addHours, format } from 'date-fns';

import api from '~/_services/api';
import Background from '~/components/Background';
import DateInput from '~/components/DateInput';
import Loading from '~/components/Loading';
import Message from '~/components/Message';
import Header from '~/pages/New/Header';

import { Container, HourList, Hour, Title } from './styles';

export default function SelectDateTime({ navigation, route }) {
  const [date, setDate] = useState(new Date());
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(false);

  const { router, provider } = route.params;

  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);

  function showDateTimePicker() {
    setIsDateTimePickerVisible(true);
  }

  function hideDateTimePicker() {
    setIsDateTimePickerVisible(false);
  }

  useEffect(() => {
    async function loadAvailable() {
      setLoading(true);
      await api
        .get(`providers/${provider.id}/available`, {
          params: {
            date: date.getTime(),
          },
        })
        .then((res) => {
          setLoading(false);
          setHours(res.data);
          console.log('=>>>>', res.data);
        })
        .catch((error) => {
          console.log('=>>>> error', error);
          setLoading(false);
        });
    }
    loadAvailable();
  }, [date, provider.id]);

  function handleSelectHour(inTime) {
    const data_ = new Date(inTime);
    const data2 = new Date(data_.valueOf());
    // data que vai ser mostrada no frontend
    const time = data2.toISOString().replace(/\.\d{3}Z$/, '');

    // data para ser inserida no banco
    const dateIn = format(data_, "yyyy-MM-dd'T'HH:mm:ssxxx");
    const parsedDate = parseISO(dateIn);

    const offsett = new Date().getTimezoneOffset();
    const timeZoneLocal = offsett / 60;
    // add 3 horas, que é a diferença do fuzo horário
    const startOfDayy = addHours(parsedDate, timeZoneLocal);

    console.log('inTime:', inTime);
    console.log('data_:', data_);
    console.log('data2:', data2);
    console.log('time:', time);
    console.log('startOfDayy:', startOfDayy);

    navigation.navigate('Confirm', {
      provider,
      time,
      data_: startOfDayy,
      router,
    });
  }

  return (
    <Background>
      <Container>
        <Header navigation={navigation} />
        <DateInput
          date={date}
          onChange={setDate}
          hideDateTimePicker={hideDateTimePicker}
          showDateTimePicker={showDateTimePicker}
          isDateTimePickerVisible={isDateTimePickerVisible}
        />

        {loading && <Loading loading={loading}>Carregando ...</Loading>}
        {!loading && hours.length < 1 ? (
          <Message nameIcon="exclamation-triangle">
            Esse prestador não tem horário no momento!
          </Message>
        ) : (
          <HourList
            data={hours}
            keyExtractor={(item) => item.time.id}
            renderItem={({ item }) => (
              <Hour
                onPress={() => handleSelectHour(item.value)}
                enabled={item.available}>
                <Title> {item.time.horario}</Title>
              </Hour>
            )}
          />
        )}
      </Container>
    </Background>
  );
}

SelectDateTime.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      provider: PropTypes.shape({
        id: PropTypes.string,
      }),
      router: PropTypes.string,
    }),
  }).isRequired,
};
