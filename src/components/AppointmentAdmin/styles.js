import styled from 'styled-components/native';

import Button from '~/components/Button';
import { colors } from '~/styles';
import { widthPercentageToDP } from '~/utils/Layout';

export const Container = styled.View`
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 7px;
  background: ${(props) => (props.agendar ? '#fff' : '#dbead5')};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  opacity: ${(props) => (props.past && props.agendar ? 0.6 : 1)};
`;
export const ContainerButton = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;

  padding: 2px;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 100px;
  margin-left: 2px;
`;

export const CancelButton = styled(Button)`
  margin-top: 10px;
  background: ${colors.red};
  height: 40px;

  border-radius: 4px;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;

  width: ${widthPercentageToDP('20%')}px;
`;

export const AtendendoButton = styled(Button)`
  margin-top: 5px;
  background: ${colors.green};
  height: 40px;

  padding: 0px 5px 5px 0px;
  width: ${widthPercentageToDP('20%')}px;
`;

export const FinalityButton = styled(Button)`
  margin-top: 10px;
  background: ${colors.third};
  height: 40px;

  padding: 0px 5px 5px 5px;

  width: ${widthPercentageToDP('20%')}px;
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
  margin-right: 10px;
`;

export const Info = styled.View`
  margin-left: 0px;
`;

export const InfoStatus = styled.View`
  margin-left: 0px;
  flex: 1;
  flex-direction: row;
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

export const TextButton = styled.Text`
  font-size: 12px;
  margin-top: 4px;

  padding-right: 5px;
`;

export const Time = styled.Text`
  color: ${(props) => (props.agendar ? '#fff' : '#999')};
  font-size: 13px;
  margin-top: 4px;
`;

export const InfoStatusChamada = styled.View`
  margin-left: 0px;
  flex: 1;
  flex-direction: row;
  align-content: stretch;
  justify-content: center;
  align-items: center;
`;

export const StatusLabel = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: ${(props) => (props.agendar ? '#fff' : '#999')};
`;

export const StatusLabelFila = styled.Text`
  font-weight: bold;
  font-size: 18px;
  color: ${(props) => (props.agendar ? '#fff' : '#999')};
`;

export const StatusText = styled.Text`
  font-weight: bold;
  font-size: 21px;
  color: #008000;
  margin-right: 10px;
`;
