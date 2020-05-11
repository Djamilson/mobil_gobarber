import React, { useRef, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import IconCam from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';

import api from '~/_services/api';
import AvatarPreview from '~/components/Avatar';
import Background from '~/components/Background';
import Loading from '~/components/Loading_';
import { createImage, updateImage } from '~/store/modules/auth/actions';
import { updateProfileRequest } from '~/store/modules/user/actions';
import { fonts, colors } from '~/styles';

import {
  Container,
  ContainerAvatar,
  Avatar,
  CardButton,
  ButtonSelect,
  Form,
  Label,
  FormInput,
  Separator,
  SubmitButton,
} from './styles';

export default function Profile() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);
  const [loadingImage, setLoadingImage] = useState(false);

  const profile_ = useSelector((state) => state.user);
  
  const profile = useSelector((state) => state.user.profile);

  const emailRef = useRef();

  const oldPasswordRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const [image, setImage] = useState({ preview: '', file: '' });
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);

  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    setOldPassword('');
    setPassword('');
    setConfirmPassword('');
  }, [profile]);

  function handleSubmit() {
    dispatch(
      updateProfileRequest({
        name,
        email,
        oldPassword,
        password,
        confirmPassword,
      }),
    );
  }

  const imagePickerOptions = {
    title: 'Selecione uma foto',
    takePhotoButtonTitle: 'Tirar foto',
    chooseFromLibraryButtonTitle: 'Escolher da Galeria',
  };

  async function handleSelectImage() {
    ImagePicker.showImagePicker(imagePickerOptions, async (upload) => {
      if (upload.didCancel) {
        return;
      }
      if (upload.error) {
        return;
      }
      if (upload.customButton) {
        return;
      }
      if (!upload.uri) {
        return;
      }
      const preview = { uri: `data:image/jpeg;base64, ${upload.data}` };

      let prefix;
      let ext;

      if (upload.fileName) {
        [prefix, ext] = upload.fileName.split('.');
        ext = ext.toLowerCase() === 'heic' ? 'jpg' : ext;
      } else {
        prefix = new Date().getTime();
        ext = 'jpg';
      }
      const file = {
        uri: upload.uri,
        type: upload.type,
        name: `${prefix}.${ext}`,
      };

      setImage({
        preview,
        file,
      });

      const data = new FormData();
      data.append('file', file);

      try {
        setLoadingImage(true);
        console.log('TRY::', typeof undefined);

        if (profile.avatar === null) {
          console.log('cheguei no dispatch no if::', typeof undefined);

          dispatch(createImage({ data }));
          setLoadingImage(false);
          return;
        }

        const avatar_id = profile.avatar === null ? '' : profile.avatar.id;
        data.append('peppepp pppe id', avatar_id);

        const res = await api.put(`files/${avatar_id}`, data);
        console.log('res::::', res.data);
        dispatch(updateImage({ data: res.data }));
        setLoadingImage(false);
        /* Alert.alert(
          'Sucesso!',
          'Imagem atualizada com sucesso, será alterada no próximo login!',
        ); */
      } catch (error) {
        const str = error.toString();
        const final = str.replace(/\D/g, '');
        setLoadingImage(false);
        Alert.alert(
          'Atenção!',
          'Não foi possivel atualizar a imagem, tente novamente.',
        );
        /* if (final === '400') {
          Alert.alert(
            'Atenção!',
            'Não foi possivel atualizar a imagem, tente novamente.',
          );
        } */
      }
    });
  }

  return (
    <Background>
      <Container>
        <ContainerAvatar>
          {loadingImage === true && (
            <Loading loading={loadingImage}>Salvando ...</Loading>
          )}
          {loadingImage !== true && !image.preview && (
            <AvatarPreview data={profile} number={2.5} />
          )}
          {loadingImage !== true && !!image.preview && (
            <Avatar number={2.5} source={image.preview} />
          )}
        </ContainerAvatar>
        <CardButton>
          <ButtonSelect onPress={() => handleSelectImage()}>
            <IconCam
              name="photo-camera"
              size={fonts.extra_big}
              color={colors.white}
            />
          </ButtonSelect>
        </CardButton>

        <Form>
          <Label>Nome</Label>
          <FormInput
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Nome completo"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current.focus()}
            value={name}
            onChangeText={setName}
          />

          <Label>Email</Label>
          <FormInput
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Digite seu e-mail"
            ref={emailRef}
            returnKeyType="next"
            onSubmitEditing={() => oldPasswordRef.current.focus()}
            value={email}
            onChangeText={setEmail}
          />

          <Separator />

          <FormInput
            icon="lock-outline"
            secureTextEntry
            placeholder="Sua senha atual"
            ref={oldPasswordRef}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current.focus()}
            value={oldPassword}
            onChangeText={setOldPassword}
          />

          <FormInput
            icon="lock-outline"
            secureTextEntry
            placeholder="Sua nova senha"
            ref={passwordRef}
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current.focus()}
            value={password}
            onChangeText={setPassword}
          />

          <FormInput
            icon="lock-outline"
            secureTextEntry
            placeholder="Confirmação de senha"
            ref={confirmPasswordRef}
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <Separator />
          <SubmitButton loading={loading} onPress={handleSubmit}>
            Atualizar perfil
          </SubmitButton>
        </Form>
      </Container>
    </Background>
  );
}
