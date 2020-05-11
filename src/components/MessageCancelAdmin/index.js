import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconMat from 'react-native-vector-icons/MaterialCommunityIcons';

import PropTypes from 'prop-types';

import { Container, Info, Name, CloseButton } from './styles';

export default function MessageCancelAdmin({
  nameIcon,
  closeMessage,
  dataFormat,
  appointmentSelect,
}) {
  console.log('Cancel:');

  return (
    <Container>
      <Icon name={nameIcon} size={30} color="#ffe119" />
      <Info>
        <CloseButton loading onPress={closeMessage}>
          <IconMat name="close-circle" size={30} color="#ffe119" />
        </CloseButton>
        <Name>
          Por algum motivo o agendamento de {dataFormat}, com o (a) clinte{' '}
          {'\n'}
          {appointmentSelect} foi cancelado!
        </Name>
      </Info>
    </Container>
  );
}

MessageCancelAdmin.propTypes = {
  appointmentSelect: PropTypes.string.isRequired,
  dataFormat: PropTypes.string.isRequired,
  nameIcon: PropTypes.string.isRequired,
  closeMessage: PropTypes.func.isRequired,
};
