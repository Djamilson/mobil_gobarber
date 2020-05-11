import styled from 'styled-components/native';

import { colors } from '~/styles';
import { widthPercentageToDP } from '~/utils/Layout';

export const Container = styled.View`
  display: flex;
  flex-direction: row;
  width: ${widthPercentageToDP('100%')}px;
  height: 60px;
  background: ${colors.third};
  padding: 15px;
  color: ${colors.white};
`;

export const ButtonHeader = styled.TouchableOpacity`
  width: 30%;
  height: 60px;
  margin-left: -5px;
`;
