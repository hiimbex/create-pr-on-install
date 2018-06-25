# Quickstart: Getting started with Git Data

## Introduction

GitHub Apps are a way for developers using GitHub to create custom workflows using GitHub’s
REST and GraphQl APIs, while maintaining granular permissions.

One popular platform for building GitHub Apps is Probot, an open source framework that handles
everything from authentication to webhooks for you.

One problem that the Probot community faces is creating configuration settings for GitHub Apps
to be customized on a per-repository basis. In order to solve this problem, we started using
yaml files stored in a `.github/` folder in each repository so that settings could be updated
at any time. We then read this data through a GitHub API call.

As a result, many repositories that install probot apps need to add configuration files to
their repositories. I decided to tackle this issue in the form of a reusable extension to
help developers and wanted to share what I learned with you.

The first thing I did was create a new Probot App.

From here I knew that what I needed to do was open a Pull request creating the a
`.github/config.yml` file; however, creating a pull request actually involved quite a few
moving parts. In order to create a Pull Request, we need to deal with Git Data. The [Git
Database API](https://developer.github.com/v3/git/) gives access to read and write raw
Git objects, essentially creating an API for using git functionality.


### Building your first GitHub App

This guide assumes that you have gone through the original Probot quickstart guide. This means you will already have created a GitHub App, set up your local development environment, successfully run your app, and watched it add a label to an issue.

### Updating App permissions

Since we'll be working with Git Data tryin to open up a new Pull Request, the first thing we'll need to do is update and accept some new permissions for our app.

We'll need to add **Repository contents** read and write permission in order to use git.

## Getting Started with Git Data

### Getting a reference

We’re going to start out using Git Data the simplest way possible in order to best understand
it. The first thing that we need to do is [get a reference](https://developer.github.com/v3/git/refs/#get-a-reference)
In Git, a reference essentially a simple way of refering to a specific point in Git history,
ie `refs/heads/master`, which refers to the current state of the master branch. In our usecase,
we'll assume those using our app have their master branch as their default, although that's not
necessarily true.

```js
// Probot API note: context.repo() => {username: 'hiimbex', repo: 'testing-things'}

const reference = await context.github.gitdata.getReference(context.repo({ ref: 'heads/master' }))
```

### Creating a reference

Now that we have a reference to the current state of master in a repository, we can use this as a
point to branch from and [create a reference](https://developer.github.com/v3/git/refs/#create-a-reference)
which will provide us a place to make our changes.

```js
const branch = `adds-config` // your branch's name

const getBranch = await context.github.gitdata.createReference(context.repo({
  ref: `refs/heads/${ branch }`,
  sha: reference.data.object.sha // accesses the sha from the heads/master reference we got
}))
```

### Creating a File

Now that we have this new reference, we want to go ahead and add our file to the repository. We can do
so using GitHub's [Content API](https://developer.github.com/v3/repos/contents/) which allows us to
[create a file](https://developer.github.com/v3/repos/contents/#create-a-file) which also automatically
creates a commit for us on our branch. We'll assume that the repository this is being installed on
doesn't already have a file in this path.

```js
const file = await context.github.repos.createFile(context.repo({
  path: '.github/comfig.yml', // the path to your config file
  message: 'adds config file', // a commit message
  content: 'message: All your configuration will live in here\n format: All this should be yaml formatting', //the content of your file
  branch // the branch name we used when creating a Git reference
}))
```

At this point, we have the branch, `adds-config`, which has a commit containing the message 'adds config file',
that creates a file `.github/config.yml` which contains our sample file contents. Now we can use all of this
to open our Pull Request. For that we turn to the API endpoint for [creating a Pull Request](https://developer.github.com/v3/pulls/#create-a-pull-request).

```js
return await context.github.pullRequests.create(context.repo({
  title: 'Add Config file!', // the title of the PR
  head: branch, // the branch our chances are on
  base: 'master', // the branch to which you want to merge your changes
  body: 'This PR adds the config file for your new probot app!', // the body of your PR,
  maintainer_can_modify: true // allows maintainers to edit your app's PR to customize their config settings
}))
```

### Troubleshooting

### Conclusion
