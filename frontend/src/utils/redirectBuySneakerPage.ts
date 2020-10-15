import { concatPaths } from 'api/formatApiEndpoint';
import { MARKET_PLACE } from 'routes';
import { formatSneakerPathName } from './utils';

const redirectBuySneakerPage = (history: any, sneakername: string, colorway: string) =>
  history.push(concatPaths(MARKET_PLACE, formatSneakerPathName(sneakername, colorway)));

export default redirectBuySneakerPage;
