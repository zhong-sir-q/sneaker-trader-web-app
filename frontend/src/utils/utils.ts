export const formatSneakerPathName = (name: string, color: string) => (name + ' ' + color).split(' ').join('-');

export const formatSneakerNameColorway = (name: string, colorway: string) => `${name} ${colorway}`

export const upperCaseFirstLetter = (s: string | undefined) => {
  if (!s) return s;

  const firstLetter = s[0];
  return firstLetter.toUpperCase() + s.slice(1);
};

export const mapUpperCaseFirstLetter = (s: string, separator: string): string => {
  const arr = s.split(separator);
  return arr.map(upperCaseFirstLetter).join(separator);
};

export const range = (start: number, end: number, step: number): number[] => {
  let result: number[] = [];

  for (let num = start; num <= end; num += step) result.push(num);

  return result;
};
