const groups = require('./groups');

function createParserOpts() {
  return {
    headerPattern: /^((?:\p{Extended_Pictographic}[\uFE0F\uFE0E]?(?:\u200D\p{Extended_Pictographic}[\uFE0F\uFE0E]?)*|[\p{Regional_Indicator}]{2}|(?::[a-z0-9_+-]+:)+)\s*)?(\w+)\s*\(*(.*?)\)*:\s*(.*)$/u,
    headerCorrespondence: ['emoji', 'parsedType', 'scope', 'subject'],
    noteKeywords: [
      'BREAKING CHANGE',
      'BREAKING CHANGES',
      ...groups.breakingEmojis
    ]
  };
}

module.exports.createParserOpts = createParserOpts;
