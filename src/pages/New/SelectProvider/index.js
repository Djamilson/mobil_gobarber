import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';

import PropTypes from 'prop-types';

import api from '~/_services/api';
import BackgroundDefault from '~/components/Background';
import Busca from '~/components/Busca';
import Loading from '~/components/Loading';
import Message from '~/components/Message';
import enumAppointments from '~/enum/appointments';
import Header from '~/pages/New/Header';

import Background from './background';
import {
  Container,
  ProvidersList,
  Provider,
  ContainerLogo,
  Logo,
  Avatar,
  Name,
  Title,
  TitleButton,
  Text,
  GroupButton,
  ButtonPresencial,
  ButtonAgendar,
} from './styles';

export default function SelectProvider({ navigation }) {
  const [providers, setProviders] = useState([]);
  const [novaCompany, setNovaCompany] = useState({});
  const [optionAgendar, setOptionAgendar] = useState(false);
  const [loading, setLoading] = useState(false);

  const routerAgendar = 'appointments';

  async function loadProvider() {
    setLoading(true);
    await api
      .get(`providers`)
      .then((res) => {
        setLoading(false);
        setProviders(res.data);
        console.log('Meus provaider: ', res.data);
      })
      .catch(() => {
        Alert.alert(
          'Atenção',
          'Não foi possível carregar os prestadores no momento, tente novamente!',
        );
        setLoading(false);
      });
  }

  function selectoptionAgendar() {
    setOptionAgendar(!optionAgendar);
  }

  function handleSelectHour(provider_ent) {
    const provider = {
      ...provider_ent,
      status: enumAppointments.aguardando,
      agendar: optionAgendar,
    };

    if (!optionAgendar) {
      const newprovider = {
        ...provider_ent,
        status: enumAppointments.aguardando,
        agendar: optionAgendar,
      };

      const data_ = new Date();
      const data2 = new Date(
        data_.valueOf() - data_.getTimezoneOffset() * 60000,
      );
      const time = data2.toISOString().replace(/\.\d{3}Z$/, '');

      navigation.navigate('Confirm', {
        provider: newprovider,
        time,
        data_,
        router: routerAgendar,
      });
      return;
    }

    navigation.navigate('SelectDateTime', {
      provider,
      router: routerAgendar,
    });
  }

  useEffect(() => {
    loadProvider();
  }, []);

  async function handleSelectProvider(value) {
    if (value !== null) {
      setLoading(true);
      await api
        .get(`users/${value.id}`)
        .then((res) => {
          setLoading(false);
          setProviders(res.data);
          setNovaCompany(value);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      loadProvider();
    }
    setNovaCompany(value);
  }

  function component() {
    return (
      <Container>
        <Header navigation={navigation} />
        <Busca handleSelectProvider={handleSelectProvider} />

        {novaCompany?.logo && novaCompany?.logo.url && (
          <ContainerLogo>
            <Logo
              number={1.5}
              source={{
                uri: novaCompany.logo
                  ? novaCompany.logo.url
                  : `https://api.adorable.io/avatar/50/${novaCompany.name}.png`,
              }}
            />
            <Title>{novaCompany.name}</Title>
          </ContainerLogo>
        )}

        {!loading && (
          <GroupButton
            test={novaCompany?.logo && novaCompany?.logo.url && true}>
            <ButtonPresencial
              onPress={() => selectoptionAgendar()}
              disabled={!optionAgendar}>
              {!optionAgendar && (
                <Icon
                  name="like"
                  styles={{ marginRight: 30 }}
                  size={20}
                  color="#fff"
                />
              )}
              <Text>Entra na Fila</Text>
            </ButtonPresencial>
            <ButtonAgendar
              onPress={() => selectoptionAgendar()}
              disabled={optionAgendar}>
              {optionAgendar && (
                <Icon
                  name="like"
                  styles={{ marginRight: 30 }}
                  size={20}
                  color="#fff"
                />
              )}
              <TitleButton>Agendar</TitleButton>
            </ButtonAgendar>
          </GroupButton>
        )}

        {loading && <Loading loading={loading}>Carregando ...</Loading>}
        {!loading && providers.length < 1 ? (
          <Message nameIcon="exclamation-triangle">
            Ainda não temos prestador de serviços cadastrados!
          </Message>
        ) : (
          <ProvidersList
            test={novaCompany?.avatar && novaCompany?.avatar.url && true}
            data={providers}
            keyExtractor={(provider) => String(provider.id)}
            renderItem={({ item: provider }) => (
              <Provider onPress={() => handleSelectHour(provider)}>
                <Avatar
                  source={{
                    uri: provider?.avatar
                      ? provider?.avatar.url
                      : `https://api.adorable.io/avatar/50/imagem.png`,
                  }}
                />
                <Name>{provider?.name}</Name>
              </Provider>
            )}
          />
        )}
      </Container>
    );
  }
  return optionAgendar ? (
    <Background>{component()}</Background>
  ) : (
    <BackgroundDefault>{component()}</BackgroundDefault>
  );
}

SelectProvider.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
