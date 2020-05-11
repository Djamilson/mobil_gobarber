import produce from 'immer';

// import {getUniqueId} from '~/utils/IdDivice';

/* deviceId => variável que identifica qual o dispositivo esta conectado
 usado pelo socket para remover o disposito do envio de mensage incorreta
 variável é necessário caso tenha mais de um dispositivo conectado com
o mesmo login */
// console.log('ID Divice: ', DeviceInfo.getUniqueID());

// console.log('ID Divice: ', getUniqueId());

// const idDevice
const INITIAL_STATE = {
  token: null,
  signed: false,
  loading: false,
};

export default function auth(state = INITIAL_STATE, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case '@auth/SIGN_IN_REQUEST': {
        draft.loading = true;
        break;
      }

      case '@auth/SIGN_IN_SUCCESS': {
        draft.token = action.payload.token;
        draft.signed = true;
        draft.loading = false;
        break;
      }

      case '@auth/SIGN_FAILURE': {
        draft.loading = false;
        break;
      }

      case '@user/SIGNUP_FAILURE': {
        draft.loading = false;
        break;
      }

      case '@auth/SIGN_OUT': {
        draft.token = null;
        draft.signed = false;
        break;
      }
      default:
    }
  });
}
