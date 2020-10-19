import { PortfolioController } from 'api/controllers/PortfolioController';

const onRemovePortfolioTableRow = (PortfolioControllerInstance: PortfolioController) => async (
  portfolioSneakerId: number,
  cb: () => void
) => {
  await PortfolioControllerInstance.delete(portfolioSneakerId);
  cb();
};

export default onRemovePortfolioTableRow;
