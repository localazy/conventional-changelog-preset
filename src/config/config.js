const { cosmiconfigSync } = require('cosmiconfig');
const defaultConfig = require('./default-config');
const config = { ...defaultConfig };

function customConfigLoader(config, customGroups) {
  if (!customGroups || customGroups.length === 0) {
    return;
  }

  customGroups.forEach((customGroup) => {
    const originalGroup = config.emojis.find(group => group.type === customGroup.type);

    if (originalGroup === undefined) {
      config.emojis.push(customGroup);
      return;
    }

    Object.assign(originalGroup, customGroup);
  });
}

const explorer = cosmiconfigSync('changelog');
const detectedFile = explorer.search();

if (detectedFile) {
  customConfigLoader(config, detectedFile.config);
}

module.exports = config;
