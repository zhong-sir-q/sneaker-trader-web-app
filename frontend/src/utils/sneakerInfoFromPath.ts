const sneakerInfoFromPath = (pathname: string) => {
  const paths = pathname.split('/');

  // current implementation depends on that the sneaker name colorway should
  // be the only string that contains the hyphen '-'
  const nameColorwayIdx = paths.findIndex((p: string) => p.includes('-'));
  const sneakerInfo = paths.slice(nameColorwayIdx);

  const sneakerNameColorway = sneakerInfo[0].split('-').join(' ');
  const sneakerSize = Number(sneakerInfo[sneakerInfo.length - 1]);

  if (!sneakerSize) throw new Error('Sneaker size is not in the path')

  return { nameColorway: sneakerNameColorway, size: sneakerSize };
};

export default sneakerInfoFromPath;
