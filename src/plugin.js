const { createParserOpts } = require('./conventional-changelog/parser-opts');
const { createWriterOpts } = require('./conventional-changelog/writer-opts');
const { createConventionalRecommendedBumpOpts } = require('./conventional-changelog/conventional-recommended-bump');
const { createConventionalChangelogOpts } = require('./conventional-changelog/conventional-changelog');

async function createPreset() {
  const parserOpts = createParserOpts();

  const [writerOpts, recommendedBumpOpts] = await Promise.all([
    createWriterOpts(),
    createConventionalRecommendedBumpOpts(parserOpts)
  ]);

  const conventionalChangelog = createConventionalChangelogOpts(parserOpts, writerOpts);

  return {
    parserOpts,
    writerOpts,
    recommendedBumpOpts,
    conventionalChangelog
  };
}

module.exports = createPreset;
