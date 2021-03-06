import { Platform } from 'react-native';
import { NetworkInfo } from 'react-native-network-info';

// let url = '159.203.144.228';
let url = 'www.ofertadodia.palmas.br/gobarber';

if (__DEV__) {
  // Get Local IP
  const ip = NetworkInfo.getIPAddress();

  url = Platform.OS === 'android' ? '10.0.2.2' : ip;
  require('react-devtools');
}
// WEBHOST: url

export default {
  LOCALHOST: '192.168.0.125',
  PORT: 3333,
  WEBHOST: url,
};
