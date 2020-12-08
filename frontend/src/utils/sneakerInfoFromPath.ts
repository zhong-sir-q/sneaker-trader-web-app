// the name colorway and size must be at the end of the path
const sneakerInfoFromPath = (pathname: string) => {
  const paths = pathname.split('/');

  const sneakerInfo = paths.slice(paths.length - 2);

  const shoeNameColorway = sneakerInfo[0].split('.');
  shoeNameColorway[0] = shoeNameColorway[0].split('-').join(' ');
  shoeNameColorway[1] = shoeNameColorway[1].split('-').join(' ');

  const [name, colorway] = shoeNameColorway;
  const size = Number(sneakerInfo[sneakerInfo.length - 1]);

  if (!size) throw new Error('Sneaker size is not in the path');

  return { name, colorway, size };
};

export default sneakerInfoFromPath;
