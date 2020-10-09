import { concatPaths } from 'api/formatApiEndpoint';
import { HOME } from 'routes';
import { formatSneakerPathName } from './utils';

const redirectBuySneakerPage = (history: any, sneakername: string, colorway: string) =>
  history.push(concatPaths(HOME, formatSneakerPathName(sneakername, colorway)));

export default redirectBuySneakerPage;
