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
        const commitEmojiGroup = groups.findGroupByEmoji(commit.emoji);
        const commitTypeGroup = groups.findGroupByType(commit.parsedType);

        const isBreaking = (commitEmojiGroup && commitEmojiGroup.type === 'breaking') || (commitTypeGroup && commitTypeGroup.type === 'breaking');
        const isFeature = (commitEmojiGroup && commitEmojiGroup.type === 'feat') || (commitTypeGroup && commitTypeGroup.type === 'feat');

        if (isBreaking) {
          // Breaking changes in commit message (emoji)
          breaking += 1;
          level = 0;
        } else if (isFeature) {
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
