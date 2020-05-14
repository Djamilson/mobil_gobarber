import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

import PropTypes from 'prop-types';

import { colors, fonts } from '~/styles';

import { Container, Info, Name, ButtonRefresh } from './styles';

export default function Message({ children, nameIcon, refreshList }) {
  return (
    <Container>
      <Icon name={nameIcon} size={30} color="#ffe119" />
      <Info>
        <Name>{children}</Name>
        <ButtonRefresh loading={false} onPress={() => refreshList()}>
          <Icon name="sync-alt" size={fonts.bigbig} color={colors.white} />
        </ButtonRefresh>
      </Info>
    </Container>
  );
}

Message.propTypes = {
  children: PropTypes.string.isRequired,
  nameIcon: PropTypes.string.isRequired,
  refreshList: PropTypes.func.isRequired,
};
