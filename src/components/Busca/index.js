import React, { useState, useEffect } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome5';

import PropTypes from 'prop-types';

import api from '~/_services/api';
import Loading from '~/components/Loading';
import Message from '~/components/Message';

import { Container, BordSelect } from './styles';

export default function Busca({ handleSelectProvider }) {
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState([]);

  useEffect(() => {
    async function loadCompany() {
      setLoading(true);
      await api
        .get(`empresas`)
        .then((res) => {
          setLoading(false);
          const data = res.data.map((comp) => ({
            label: comp.name,
            value: comp,
            avatar: comp.logo,
          }));
          setCompany(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }
    loadCompany();
  }, []);

  return (
    <Container>
      {loading && <Loading loading={loading}>Carregando ...</Loading>}
      {!loading && company.length < 1 ? (
        <Message nameIcon="exclamation-triangle">
          Desculpe! No momento não temos empresas cadastrada!
        </Message>
      ) : (
        <BordSelect>
          <RNPickerSelect
            placeholder={{
              label: 'Busca Salão...',
              value: null,
            }}
            items={company}
            onValueChange={handleSelectProvider}
            Icon={() => {
              return (
                <Icon
                  name="search"
                  styles={{ marginLeft: 30 }}
                  size={20}
                  color="#fff"
                />
              );
            }}
            style={{
              placeholder: {
                color: '#fff',
              },
              iconContainer: {
                top: 15, // to move icon up end dow
                right: 30,
              },
              inputIOS: {
                fontSize: 16,
                paddingVertical: 12,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderColor: 'gray',
                borderRadius: 4,
                color: 'black',
                paddingRight: 30, // to ensure the text is never behind the icon
              },
              inputAndroid: {
                marginTop: 0,
                height: 50,
                borderWidth: 0.5,
                fontSize: 16,
                paddingHorizontal: 20,
                marginLeft: 20,
                marginRight: 20,
                paddingVertical: 8,
                borderColor: '#fff',
                borderRadius: 8,
                paddingRight: 0, // to ensure the text is never behind the icon
              },
            }}
          />
        </BordSelect>
      )}
    </Container>
  );
}

Busca.propTypes = {
  handleSelectProvider: PropTypes.func.isRequired,
};
