import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import api from '~/_services/api';
import Background from '~/components/Background/Fila';
import Busca from '~/components/Busca';
import Loading from '~/components/Loading';
import Message from '~/components/Message';
import Header from '~/pages/New/Header';

import {
  Container,
  ProvidersList,
  Provider,
  ContainerLogo,
  Logo,
  Avatar,
  Name,
  Title,
} from './styles';

export default function SelectProvider({ navigation }) {
  const [providers, setProviders] = useState([]);
  const [setCompany] = useState([]);
  const [companySelect, setCompanySelect] = useState({});
  const [loading, setLoading] = useState(false);

  async function loadProvider() {
    setLoading(true);
    await api
      .get(`providers`)
      .then((res) => {
        setLoading(false);
        setProviders(res.data);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  function handleNavSelectList(provider) {
    return navigation.navigate('FilaUser', { provider });
  }

  useEffect(() => {
    loadProvider();
    async function loadCompany() {
      setLoading(true);
      await api
        .get(`empresas`)
        .then((res) => {
          setLoading(false);

          const data = res.data.map((comp) => ({
            label: comp.name,
            value: comp,
            avatar: comp.avatar,
          }));

          setCompany(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }
    loadCompany();
  }, [setCompany]);

  async function handleSelectProvider(value) {
    if (value !== null) {
      setLoading(true);
      await api
        .get(`users/${value.id}`)
        .then((res) => {
          setLoading(false);
          setProviders(res.data);
          setCompanySelect(value);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      loadProvider();
      setCompanySelect({});
    }
  }

  return (
    <Background>
      <Container>
        <Header navigation={navigation} />

        <Busca handleSelectProvider={handleSelectProvider} />

        {companySelect.logo && companySelect.logo.url && (
          <ContainerLogo>
            <Logo
              source={{
                uri: companySelect.logo
                  ? companySelect.logo.url
                  : `https://api.adorable.io/avatar/50/${companySelect.name}.png`,
              }}
            />
            <Title>{companySelect.name}</Title>
          </ContainerLogo>
        )}

        {loading && <Loading loading={loading}>Carregando ...</Loading>}
        {!loading && providers.length < 1 ? (
          <Message nameIcon="exclamation-triangle">
            Você não tem horário agendado no momento!
          </Message>
        ) : (
          <ProvidersList
            data={providers}
            keyExtractor={(provider) => String(provider.id)}
            renderItem={({ item: provider }) => (
              <Provider onPress={() => handleNavSelectList(provider)}>
                <Avatar
                  source={{
                    uri: provider.avatar
                      ? provider.avatar.url
                      : `https://api.adorable.io/avatar/50/${provider.name}.png`,
                  }}
                />
                <Name>{provider.name}</Name>
              </Provider>
            )}
          />
        )}
      </Container>
    </Background>
  );
}

SelectProvider.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
