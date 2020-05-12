import styled from 'styled-components/native';

import { colors, fonts, metrics } from '~/styles';

export const Container = styled.SafeAreaView`
  flex: 1;
`;
export const ContentList = styled.View`
  display: flex;
  margin-top: 10px;
  margin-bottom: 30px;
  padding-bottom: 100px;
`;

export const List = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: { marginTop: 20, padding: 15, bottom: 30 },
})``;

export const ContainerItem = styled.View`
  margin-bottom: 15px;
  padding: 20px;
  border-radius: 7px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

export const Content = styled.View`
  border-color: ${colors.fourth};
  padding-bottom: 70px;
`;

export const ProfileContainer = styled.View`
  padding: 0 ${metrics.padding}px;
  padding-bottom: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  display: flex;
`;

export const Avatar = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 60px;
  margin-right: ${metrics.padding}px;
`;

export const Name = styled.Text`
  font-weight: bold;
  font-size: ${fonts.big}px;
  color: ${colors.dark};
  margin-top: 5px;
`;
