import styled from 'styled-components/native';

import { colors, fonts, metrics } from '~/styles';
import { heightPercentageToDP } from '~/utils/Layout';

export const Container = styled.View`
  padding: ${metrics.padding}px;
  background: ${colors.white};
  border-color: ${colors.fourth};
`;

export const ProfileContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ContainerAvatar = styled.View`
  margin-right: 20px;
`;

export const ProfileInfo = styled.View`
  flex: 1;
`;

export const Name = styled.Text`
  font-weight: bold;
  font-size: ${fonts.big}px;
  color: ${colors.dark};
  margin-top: 5px;
`;

export const Bio = styled.Text`
  font-size: ${fonts.small}px;
  color: ${colors.regular};
  margin-top: 5px;
`;

export const ButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
`;

export const ButtonLogout = styled.TouchableOpacity`
  padding-right: ${heightPercentageToDP('2%')}px;

  margin-left: ${metrics.padding}px;
  height: 46px;

  align-items: center;
  justify-content: center;
  margin-right: 2px;
`;

export const ButtonPrivacy = styled.TouchableOpacity`
  padding: 0 20px;
  height: 46px;

  align-items: center;
  justify-content: center;
`;
