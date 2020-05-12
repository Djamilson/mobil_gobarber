import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

import PropTypes from 'prop-types';

import { CommonActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Avatar from '~/components/Avatar';
import TermosCondicoes from '~/components/TermosCondicoes';
import { colors, fonts } from '~/styles';

import {
  Container,
  ContainerAvatar,
  ProfileInfo,
  Name,
  Bio,
  ProfileContainer,
  ButtonContainer,
  ButtonLogout,
  ButtonPrivacy,
} from './styles';

export default function Header({ navigation }) {
  const user = useSelector((state) => state.user.profile);

  const [isApproveButton] = useState(true);
  const [isModalVisiblePrivacy, setIsModalVisiblePrivacy] = useState(false);

  function toggleModalPrivacy() {
    setIsModalVisiblePrivacy(!isModalVisiblePrivacy);
  }

  function changeLogout() {
    // navigation.navigate('Logout');
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Logout',
      }),
    );
  }

  return (
    <Container>
      <ProfileContainer>
        <ContainerAvatar>
          <Avatar data={user} number={1} />
        </ContainerAvatar>
        <ProfileInfo>
          <Bio>Bem vindo de volta.</Bio>
          <Name>{user.name}</Name>
        </ProfileInfo>
        <ButtonContainer>
          <ButtonLogout onPress={() => changeLogout()}>
            <Icon name="ios-log-in" size={fonts.big} color={colors.rede} />
          </ButtonLogout>
          <ButtonPrivacy onPress={toggleModalPrivacy}>
            <Icon name="md-more" size={fonts.bigbig} color={colors.rede} />
          </ButtonPrivacy>
        </ButtonContainer>
      </ProfileContainer>

      <TermosCondicoes
        toggleModal={toggleModalPrivacy}
        isModalVisible={isModalVisiblePrivacy}
        navigation={navigation}
        isApproveButton={isApproveButton}
      />
    </Container>
  );
}

Header.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
};
