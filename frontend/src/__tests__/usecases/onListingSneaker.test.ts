import onListingSneaker from 'usecases/onListingSneaker';
import {
  MockAwsControllerInstance,
  MockSneakerControllerInstance,
  MockListedSneakerControllerInstance,
  MockHelperInfoControllerInstance,
  MockMailControllerInstance,
} from '__mocks__/controllers';

import faker from 'faker';
import fakeListingFormSneaker from '__mocks__/data/fakeListingFormSneaker';
import fakeListedSneakerFormPayload from '__mocks__/data/fakeListedSneakerFormPayload';
import fakeSneaker from '__mocks__/data/fakeSneaker';
import fakeUser from '__mocks__/data/fakeUser';

test('Call respective functions on listing a sneaker', async (done) => {
  const spyGetSneakerByNameColorwaySize = jest
    .spyOn(MockSneakerControllerInstance, 'getByNameColorwaySize')
    .mockResolvedValue(fakeSneaker());

  const spyUploadS3MultipleImages = jest
    .spyOn(MockAwsControllerInstance, 'uploadS3MultipleImages')
    .mockResolvedValue([faker.internet.url(), faker.internet.url()]);

  await onListingSneaker(
    MockAwsControllerInstance,
    MockSneakerControllerInstance,
    MockListedSneakerControllerInstance,
    MockHelperInfoControllerInstance,
    MockMailControllerInstance
  )(new FormData(), fakeUser(), fakeListingFormSneaker(), fakeListedSneakerFormPayload, 'Nike', undefined, undefined);

  expect(spyUploadS3MultipleImages).toBeCalledTimes(1);
  expect(spyGetSneakerByNameColorwaySize).toBeCalledTimes(1);

  expect(MockListedSneakerControllerInstance.create).toBeCalledTimes(1);
  expect(MockHelperInfoControllerInstance.createBrand).toBeCalledTimes(1);

  // these functions have been called 0 times because the respective arguments are undefined
  expect(MockHelperInfoControllerInstance.createColorway).toBeCalledTimes(0);
  expect(MockHelperInfoControllerInstance.createSneakerName).toBeCalledTimes(0);

  done();
});
