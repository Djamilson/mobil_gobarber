import 'react-native-gesture-handler';

import React, { Component } from 'react';
import { YellowBox, StatusBar } from 'react-native';
import CodePush from 'react-native-code-push';
import OneSignal from 'react-native-onesignal';
import { Provider } from 'react-redux';

import { NavigationContainer } from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react';

import './_config/ReactotronConfig';

import colors from '~/styles/colors';

import App from './App';
import { store, persistor } from './store';

YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: DatePickerAndroid',
  '',
  'Unrecognized WebSocket',
  'Unrecognized WebSocket connection option(s)',
]);

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
};

class Index extends Component {
  constructor(props) {
    super(props);
    OneSignal.init('47170d76-f69c-4b84-bf0c-0c43aa47c85c');

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived = (data) => {
    // console.log('data user:', data);
  };

  onOpened = (notification) => {
    // console.log(notification);
  };

  onIds = async (id) => {
    // console.log('ID user:::', id.userId);
  };

  render() {
    return (
      <NavigationContainer>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <StatusBar
              barStyle="light-content"
              backgroundColor={colors.third}
            />
            <App />
          </PersistGate>
        </Provider>
      </NavigationContainer>
    );
  }
}

export default CodePush({ codePushOptions })(Index);
