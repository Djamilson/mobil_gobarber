import { StyleSheet } from 'react-native';

import styled from 'styled-components/native';

import { colors, fonts, metrics } from '~/styles';
import { heightPercentageToDP, widthPercentageToDP } from '~/utils/Layout';

export const Container = styled.View`
  margin-bottom: 15px;
  padding: 20px;

  background: ${(props) => (props.agendar ? '#fff' : '#dbead5')};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  opacity: ${(props) => (props.past && props.agendar ? 0.6 : 1)};

  border-width: ${StyleSheet.hairlineWidth}px;
  border-color: ${colors.twelve};
  border-radius: ${metrics.border_radius}px;
`;

export const Left = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

export const Info = styled.View`
  margin-left: 15px;
`;

export const InfoStatus = styled.View`
  margin-left: 0px;
  flex: 1;
  flex-direction: row;
`;

export const StatusLabel = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: ${(props) => (props.agendar ? '#fff' : '#999')};
`;

export const Status = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: #008000;
`;

export const Name = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: #333;
  max-width: 220px;
`;

export const Time = styled.Text`
  color: ${(props) => (props.agendar ? '#fff' : '#999')};
  font-size: 13px;
  margin-top: 4px;
`;
