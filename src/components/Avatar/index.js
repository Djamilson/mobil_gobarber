import React from 'react';

import PropTypes from 'prop-types';

import localhostConfig from '~/_config/host';

import { Avatar } from './styles';

const { WEBHOST, PORT } = localhostConfig;

export default function Header({ data, number }) {
  let url = data.avatar !== null ? `${data.avatar.url}-xs` : null;

  if (__DEV__) {
    url =
      data.avatar !== null
        ? `${data.avatar.url}-xs`
        : `https://api.adorable.io/avatar/50/${data.name}.png`;
  }

  return (
    <Avatar
      number={number}
      source={{
        uri: `${url}`,
      }}
    />
  );
}

Header.propTypes = {
  number: PropTypes.number.isRequired,
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar: PropTypes.shape({
      url: PropTypes.string,
      path: PropTypes.string,
    }),
  }).isRequired,
};
