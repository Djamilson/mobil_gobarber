import produce from 'immer';

const INITIAL_STATE = {
  company: null,
  loading: false,
};

export default function company(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@company/SELECT_LOGO_SUCCESS': {
        draft.company = action.payload.company;
        draft.loading = false;
        break;
      }

      case '@company/COMPANY_CLEAR': {
        draft.company = null;
        break;
      }

      default:
    }
  });
}
