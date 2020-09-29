export const formatSneakerPathName = (name: string, color: string) => (name + ' ' + color).split(' ').join('-');

export const upperCaseFirstLetter = (s: string | undefined) => {
  if (!s) return s;

  const firstLetter = s[0];
  return firstLetter.toUpperCase() + s.slice(1);
};


export const range = (start: number, end: number, step: number): number[] => {
  let result: number[] = [];

  for (let num = start; num <= end; num += step) result.push(num);

  return result;
};
