import styled from 'styled-components/native';

import { heightPercentageToDP, widthPercentageToDP } from '~/utils/Layout';

export const Container = styled.View`
  flex: 1;
`;
export const Content = styled.View`
  height: 60px;
  border-radius: 4px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px ${heightPercentageToDP('8%')}px 2px 0;

  width: ${widthPercentageToDP('92%')}px;
  margin-left: ${widthPercentageToDP('4%')}px;
  margin-right: ${widthPercentageToDP('4%')}px;
`;
