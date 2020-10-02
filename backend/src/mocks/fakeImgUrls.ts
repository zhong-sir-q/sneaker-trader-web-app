import faker from 'faker'

const fakeImgUrls = () => {
  const imgs = [];
  // max of 5 images
  const num = faker.random.number(5);
  for (let i = 0; i < num; i++) imgs.push(faker.image.imageUrl());
  return imgs.join(',');
};

export default fakeImgUrls
