import { PortfolioController } from 'api/controllers/PortfolioController';
import { PortfolioSneaker } from '../../../../shared';

const onSubmitPortfolioForm = (PortfolioControllerInstance: PortfolioController) => async (
  payload: Omit<PortfolioSneaker, 'id'>,
  cb: () => void
) => {
  await PortfolioControllerInstance.add(payload);
  cb();
};

export default onSubmitPortfolioForm;
