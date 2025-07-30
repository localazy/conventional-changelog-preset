const groups = require('./groups');

function createParserOpts() {
  return {
    headerPattern: /^(\p{Extended_Pictographic}?)\s*(\w+)(?:\(([^)]+)\))?:\s*(.+)$/u,
    headerCorrespondence: ['emoji', 'parsedType', 'scope', 'subject'],
    noteKeywords: [
      'BREAKING CHANGE',
      'BREAKING CHANGES',
      ...groups.breakingEmojis
    ]
  };
}

module.exports.createParserOpts = createParserOpts;
