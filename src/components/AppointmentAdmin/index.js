import React, { useMemo } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import PropTypes from 'prop-types';

import { parseISO, formatRelative } from 'date-fns';
import pt from 'date-fns/locale/pt';

import enumAppointment from '~/enum/appointments';

import {
  Container,
  Left,
  Avatar,
  Info,
  InfoStatus,
  Status,
  InfoStatusChamada,
  StatusLabel,
  StatusText,
  Time,
  Name,
  ContainerButton,
  AtendendoButton,
  FinalityButton,
  TextButton,
  CancelButton,
  StatusLabelFila,
} from './styles';

export default function AppointmentAdmin({
  data,
  onAtender,
  onFinally,
  onCancel,
}) {
  const dateParsed = useMemo(() => {
    return formatRelative(parseISO(data.data), new Date(), {
      locale: pt,
      addSuffix: true,
    });
  }, [data]);

  return (
    <Container past={data.past} agendar={Boolean(data.agendar)}>
      <Left>
        <Avatar
          source={{
            uri: data.user.avatar
              ? `${data.user.avatar.url}-xs`
              : `https://api.adorable.io/avatar/50/${data.user.name}.png`,
          }}
        />
        <Info>
          <StatusLabel>Cliente: </StatusLabel>
          <Name>{data.user.name}</Name>

          {data.status === enumAppointment.atendendo && (
            <InfoStatus>
              <StatusLabel>Status:</StatusLabel>
              <Status>{data.status}</Status>
            </InfoStatus>
          )}

          <StatusLabel>Ordem de chamada:</StatusLabel>
          {data.status === enumAppointment.atendendo && (
            <InfoStatusChamada>
              <StatusText>{enumAppointment.atendendo}</StatusText>
            </InfoStatusChamada>
          )}

          {data.index === 0 && data.status !== enumAppointment.atendendo && (
            <InfoStatusChamada>
              <StatusText>Próximo</StatusText>
            </InfoStatusChamada>
          )}

          {data.index !== 0 && data.status !== enumAppointment.atendendo && (
            <InfoStatusChamada>
              <StatusText>{data.index}º</StatusText>
              <StatusLabelFila>da fila</StatusLabelFila>
            </InfoStatusChamada>
          )}

          <Time>Agendado para {dateParsed}</Time>
        </Info>
      </Left>
      <ContainerButton>
        {data.status === enumAppointment.atendendo ? (
          <FinalityButton loading={false} onPress={onFinally}>
            <TextButton>Finalizar</TextButton>
            <Icon
              name="done-all"
              styles={{ marginTop: 10 }}
              size={16}
              color="#fff"
            />
          </FinalityButton>
        ) : (
          <AtendendoButton loading={false} onPress={onAtender}>
            <TextButton>Atender</TextButton>
            <Icon name="check" size={16} color="#fff" />
          </AtendendoButton>
        )}
        {data.status !== enumAppointment.cancelado && (
          <CancelButton loading={false} onPress={onCancel}>
            <TextButton>Cancelar</TextButton>
            <Icon
              name="close"
              styles={{ marginTop: 10 }}
              size={16}
              color="#fff"
            />
          </CancelButton>
        )}
      </ContainerButton>
    </Container>
  );
}

AppointmentAdmin.propTypes = {
  data: PropTypes.shape({
    user: PropTypes.object,
    cancelable: PropTypes.bool,
    data: PropTypes.string,
    index: PropTypes.number,
    status: PropTypes.string,
    agendar: PropTypes.bool,
    past: PropTypes.bool,
    canceled_at: PropTypes.string,
  }).isRequired,
  onAtender: PropTypes.func.isRequired,
  onFinally: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
