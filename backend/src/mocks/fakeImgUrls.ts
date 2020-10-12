import faker from 'faker'

const fakeImgUrls = () => {
  const imgs = [];
  const num = faker.random.number(3);

  for (let i = 0; i < num; i++) imgs.push(faker.image.imageUrl());

  return imgs.join(',');
};

export default fakeImgUrls
