const { readFile } = require('fs').promises;
const { resolve } = require('path');
const groups = require('./groups');
const config = require('../config/config');

async function createWriterOpts() {
  const [template, header, commit, footer] = await Promise.all([
    readFile(resolve(__dirname, './templates/template.hbs'), 'utf-8'),
    readFile(resolve(__dirname, './templates/header.hbs'), 'utf-8'),
    readFile(resolve(__dirname, './templates/commit.hbs'), 'utf-8'),
    readFile(resolve(__dirname, './templates/footer.hbs'), 'utf-8')
  ]);
  const writerOpts = getWriterOpts();

  writerOpts.mainTemplate = template;
  writerOpts.headerPartial = header;
  writerOpts.commitPartial = commit;
  writerOpts.footerPartial = footer;

  return writerOpts;
}

function commitGroupsSort(commitGroup, otherCommitGroup) {
  const group = groups.findGroupByHeading(commitGroup.title);
  const other = groups.findGroupByHeading(otherCommitGroup.title);
  const regex = /(\p{Extended_Pictographic})/u;

  return group.index === other.index
    ? group.heading
      .replace(regex, '')
      .localeCompare(other.heading.replace(regex, ''), {
        sensitivity: 'base',
        usage: 'sort'
      })
    : group.index - other.index;
}

function getWriterOpts() {
  const breakingHeading = groups.getAll().find(e => e.type === 'breaking').heading;

  return {
    transform(commit, context) {
      const hasValidType = validateParsedType(commit);
      const isSquashedMerge = detectSquashedMerge(commit);

      if (hasValidType && !isSquashedMerge) {
        return transformCommit(commit, breakingHeading);
      }

      if (!hasValidType && isSquashedMerge) {
        const commits = unSquash(commit, breakingHeading);

        if (commits.length === 0) {
          return null;
        }

        return commits;
      }

      return null;
    },
    groupBy: 'type',
    commitGroupsSort,
    commitsSort: ['scope', 'subject'],
    noteGroupsSort: 'title'
  };
}

function validateParsedType(commit) {
  return commit.parsedType !== null && groups.findGroupByType(commit.parsedType) !== null;
}

function detectSquashedMerge(commit) {
  return /(\p{Extended_Pictographic})/u.test(commit.body);
}

function unSquash(squashedCommit, breakingHeading) {
  const chunks = squashedCommit.body.split('\n');
  const regex = /(<a?:.+?:\d{18}>|\p{Extended_Pictographic})\s*(\w+)\(*(\w*)\)*:\s*(.*)/u;
  const commits = [];

  chunks.forEach((chunk) => {
    const match = chunk.match(regex);

    if (match === null) {
      return;
    }

    const emoji = match[1];
    const parsedType = match[2];
    const scope = match[3] || null;
    const subject = match[4];
    const header = scope ? `${emoji} ${parsedType}(${scope}): ${subject}` : `${emoji} ${parsedType}: ${subject}`;
    const commit = transformCommit(
      {
        emoji,
        parsedType,
        scope,
        subject,
        merge: null,
        header,
        body: null,
        footer: null,
        notes: [],
        references: [],
        mentions: [],
        revert: null,
        hash: squashedCommit.hash,
        gitTags: squashedCommit.gitTags,
        committerDate: squashedCommit.committerDate
      },
      breakingHeading
    );

    if (commit) {
      commits.push(commit);
    }
  });

  return commits;
}

function transformCommit(commit, breakingHeading) {
  const group = groups.findGroupByType(commit.parsedType) || groups.findGroupByEmoji(commit.emoji);

  if (group === null || !group.inChangelog) {
    return null;
  }

  commit.type = group.heading;

  commit.notes.forEach(note => {
    note.title = breakingHeading;
  });

  if (commit.emoji && config.showEmojiPerCommit) {
    commit.showEmoji = commit.emoji;
  }

  if (typeof commit.hash === `string`) {
    commit.hash = commit.hash.substring(0, 7);
  }

  return commit;
}

module.exports.createWriterOpts = createWriterOpts;
