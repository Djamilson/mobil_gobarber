export function selectLogoSuccess(company) {
  return {
    type: '@company/SELECT_LOGO_SUCCESS',
    payload: { company },
  };
}
