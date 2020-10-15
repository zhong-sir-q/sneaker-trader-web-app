const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;

const formatApiEndpoint = (path: string) => `${API_BASE_URL}${path}`;

export const concatPaths = (...paths: (string | number)[]) => {
  if (paths.length === 0) return '/';
  else if (paths.length === 1) return `/${paths[0]}`;

  return paths.map((path) => (path === '/' ? '' : path)).join('/');
};

export default formatApiEndpoint;
