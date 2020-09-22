export const formatSneakerPathName = (name: string, color: string) => (name + ' ' + color).split(' ').join('-');

export const upperCaseFirstLetter = (s: string | undefined) => {
  if (!s) return s;

  const firstLetter = s[0];
  return firstLetter.toUpperCase() + s.slice(1);
};
