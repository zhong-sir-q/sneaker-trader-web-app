import { useHistory } from 'react-router-dom';

const useRedirect = (pathname: string) => {
  const history = useHistory();

  return () => history.replace(pathname);
};

export default useRedirect;
