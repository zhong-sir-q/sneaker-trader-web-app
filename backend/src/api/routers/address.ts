import { Router } from 'express';
import AddressService from '../../services/AddressService';

const userAddrRoute = Router();

export default (app: Router, AddressServiceInstance: AddressService) => {
  app.use('/address', userAddrRoute);

  userAddrRoute.get('/:userId', (req, res, next) => {
    const { userId } = req.params;

    AddressServiceInstance.getAddressByUserId(Number(userId))
      .then((addr) => res.json(addr))
      .catch(next);
  });

  userAddrRoute.post('/:userId', (req, res, next) => {
    const { userId } = req.params;
    const addr = req.body;

    AddressServiceInstance.addUserAddress(Number(userId), addr)
      .then(() => res.json('Added user address'))
      .catch(next);
  });

  userAddrRoute.post('/validateCode/:userId', (req, res, next) => {
    const { verificationCode } = req.body;
    const { userId } = req.params;

    AddressServiceInstance.validateCodeByUserID(Number(userId), verificationCode)
      .then((isCodeValid) => res.json(isCodeValid))
      .catch(next);
  });

  userAddrRoute.put('/generateCode/:userId', (req, res, next) => {
    const { userId } = req.params;

    AddressServiceInstance.generateAndUpdateVerifcationCode(Number(userId))
      .then(() => res.json('Verification code generated'))
      .catch(next);
  });

  userAddrRoute.put('/:userId', (req, res, next) => {
    const { userId } = req.params;
    const addr = req.body;

    AddressServiceInstance.updateAddressByUserId(Number(userId), addr)
      .then(() => res.json('Address is updated'))
      .catch(next);
  });
};
