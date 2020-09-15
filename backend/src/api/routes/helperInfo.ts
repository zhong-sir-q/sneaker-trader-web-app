import { Router } from 'express';

import HelperInfoService from '../../services/helperInfo';

const helperInfoRoute = Router();

// TODO: ask for advice, is the then catch syntax more clean than the try catch?
export default (app: Router, HelperInfoServiceInstance: HelperInfoService) => {
  app.use('/helper_info', helperInfoRoute);

  helperInfoRoute.get('/sneakerNames', HelperInfoServiceInstance.getSneakerNames);

  helperInfoRoute.get('/colorways', HelperInfoServiceInstance.getColorways);

  helperInfoRoute.get('/brands', HelperInfoServiceInstance.getBrands);

  helperInfoRoute.post('/brands', HelperInfoServiceInstance.createBrand);

  helperInfoRoute.post('/sneakerNames', HelperInfoServiceInstance.createSneakerName);

  helperInfoRoute.post('/colorways', HelperInfoServiceInstance.createColorway);
};
