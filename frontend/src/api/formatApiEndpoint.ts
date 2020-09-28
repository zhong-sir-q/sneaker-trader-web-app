const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;

const formatApiEndpoint = (path: string) => `${API_BASE_URL}${path}`

export const concatPaths = (...paths: (string | number)[]) => paths.join('/')

export default formatApiEndpoint
