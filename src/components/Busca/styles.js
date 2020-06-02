import { StyleSheet } from 'react-native';

import styled from 'styled-components/native';

import { widthPercentageToDP } from '~/utils/Layout';

export const Container = styled.View`
  flex: 1;
`;

export const BordSelect = styled.View`
  border-width: ${StyleSheet.hairlineWidth}px;
  border-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  top: 20px;
  margin: 0 ${widthPercentageToDP('4%')}px;
  height: 50px;
`;
