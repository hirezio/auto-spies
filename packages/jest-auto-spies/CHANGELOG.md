# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@2.0.0...jest-auto-spies@3.0.0) (2023-06-03)

### Bug Fixes

- **types:** typesafety for mocked objects/functions ([d1ffbac](https://github.com/hirezio/auto-spies/commit/d1ffbac0df82f9c54081e8ef5acc3b4bf0b288c5)), closes [#51](https://github.com/hirezio/auto-spies/issues/51)

### BREAKING CHANGES

- **types:** "mockReturnValue" for a function that returns a number no longer accepts something
  that's not a number

# [2.0.0](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@1.6.11...jest-auto-spies@2.0.0) (2023-03-28)

### chore

- **jest-auto-spies:** require jest v29 ([65c1c20](https://github.com/hirezio/auto-spies/commit/65c1c20ad7cdb7887ccb43c3e659daccf222e7bb)), closes [#68](https://github.com/hirezio/auto-spies/issues/68)
- update dependencies (jest@29.5.0) ([dd040ae](https://github.com/hirezio/auto-spies/commit/dd040ae34076791134df3e9b6e4259a6d3c49e48)), closes [#68](https://github.com/hirezio/auto-spies/issues/68)

### BREAKING CHANGES

- **jest-auto-spies:** min. jest version is 29.0.0
- Jest v29.5.0 is required

## [1.6.11](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@1.6.10...jest-auto-spies@1.6.11) (2023-03-01)

**Note:** Version bump only for package jest-auto-spies

## [1.6.10](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@1.6.9...jest-auto-spies@1.6.10) (2022-07-07)

**Note:** Version bump only for package jest-auto-spies

## [1.6.9](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@1.6.8...jest-auto-spies@1.6.9) (2022-01-01)

**Note:** Version bump only for package jest-auto-spies

## [1.6.8](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@1.6.7...jest-auto-spies@1.6.8) (2022-01-01)

**Note:** Version bump only for package jest-auto-spies

## [1.6.7](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@1.6.6...jest-auto-spies@1.6.7) (2021-12-31)

**Note:** Version bump only for package jest-auto-spies

## [1.6.6](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@1.6.5...jest-auto-spies@1.6.6) (2021-08-04)

**Note:** Version bump only for package jest-auto-spies

## [1.6.5](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@1.6.4...jest-auto-spies@1.6.5) (2021-06-09)

### Bug Fixes

- **global:** fix observable props nextWithValues not working ([6fddf74](https://github.com/hirezio/auto-spies/commit/6fddf74a1cb3ffc182e8353b3ce113e0022d1bb4)), closes [#49](https://github.com/hirezio/auto-spies/issues/49)

## [1.6.4](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@1.6.3...jest-auto-spies@1.6.4) (2021-06-09)

**Note:** Version bump only for package jest-auto-spies

## [1.6.3](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@1.6.2...jest-auto-spies@1.6.3) (2021-02-04)

### Bug Fixes

- **auto-spies-core:** don't add getters to method names when creating spies from class ([41e43c7](https://github.com/hirezio/auto-spies/commit/41e43c76d4b494ec7e57cdc075ef0339c69435db)), closes [#40](https://github.com/hirezio/auto-spies/issues/40)

## [1.6.2](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@1.6.1...jest-auto-spies@1.6.2) (2021-01-18)

### Bug Fixes

- **global:** fix multi calledWith bug ([777fc59](https://github.com/hirezio/auto-spies/commit/777fc59a3fc2cff80787bed37c385d1f2e664704)), closes [#39](https://github.com/hirezio/auto-spies/issues/39)

## [1.6.1](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@1.6.0...jest-auto-spies@1.6.1) (2020-12-22)

**Note:** Version bump only for package jest-auto-spies

# [1.6.0](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@1.5.0...jest-auto-spies@1.6.0) (2020-12-22)

### Features

- **global:** add `provideAutoSpy` util for Angular tests ([c0680f7](https://github.com/hirezio/auto-spies/commit/c0680f79af1e62a35ff65d96a6ffdb4d127abb7c)), closes [#26](https://github.com/hirezio/auto-spies/issues/26)

# [1.5.0](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@1.4.0...jest-auto-spies@1.5.0) (2020-12-20)

### Features

- **global:** add `createObservableWithValues` ([d2966f1](https://github.com/hirezio/auto-spies/commit/d2966f1db54dba5adcf2ee051ba0962eb9c14e7c))

# [1.4.0](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@1.3.0...jest-auto-spies@1.4.0) (2020-12-18)

### Features

- **global:** add `nextWithValues` ([de3c30b](https://github.com/hirezio/auto-spies/commit/de3c30b6c6bcc54db6c95f8247ed0bdd5c918493)), closes [#20](https://github.com/hirezio/auto-spies/issues/20)

# [1.3.0](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@1.2.1...jest-auto-spies@1.3.0) (2020-12-14)

### Features

- **global:** modify `nextWithPerCall` to return subjects and complete ([8d2b107](https://github.com/hirezio/auto-spies/commit/8d2b107b6c713773e5073ff8c22e3db58cbbcb51))

## [1.2.1](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@1.2.0...jest-auto-spies@1.2.1) (2020-12-14)

**Note:** Version bump only for package jest-auto-spies

# [1.2.0](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@1.1.1...jest-auto-spies@1.2.0) (2020-12-13)

### Features

- **global:** add `resolveWithPerCall` and `nextWithPerCall` ([aaf2de8](https://github.com/hirezio/auto-spies/commit/aaf2de83fe9edc02dfc81da5e4b617343ea3b4b0))

## [1.1.1](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@1.1.0...jest-auto-spies@1.1.1) (2020-11-19)

### Bug Fixes

- **global:** fix null return value bug ([a9bb0a9](https://github.com/hirezio/auto-spies/commit/a9bb0a988d913f3a1192d736a583c34fbc5aefb1)), closes [#38](https://github.com/hirezio/auto-spies/issues/38)

# [1.1.0](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@1.0.3...jest-auto-spies@1.1.0) (2020-10-19)

### Features

- **global:** printing function name in error when mustBeCalledWith is configured ([b5e0dbd](https://github.com/hirezio/auto-spies/commit/b5e0dbdf812d4c45f8109397e5aa4d33ffc37d82)), closes [#27](https://github.com/hirezio/auto-spies/issues/27)

## [1.0.3](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@1.0.2...jest-auto-spies@1.0.3) (2020-10-01)

**Note:** Version bump only for package jest-auto-spies

## [1.0.2](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@1.0.1...jest-auto-spies@1.0.2) (2020-09-16)

**Note:** Version bump only for package jest-auto-spies

## [1.0.1](https://github.com/hirezio/auto-spies/compare/jest-auto-spies@1.0.0...jest-auto-spies@1.0.1) (2020-09-10)

### Bug Fixes

- **global:** add .npmignore ([b6f8ff7](https://github.com/hirezio/auto-spies/commit/b6f8ff7008634c377d541803beaf0d3068343a8b))

# 1.0.0 (2020-09-10)

### Features

- **jest-auto-spies:** added jest-auto-spies ([5bd3102](https://github.com/hirezio/auto-spies/commit/5bd31023064288a0589677192620650b295984a0))
