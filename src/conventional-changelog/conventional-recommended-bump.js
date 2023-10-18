const groups = require('./groups');
const gitSemverTags = require('git-semver-tags');

async function createConventionalRecommendedBumpOpts(parserOpts) {
  const tags = await gitSemverTags();

  return {
    parserOpts,

    whatBump(commits) {
      let level = 2;
      let breaking = 0;
      let features = 0;

      commits.forEach((commit) => {
        if (commit.notes.length > 0) {
          // Breaking changes in commit notes
          breaking += commit.notes.length;
          level = 0;
        } else if (commit.emoji && groups.breakingEmojis.some(emoji => emoji === commit.emoji)) {
          // Breaking changes in commit message (emoji)
          breaking += 1;
          level = 0;
        } else if (commit.emoji && groups.featureEmojis.some(emoji => emoji === commit.emoji)) {
          // Feature commit
          features += 1;
          if (level === 2) {
            level = 1;
          }
        }
      });

      return {
        tag: tags ? tags[0] : '<none>',
        level: level,
        reason: `There are ${breaking} breaking changes and ${features} features.`
      };
    }
  };
}

module.exports.createConventionalRecommendedBumpOpts = createConventionalRecommendedBumpOpts;
