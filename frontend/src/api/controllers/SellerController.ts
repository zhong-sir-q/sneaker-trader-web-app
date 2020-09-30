import { SellerEntity, ListedSneakerSeller } from '../../../../shared';
import formatApiEndpoint, { concatPaths } from 'api/formatApiEndpoint';

class SellerController implements SellerEntity {
  sellerPath: string;

  constructor() {
    this.sellerPath = formatApiEndpoint('seller');
  }

  getSellersBySneakerNameSize = (
    currentUserId: number,
    nameColorway: string,
    size: number
  ): Promise<ListedSneakerSeller[]> =>
    fetch(concatPaths(this.sellerPath, currentUserId) + `?sneakerName=${nameColorway}&size=${size}`).then((res) =>
      res.json()
    );
}

const SellerControllerInstance = new SellerController();

export default SellerControllerInstance;
