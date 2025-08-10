const { readFile } = require('fs').promises;
const { resolve } = require('path');
const groups = require('./groups');
const config = require('../config/config');
const { orderBy } = require('lodash');

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
  writerOpts.finalizeContext = finalizeContext;

  return writerOpts;
}

function finalizeContext(context, options, filteredCommits, keyCommit, commits) {
  if (context.commitGroups) {
    context.commitGroups.forEach((group) => {
      group.commits = orderBy(group.commits, ['pr.id', 'scope', 'subject'], ['desc', 'asc', 'asc']);
    });
    context.prList = orderBy(context.prList, ['id'], ['desc']);
  }
  return context;
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

      if (isSquashedMerge) {
        // Single commit squash merge
        // LOC branch squash merge
        const commits = unSquash(commit, breakingHeading, context);

        if (commits.length === 0) {
          return null;
        }

        return commits;
      } else if (hasValidType) {
        // Merge pull requests
        return transformCommit(commit, breakingHeading, context);
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
  return hasSquashedHash(commit.header);
}

function hasSquashedHash(str) {
  return /^.+ \(#\d+\)$/gm.test(str);
}

function extractPullRequestId(commit) {
  const regex = /^.+ \(#(\d+)\)$/gm
  const result = regex.exec(commit.header)

  if (result && result.length > 1) {
    return result[1];
  }

  return null;
}

function extractPullRequestName(commit) {
  const str = commit.subject || commit.header;
  return removeSquashedHash(str);
}

function removeSquashedHash(str) {
  const regex = /^(.+) \(#\d+\)$/gm
  const result = regex.exec(str)

  if (result && result.length > 1) {
    return result[1];
  }

  return null;
}

function generatePullRequestUrl(id, context) {
  if (id) {
    return `${context.host}/${context.owner}/${context.repository}/pull/${id}`
  }

  return null;
}

function unSquash(squashedCommit, breakingHeading, context) {
  const prID = extractPullRequestId(squashedCommit);
  const prName = extractPullRequestName(squashedCommit);
  const str = squashedCommit.body || squashedCommit.footer || squashedCommit.header
  const chunks = str.split('\n');
  const commits = [];

  chunks.forEach((chunk) => {
    const match = chunk.match(/(<a?:.+?:\d{18}>|\p{Extended_Pictographic})?\s*(\w+)\(*(.*?)\)*:\s*(.*)/u);

    if (match === null) {
      return;
    }

    const emoji = match[1];
    const parsedType = match[2];
    const scope = match[3] || null;
    let subject = match[4];
    if (hasSquashedHash(subject)) {
      subject = removeSquashedHash(subject)
    }
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
        pr: {
          id: prID,
          name: prName,
          url: generatePullRequestUrl(prID, context),
        },
        hash: squashedCommit.hash,
        gitTags: squashedCommit.gitTags,
        committerDate: squashedCommit.committerDate
      },
      breakingHeading,
      context
    );

    if (commit) {
      commits.push(commit);
    }
  });

  return commits;
}

function transformCommit(commit, breakingHeading, context) {
  const group = groups.findGroupByType(commit.parsedType) || groups.findGroupByEmoji(commit.emoji);

  if (group === null || !group.inChangelog) {
    return null;
  }

  if (commit.pr?.id) {
    if (!context.prList) {
      context.prList = [];
    }

    const index = context.prList.findIndex(i => i.id === commit.pr.id)

    if (index === -1) {
      context.prList.push(commit.pr)
    }
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
