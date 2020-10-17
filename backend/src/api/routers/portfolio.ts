import { Router } from 'express';
import PortfolioSneakerService from '../../services/PortfolioSneakerService';

const portfolioRoute = Router();

// NOTE: are there too much going on in this funtion? If so, how can I refactor it?
export default (app: Router, PortfolioSneakerServiceInstance: PortfolioSneakerService) => {
  app.use('/portfolio', portfolioRoute);

  portfolioRoute.get('/all/:userId', (req, res, next) => {
    const { userId } = req.params;

    PortfolioSneakerServiceInstance.getAllByUserId(Number(userId))
      .then((sneakers) => res.json(sneakers))
      .catch(next);
  });

  portfolioRoute.post('/', (req, res, next) => {
    const portfolioSneaker = req.body;

    PortfolioSneakerServiceInstance.add(portfolioSneaker)
      .then((insertId) => res.json(insertId))
      .catch(next);
  });

  portfolioRoute.delete('/:portfolioSneakerId', (req, res, next) => {
    const { portfolioSneakerId } = req.params;

    PortfolioSneakerServiceInstance.delete(Number(portfolioSneakerId))
      .then(() => res.json(`Portfolio sneaker ${portfolioSneakerId} deleted`))
      .catch(next);
  });
};
