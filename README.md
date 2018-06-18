# create-pr-on-install

> A GitHub Extension built with [Probot](https://github.com/probot/probot) that helps you create a pull request against a repo your app is installed on.

## Setup

To use this extension, require the npm module 'create-pr-on-install'. Then call
it by passing in the `context`, as well as an object containing information
specific to your app.

``` js
const createPR = require('create-pr-on-install')

module.exports = robot => {
  robot.on('installation.created', context => {
    // This extension can open PRs with new files at any point in time, but this
    // use case demonstrates creating one when the app is first installed on a repo
    const openPR = await createPR(context, {
      fields = {
        file: {
          path: 'path/to/file.yml',
          content: 'This is what will be in the file'
        },
        pr : {
          body: 'The body of your Pull request',
          title: 'The title of your Pull Request'
        }
      }
    })
  })
}
```

## Contributing

If you have suggestions for how create-pr-on-install could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2018 Bex Warner <bexmwarner@gmail.com> (https://github.com/hiimbex/create-pr-on-installation)
