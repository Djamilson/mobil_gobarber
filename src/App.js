import { useSelector } from 'react-redux';

import createRouter from './routes';

export default function App() {
  /*
  const provider = useSelector((s) => s.user.profile.provider);

   const provider = useSelector((s) => s.user.profile.provider); */

  const signed = useSelector((state) => state.auth.signed);

  console.log('signed::', signed);

  const acceped_regulation = useSelector((s) => s);

  /*
  const acceped_regulation = useSelector((s) =>
    s !== undefined &&
    s !== null &&
    s.user.profile !== null &&
    s.user.profile.privacy === true
      ? s.user.profile.privacy
      : false,
  );
*/
  // const provider = false;
  /* const provider = useSelector((s) =>
    s !== undefined &&
    s !== null &&
    s.user.profile !== null &&
    s.user.profile.provider === true
      ? s.user.profile.provider
      : false,
  ); */

  //const provider = true;

  return createRouter(signed, acceped_regulation);
}
