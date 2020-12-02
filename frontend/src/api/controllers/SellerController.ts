import { SellerEntity, ListedSneakerSeller } from '../../../../shared';
import formatApiEndpoint, { concatPaths } from 'utils/formatApiEndpoint';

class SellerController implements SellerEntity {
  sellerPath: string;

  constructor() {
    this.sellerPath = formatApiEndpoint('seller');
  }

  getSellersBySneakerNameSize = (
    currentUserId: number,
    name: string,
    colorway: string,
    size: number
  ): Promise<ListedSneakerSeller[]> =>
    fetch(concatPaths(this.sellerPath, currentUserId, name, colorway, size)).then((res) => res.json());
}

const SellerControllerInstance = new SellerController();

export default SellerControllerInstance;
