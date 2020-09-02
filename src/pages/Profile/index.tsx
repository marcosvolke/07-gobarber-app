import React, { useRef, useCallback } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import api from '../../services/api';

import Input from '../../components/input';
import Button from '../../components/button';

import { useAuth } from '../../context/AuthContext';

import {
  Container,
  Content,
  Title,
  UserAvatarButton,
  UserAvatar,
  BackButton,
} from './styles';

import getValidationErrors from '../../utils/getValidationErros';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();

  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const handleSignUp = useCallback(async (data: ProfileFormData) => {
    // console.log(data);
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('Email obrigatório').email('Digite um e-mail válido'),
        old_password: Yup.string(),
        password: Yup.string().when('old_password', {
          is: val => !!val.length,
          then: Yup.string().required('Campo obrigatório'),
          otherwise: Yup.string(),
        }),
        password_confirmation: Yup.string().when('old_password', {
          is: val => !!val.length,
          then: Yup.string().required('Campo obrigatório'),
          otherwise: Yup.string(),
        }).oneOf([Yup.ref('password')], 'Confirmação incorreta!'),
      });

      // Config abortEarly para não parar no primeiro erro de validação e retornar todos
      await schema.validate(data, {
        abortEarly: false,
      });

      // junto campos de password ao objeto enviado apenas se old_password preenchido
      const { name, email, old_password, password, password_confirmation} = data;
      const formData = Object.assign({
        name,
        email,
      }, old_password ? {
        old_password,
        password,
        password_confirmation,
      } : {} );

      const response = await api.put('/profile', formData);

      updateUser(response.data);

      Alert.alert('Perfil atualizado com sucesso!');

      navigation.goBack();
    } catch (err) {
      // console.log(err);
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }

      Alert.alert('Erro na atualização do perfil', 'Ocorreu um erro ao atualizar seu perfil, tente novamente.');
    }
  }, [navigation]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding': undefined}
        enabled
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <Content showsVerticalScrollIndicator={false}>
              <BackButton onPress={handleGoBack}>
                <Icon name="chevron-left" size={24} color="#999591" />
              </BackButton>

              <UserAvatarButton onPress={() => {}}>
                <UserAvatar source={{ uri: user.avatar_url }} />
              </UserAvatarButton>

              <View>
                <Title>Meu Perfil</Title>
              </View>

              <Form initialData={user} ref={formRef} onSubmit={handleSignUp}>
                <Input
                  name="name"
                  icon="user"
                  placeholder="Nome"
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => { emailInputRef.current?.focus() }}
                />
                <Input
                  ref={emailInputRef}
                  name="email"
                  icon="mail"
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCorrect={false}
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => { oldPasswordInputRef.current?.focus() }}
                />
                <Input
                  ref={oldPasswordInputRef}
                  name="old_password"
                  icon="lock"
                  placeholder="Senha Atual"
                  secureTextEntry
                  textContentType="newPassword"
                  containerStyle={{ marginTop: 16 }}
                  returnKeyType="next"
                  onSubmitEditing={() => { passwordInputRef.current?.focus() }}
                />
                <Input
                  ref={passwordInputRef}
                  name="password"
                  icon="lock"
                  placeholder="Nova Senha"
                  secureTextEntry
                  textContentType="newPassword"
                  returnKeyType="next"
                  onSubmitEditing={() => { confirmPasswordInputRef.current?.focus() }}
                />
                <Input
                  ref={confirmPasswordInputRef}
                  name="password_confirmation"
                  icon="lock"
                  placeholder="Confirmar Senha"
                  secureTextEntry
                  textContentType="newPassword"
                  returnKeyType="send"
                  onSubmitEditing={() => { formRef.current?.submitForm(); }}
                />

                <Button onPress={() => { formRef.current?.submitForm(); }}>Confirmar Mudanças</Button>
              </Form>
            </Content>


          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
