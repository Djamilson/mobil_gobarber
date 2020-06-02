import React, { useState } from 'react';
import ModalReact from 'react-native-modal';
import { useSelector, useDispatch } from 'react-redux';

import PropTypes from 'prop-types';

import Regulation from '~/components/Regulation';
import { acceptionRegulation } from '~/store/modules/auth/actions';

import {
  Container,
  Background,
  Item,
  ApproveButton,
  ApproveButtonText,
  Footer,
  NoButton,
  Text,
} from './styles';

export default function TermosCondicoes({
  toggleModal,
  isModalVisible,
  isApproveButton,
}) {
  const [privacy] = useState(
    useSelector((state) => state.user.profile.privacy),
  );
  const dispatch = useDispatch();

  function handleAcceptRegulation() {
    const newPrivacy = !privacy;
    dispatch(acceptionRegulation({ newPrivacy }));
    toggleModal();
  }

  return (
    isModalVisible && (
      <Container>
        <ModalReact isVisible={isModalVisible} animationType="slide">
          <Background>
            <Item>
              <Regulation />
            </Item>

            {isApproveButton && (
              <ApproveButton onPress={handleAcceptRegulation}>
                <ApproveButtonText>Não aceito os termos</ApproveButtonText>
              </ApproveButton>
            )}
          </Background>

          <Footer>
            <NoButton loading={false} onPress={toggleModal}>
              <Text>Fechar</Text>
            </NoButton>
          </Footer>
        </ModalReact>
      </Container>
    )
  );
}

TermosCondicoes.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  isModalVisible: PropTypes.bool.isRequired,
  isApproveButton: PropTypes.bool.isRequired,
};
