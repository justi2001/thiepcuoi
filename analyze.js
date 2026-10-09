const fs = require('fs');

const stream = fs.readFileSync('next_stream.txt', 'utf8');

// Search for any JSON objects or props
const urls = [...stream.matchAll(/https?:\/\/[^\s"',\\}{]+/g)].map(m => m[0]);
console.log('URLs in stream:', [...new Set(urls)]);

// Find vietnamese words or text
const vietnameseMatches = stream.match(/[\p{L}\p{N}\s,.:!?'"-]{4,}/gu) || [];
const interestingText = vietnameseMatches
  .map(t => t.trim())
  .filter(t => t.length > 5 && !t.includes('chakra') && !t.includes('class') && !t.includes('module'))
  .slice(0, 100);

console.log('Sample text snippets:', interestingText.slice(0, 30));

// Check if there is data fetched from an API endpoint
const apis = urls.filter(u => u.includes('api') || u.includes('mehappy') || u.includes('json'));
console.log('API / Domain URLs:', apis);
