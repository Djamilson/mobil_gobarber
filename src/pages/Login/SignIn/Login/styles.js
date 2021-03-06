import { Platform } from 'react-native';

import styled from 'styled-components/native';

import Button from '~/components/Button';
import Input from '~/components/Input';
import { colors, fonts } from '~/styles';

export const Container = styled.KeyboardAvoidingView.attrs({
  enabled: Platform.os === 'ios',
  behavior: 'padding',
})`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
`;

export const Form = styled.View`
  align-self: stretch;
  margin-top: 0px;
`;

export const Label = styled.Text`
  font-size: ${fonts.regular}px;
  color: ${colors.white_};
  font-weight: bold;
  margin-bottom: 5px;
`;

export const FormInput = styled(Input)``;

export const SubmitButton = styled(Button)`
  margin-top: 10px;
  background: ${colors.blue_ciano};
  height: 45px;
`;

export const LogoImg = styled.Image`
  width: 270px;
  height: 45px;
  margin-bottom: 58px;
`;

export const ResetPasswordLink = styled.TouchableOpacity`
  margin-top: 20px;
`;

export const ResetPasswordLinkText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

export const SignLink = styled.TouchableOpacity`
  margin-top: 20px;
`;

export const SignLinkText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;
