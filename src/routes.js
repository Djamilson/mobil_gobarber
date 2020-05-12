import React from 'react';
import { TouchableOpacity } from 'react-native';
import IconMa from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Dashboard from '~/pages/Dashboard';
import DashboardAdmin from '~/pages/DashboardAdmin';
import FilaUser from '~/pages/Fila/FilaUser';
import SelectProviderFila from '~/pages/Fila/SelectProvider';
import Logout from '~/pages/Login/Logout';
import ForgetCodeReset from '~/pages/Login/SignIn/ForgetPassword/CodeReset';
import ForgetFormEmail from '~/pages/Login/SignIn/ForgetPassword/FormEmail';
import ForgetNewPassword from '~/pages/Login/SignIn/ForgetPassword/NewPassword';
import SignIn from '~/pages/Login/SignIn/Login';
import SignUpActive from '~/pages/Login/SignUp/ActiveAccount';
import SignUp from '~/pages/Login/SignUp/CreateAccount';
import Profile from '~/pages/Profile';
import RegulationReview from '~/pages/RegulationRaview';
import colors from '~/styles/colors';

import Confirm from './pages/New/Confirm';
import SelectDateTime from './pages/New/SelectDateTime';
import SelectProvider from './pages/New/SelectProvider';

Icon.loadFont();
IconMa.loadFont();

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

function NewStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerTintColor: '#FFF',
        headerLeftContainerStyle: {
          marginLeft: 20,
        },
      }}>
      <Stack.Screen
        name="SelectProvider"
        component={SelectProvider}
        options={{
          title: 'Selecione o prestador',
          headerLeft: () => <TouchableOpacity onPress={() => {}} />,
        }}
      />
      <Stack.Screen
        name="Logout"
        component={Logout}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectDateTime"
        component={SelectDateTime}
        options={{
          title: 'Selecione o horário',
          headerLeft: () => <TouchableOpacity onPress={() => {}} />,
        }}
      />
      <Stack.Screen
        name="Confirm"
        component={Confirm}
        options={{
          title: 'Confirmar agendamento',
          headerLeft: () => <TouchableOpacity onPress={() => {}} />,
        }}
      />
    </Stack.Navigator>
  );
}

function NewFila() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerTintColor: '#FFF',
        headerLeftContainerStyle: {
          marginLeft: 20,
        },
      }}>
      <Stack.Screen
        name="SelectProviderFila"
        component={SelectProviderFila}
        options={{
          title: 'In Loco Selecione o prestador',
          headerLeft: () => <TouchableOpacity onPress={() => {}} />,
        }}
      />
      <Stack.Screen
        name="FilaUser"
        component={FilaUser}
        options={{
          title: 'Fila de clientes presentes',
          headerLeft: () => <TouchableOpacity onPress={() => {}} />,
        }}
      />
    </Stack.Navigator>
  );
}

function newProfile() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerTintColor: `${colors.white_}`,
        headerLeftContainerStyle: {
          marginLeft: 10,
        },
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Meu Perfil',
          headerLeft: () => <TouchableOpacity onPress={() => {}} />,
        }}
      />
    </Stack.Navigator>
  );
}

function getInitialRoute(isSigned, acceped_regulation) {
  const acceped_regulation_ =
    acceped_regulation !== undefined &&
    acceped_regulation !== null &&
    acceped_regulation.user.profile !== null &&
    acceped_regulation.user.profile.privacy === true
      ? acceped_regulation.user.profile.privacy
      : false;

  if (isSigned) {
    if (acceped_regulation_ === true) {
      return acceped_regulation.user.profile.provider === true ? (
        <Tabs.Navigator
          tabBarOptions={{
            activeTintColor: `${colors.third}`,
            inactiveTintColor: `${colors.sixX}`,
            style: { backgroundColor: `${colors.white_}` },
            keyboardHidesTabBar: true,
          }}>
          <Tabs.Screen
            name="DashboardAdmin"
            component={DashboardAdmin}
            options={{
              tabBarLabel: 'Meus agendamentos',
              tabBarIcon: ({ color }) => (
                <Icon name="menu" size={20} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="Profile"
            component={newProfile}
            options={{
              tabBarLabel: 'Meu Perfil',
              tabBarIcon: ({ color }) => (
                <Icon name="person" size={20} color={color} />
              ),
            }}
          />
        </Tabs.Navigator>
      ) : (
        <Tabs.Navigator
          tabBarOptions={{
            activeTintColor: `${colors.third}`,
            inactiveTintColor: `${colors.sixX}`,
            style: { backgroundColor: `${colors.white_}` },
            keyboardHidesTabBar: true,
          }}>
          <Tabs.Screen
            name="Dashboard"
            component={Dashboard}
            options={{
              tabBarLabel: 'Agendamentos',
              tabBarIcon: ({ color }) => (
                <Icon name="event" size={20} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="New"
            component={NewStack}
            options={{
              tabBarVisible: false,
              tabBarLabel: 'Agendar',
              tabBarIcon: ({ color }) => (
                <Icon name="add-circle-outline" size={20} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="Fila"
            component={NewFila}
            options={{
              tabBarVisible: false,
              tabBarLabel: 'In Loco',
              tabBarIcon: ({ color }) => (
                <IconMa name="hail" size={20} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="Profile"
            component={newProfile}
            options={{
              tabBarLabel: 'Meu Perfil',
              tabBarIcon: ({ color }) => (
                <Icon name="person" size={20} color={color} />
              ),
            }}
          />
        </Tabs.Navigator>
      );
    }
    return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="RegulationReview" component={RegulationReview} />
        <Stack.Screen name="Logout" component={Logout} />
      </Stack.Navigator>
    );
  }
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="ForgetFormEmail" component={ForgetFormEmail} />
      <Stack.Screen name="ForgetCodeReset" component={ForgetCodeReset} />
      <Stack.Screen name="ForgetNewPassword" component={ForgetNewPassword} />
      <Stack.Screen name="SignUpActive" component={SignUpActive} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}

export default function createRouter(
  isSigned = false,
  provider,
  acceped_regulation,
) {
  return getInitialRoute(isSigned, provider, acceped_regulation);
}
