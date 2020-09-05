# Contribution Guidelines

We would love for you to contribute to this project.
As a contributor, here are the guidelines we would like you to follow:

## Be Kind - Code of Conduct

Help us keep this project open and inclusive. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md)

## Found a bug? Want a feature? - Please submit an Issue

[Choose an issue template](https://github.com/hirezio/auto-spies/issues/new/choose) to file a bug report / feature request.

## Want to contribute code? please submit a Pull Request (PR), but first...

.

### ✅ 1. [Search this repo first](https://github.com/hirezio/given/pulls)...

for an open or closed PR that relates to the change you want to introduce.

.

### ✅ 2. **Before you start coding - find / create an issue**

**Make sure there's an issue** describing the problem you're fixing, or documents the design for the feature you'd like to add.
Discussing the design up front helps to ensure that we're ready to accept your work.

**Don't waste your time working on code before you got a 👍 in an issue comment.**

.

### ✅ 3. Fork the this repo and create a branch.

Make your changes in a new git branch:

```shell
git checkout -b my-fix-branch master
```

.

### ✅ 4. Make sure you add / modify tests

Run `yarn test:full` to make sure there aren't any errors

.

### ✅ 5. Commit your changes using commitizen:

Instead of `git commit` use the following command:

```shell
yarn commit
```

It will then ask you a bunch of questions.

**For "scope" please choose from the following options:**

| Scope name         | Description                                         |
| ------------------ | --------------------------------------------------- |
| core               | a change related to `@hirez_io/auto-spies-core`     |
| jasmine-auto-spies | a change related to `jasmine-auto-spies`            |
| jest-auto-spies    | a change related to `jest-auto-spies`               |
| global             | any change that doesn't fall under the above scopes |

This will create a descriptive commit message that follows the
[Angular commit message convention](#commit-message-format).

This is necessary to generate meaningful release notes / CHANGELOG automatically.

.

### ✅ 6. Push your branch to GitHub:

```shell
git push origin my-fix-branch
```

.

### ✅ 7. In GitHub, create a pull request for `hirezio/auto-spies:master`.

If you need to update your PR for some reason -

- Make the required updates.

- Re-run the tests to ensure tests are still passing `yarn test:full`

- Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

  ```shell
  git rebase master -i
  git push -f
  ```

.

### ✅ 8. After your pull request is merged - delete your PR branch

After your pull request is merged, you can safely delete your branch and pull the changes from the main (upstream) repository:

- Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

  ```shell
  git push origin --delete my-fix-branch
  ```

- Check out the master branch:

  ```shell
  git checkout master -f
  ```

- Delete the local branch:

  ```shell
  git branch -D my-fix-branch
  ```

- Update your master with the latest upstream version:

  ```shell
  git pull --ff upstream master
  ```

.

### ✅ 9. That's it! Thank you for your contribution! 🙏💓

[commit-message-format]: https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#
