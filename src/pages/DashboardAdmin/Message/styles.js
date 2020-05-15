import styled from 'styled-components/native';

import Button from '~/components/Button';
import { colors } from '~/styles';
import { widthPercentageToDP } from '~/utils/Layout';

export const Container = styled.View`
  margin-top: 60px;
  margin-bottom: 15px;
  padding: 20px;
  border-radius: 4px;
  background: ${colors.third};
  color: ${colors.white};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-left: 25px;
  margin-right: 25px;
`;

export const Info = styled.View`
  display: flex;
  flex-direction: column;

  margin-left: 15px;
`;

export const Name = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: ${colors.white};
  width: ${widthPercentageToDP('63%')}px;
`;

export const ButtonRefresh = styled(Button)`
  margin-top: 10px;
  height: 46px;
  align-items: center;
  justify-content: center;
  background: ${colors.primary};
  width: ${widthPercentageToDP('63%')}px;
`;
