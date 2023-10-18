module.exports = {
  showEmojiPerCommit: false,
  emojis: [
    {
      emoji: '🚨',
      emojiAliases: [],
      type: 'breaking',
      typeAliases: [],
      bump: 'major',
      inChangelog: true,
      heading: '🚨 Breaking Changes',
      index: 10
    },
    {
      emoji: '✨',
      emojiAliases: ['🌟', '💫', '🌠'],
      type: 'feat',
      typeAliases: ['feature'],
      bump: 'minor',
      inChangelog: true,
      heading: '✨ Features',
      index: 20
    },
    {
      emoji: '⚡️',
      emojiAliases: [],
      type: 'perf',
      typeAliases: ['performance'],
      bump: 'patch',
      inChangelog: true,
      heading: '⚡️ Performance',
      index: 30
    },
    {
      emoji: '🐛',
      emojiAliases: ['🐞', '🚑'],
      type: 'fix',
      typeAliases: ['fixes'],
      bump: 'patch',
      inChangelog: true,
      heading: '🐛 Bug Fixes',
      index: 40
    },
    {
      emoji: '📚',
      emojiAliases: ['📖', '📝'],
      type: 'docs',
      typeAliases: ['doc'],
      bump: 'patch',
      inChangelog: true,
      heading: '📚 Documentation',
      index: 50
    },
    {
      emoji: '🧪',
      emojiAliases: ['✅', '🚦'],
      type: 'test',
      typeAliases: ['tests'],
      bump: 'patch',
      inChangelog: true,
      heading: '🧪 Tests',
      index: 60
    },
    {
      emoji: '♻️',
      emojiAliases: ['🦄'],
      type: 'refactor',
      typeAliases: [],
      bump: 'patch',
      inChangelog: true,
      heading: '🧰 Other Commits',
      index: 70
    },
    {
      emoji: '💄',
      emojiAliases: ['🎨', '🌈'],
      type: 'style',
      typeAliases: ['cleanup', 'format'],
      bump: 'patch',
      inChangelog: true,
      heading: '🧰 Other Commits',
      index: 71
    },
    {
      emoji: '🔧',
      emojiAliases: ['⚙️', '🏗', '⬆️'],
      type: 'chore',
      typeAliases: ['chores', 'deps', 'build', 'ci'],
      bump: 'patch',
      inChangelog: true,
      heading: '🧰 Other Commits',
      index: 72
    },
    {
      emoji: '🚀',
      emojiAliases: [],
      type: 'release',
      typeAliases: [],
      bump: 'patch',
      inChangelog: false,
      index: 1000
    }
  ],
  rules: {
    'emoji-from-type': true,
    'emoji-known': true,
    'emoji-require': true,
    'spaces-between': true,
    'header-full-stop': false,
    'header-max-length': false,
    'subject-case': [2, { case: 'sentence-case' }],
    'subject-require': true,
    'body-leading-blank': true
  }
};
