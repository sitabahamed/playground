const LOWERCASE_WORDS = {
  ap: ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'with'],
  chicago: ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'with'],
  apa: ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'with'],
  apa7: ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'with']
};

function capitalizeWord(word) {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function capitalizeTitleCase(text, style = 'title') {
  if (!text || text.trim().length === 0) return text;

  const words = text.split(/(\s+)/);
  const lowercaseWords = LOWERCASE_WORDS[style] || LOWERCASE_WORDS.ap;

  return words.map((word, index) => {
    if (!/\S/.test(word)) return word; // preserve whitespace

    const cleanWord = word.toLowerCase();
    const isFirst = index === 0;
    const isLast = index === words.length - 1;

    if ((isFirst || isLast) || !lowercaseWords.includes(cleanWord)) {
      return capitalizeWord(word);
    }

    return word.toLowerCase();
  }).join('');
}

function sentenceCase(text) {
  if (!text || text.trim().length === 0) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function camelCase(text) {
  if (!text || text.trim().length === 0) return text;
  return text
    .split(/\s+/)
    .map((word, index) => {
      const clean = word.replace(/[^\w]/g, '');
      return index === 0
        ? clean.toLowerCase()
        : capitalizeWord(clean);
    })
    .join('');
}

function pascalCase(text) {
  if (!text || text.trim().length === 0) return text;
  return text
    .split(/\s+/)
    .map(word => capitalizeWord(word.replace(/[^\w]/g, '')))
    .join('');
}

export function capitalizeTitle(text, style = 'title') {
  switch (style) {
    case 'ap':
    case 'chicago':
    case 'apa':
    case 'apa7':
    case 'title':
      return capitalizeTitleCase(text, style);
    case 'sentence':
      return sentenceCase(text);
    case 'camel':
      return camelCase(text);
    case 'pascal':
      return pascalCase(text);
    case 'lowercase':
      return text.toLowerCase();
    case 'uppercase':
      return text.toUpperCase();
    default:
      return capitalizeTitleCase(text);
  }
}

export const styles = {
  title: { label: 'Title Case', description: 'Capitalize Each Word' },
  ap: { label: 'AP Style', description: 'Associated Press Style' },
  chicago: { label: 'Chicago Style', description: 'Chicago Manual of Style' },
  apa: { label: 'APA Style', description: 'American Psychological Association' },
  sentence: { label: 'Sentence Case', description: 'Capitalize First Word Only' },
  camel: { label: 'camelCase', description: 'No Spaces, Second Word Capitalized' },
  pascal: { label: 'PascalCase', description: 'No Spaces, All Words Capitalized' },
  lowercase: { label: 'lowercase', description: 'All Lowercase' },
  uppercase: { label: 'UPPERCASE', description: 'All Uppercase' }
};
