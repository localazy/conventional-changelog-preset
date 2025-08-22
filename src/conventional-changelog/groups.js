const groups = require('../config/config').emojis;

function getAll() {
  return groups;
}

function findGroupByEmoji(emoji) {
  const group = groups.find((g) =>
    g.emoji === emoji ||
    g.emojiAliases.indexOf(emoji) !== -1 ||
    (g.textAliases && g.textAliases.indexOf(emoji) !== -1)
  );

  return group ? group : null;
}

function findGroupByType(type) {
  const group = groups.find((g) => g.type === type || g.typeAliases.indexOf(type) !== -1);

  return group ? group : null;
}

function findGroupByHeading(heading) {
  const group = groups.find((g) => g.heading === heading);

  return group ? group : null;
}

function emojisByBump(bump) {
  const types = groups.filter(e => e.bump === bump);
  return types.reduce((emojis, type) => {
    emojis.push(type.emoji, ...type.emojiAliases);
    if (type.textAliases) {
      emojis.push(...type.textAliases);
    }
    return emojis;
  }, []);
}

module.exports = {
  getAll,
  findGroupByEmoji,
  findGroupByType,
  findGroupByHeading,
  featureEmojis: emojisByBump('minor'),
  breakingEmojis: emojisByBump('major')
};
