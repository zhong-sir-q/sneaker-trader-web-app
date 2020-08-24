const rangeOutOfBounds = (s: string, lo: number, hi: number) => {
    return lo < 0 || hi >= s.length || lo > hi;
  };
  
  // replace all character in the range (start to end) with the characters specified
  const obfuscate = (text: string, start: number, end: number, repl: string): string => {
    if (!text || text === '') return '';
  
    // checking out of bounds
    if (rangeOutOfBounds(text, start, end)) return text;
  
    const head = text.slice(0, start);
    const tail = text.slice(end + 1);
    // start and end is 0-indexed respectively
    const body = repl.repeat(end - start + 1);
  
    return head + body + tail;
  };
  
  // given, dummy@gmail.com, obfuscate it to d***y@g***l.com. That is replace the
  // first to the second to the last characters of the name and the domain with *
  
  // assume the email is always valid
  export const obfuscateEmail = (email: string): string => {
    const emailArray = email.split('@');
  
    const domainArray = emailArray[emailArray.length - 1].split('.');
    const name = emailArray[0];
  
    emailArray[0] = obfuscate(name, 1, name.length - 2, '*');
  
    const domain = domainArray[0];
    domainArray[0] = obfuscate(domain, 1, domain.length - 2, '*');
  
    emailArray[emailArray.length - 1] = domainArray.join('.');
  
    return emailArray.join('@');
  };
