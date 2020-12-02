const sneakerInfoFromPath = (pathname: string) => {
  const paths = pathname.split('/');

  // current implementation depends on that the sneaker name colorway should
  // be the only string that contains the hyphen '-'
  const nameColorwayIdx = paths.findIndex((p: string) => p.includes('-'));
  const sneakerInfo = paths.slice(nameColorwayIdx);

  const shoeNameColorway = sneakerInfo[0].split('.');
  shoeNameColorway[0] = shoeNameColorway[0].split('-').join(' ');
  shoeNameColorway[1] = shoeNameColorway[1].split('-').join(' ');

  const [name, colorway] = shoeNameColorway;
  const size = Number(sneakerInfo[sneakerInfo.length - 1]);

  if (!size) throw new Error('Sneaker size is not in the path');

  return { name, colorway, size };
};

export default sneakerInfoFromPath;
