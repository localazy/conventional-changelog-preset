<p align="center">
  <a href="https://localazy.com">
    <img src="https://localazy.com/directus9/assets/9fc36b9c-81b7-4dbf-bd82-b64cd984090f" width="285" height="50" alt="Localazy" >
  </a>
</p>

# 📦 @localazy/conventional-changelog-preset

Plugin for [`conventional-changelog`](https://github.com/conventional-changelog/conventional-changelog) with support for
emoji commits and squashed PRs.

## 🔧 Installation

```bash
npm i -D conventional-changelog \
conventional-changelog-cli \
conventional-recommended-bump@9 \
https://github.com/localazy/conventional-changelog-preset.git \
https://github.com/localazy/conventional-changelog-writer.git
```

## 🚀 Usage

```bash
# show cli help
npx conventional-changelog --help
```

```bash
# regenerate whole changelog
npx conventional-changelog -p @localazy/preset -i CHANGELOG.md -s -r 0
```

```bash
# add latest release to changelog
npx conventional-changelog -p @localazy/preset -i CHANGELOG.md -s -r 1
```

```bash
# preview unreleased changelog
npx conventional-changelog -p @localazy/preset -u
```

```bash
# preview recommended bump: patch|minor|major
npx conventional-recommended-bump -p @localazy/conventional-changelog-preset
```

## 🔨 Configuration

You can create `.changelogrc.json` file in your root folder to extend or create additional emoji groups. Look at
the [default configuration file](src/config/default-config.js) for reference. Use `type` property as identifier when
extending existing configuration.

```json
{
  "emojis": [
    {
      "type": "feat",
      "emojiAliases": [
        "🌟",
        "💫",
        "🌠",
        "💙"
      ]
    }
  ]
}
```

## 🎉 Available Emojis

<!-- emoji-table -->

| Emoji | Aliases    | Type       | Type Aliases                    | Version Bump | In Changelog? | Heading             | Order |
|-------|------------|------------|---------------------------------|--------------|---------------|---------------------|-------|
| 💥    |            | `breaking` |                                 | major        | ✅             | 💥 Breaking Changes | 10    |
| ✨     | 🌟, 💫, 🌠 | `feat`     | `feature`                       | minor        | ✅             | ✨ Features          | 20    |
| ⚡️    |            | `perf`     | `performance`                   | patch        | ✅             | ⚡️ Performance      | 30    |
| 🐛    | 🐞, 🚑, 🚨 | `fix`      | `fixes`, `hotfix`, `hotfixes`   | patch        | ✅             | 🐛 Bug Fixes        | 40    |
| 📚    | 📖, 📝     | `docs`     | `doc`                           | patch        | ✅             | 📚 Documentation    | 50    |
| 🧪    | ✅, 🚦      | `test`     | `tests`                         | patch        | ✅             | 🧪 Tests            | 60    |
| ♻️    | 🦄         | `refactor` |                                 | patch        | ✅             | 🧰 Other Commits    | 70    |
| 💄    | 🎨, 🌈     | `style`    | `cleanup`, `format`             | patch        | ✅             | 🧰 Other Commits    | 71    |
| 🔧    | ⚙️, 🏗, ⬆️ | `chore`    | `chores`, `deps`, `build`, `ci` | patch        | ✅             | 🧰 Other Commits    | 72    |
| 🚀    |            | `release`  |                                 | patch        |               |                     | 1000  |

<!-- emoji-table -->

## 📋 TODO

- [ ] Fix bad order for breaking changes
- [ ] Detect breaking changes from squashed PR (is it even possible?)

## 📜 License

Code released under the [MIT license](LICENSE).
