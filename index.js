module.exports = robot => {
  robot.on(['issues.opened', 'installation.created'], async context => {
    const branch = 'adds-config' // your branch's name
    //let content = "numbers: 60\nlabels\n  - pinned\n  - security\nexemptMilestones: false"
    const content = Buffer.from('content for the config file!!').toString('base64') // content for your configuration file

    const reference = await context.github.gitdata.getReference(context.repo({ ref: 'heads/master' })) // get the reference for the master branch

    const getBranch = await context.github.gitdata.createReference(context.repo({
      ref: `refs/heads/${ branch }`,
      sha: reference.data.object.sha
    })) // create a reference in git for your branch

    const file = await context.github.repos.createFile(context.repo({
      path: '.github/config.yml', // the path to your config file
      message: 'adding config', // a commit message
      content,
      branch
    })) // create your config file

    return await context.github.pullRequests.create(context.repo({
      title: 'Adds Probot App config file', // the title of the PR
      head: branch,
      base: 'master', // where you want to merge your changes
      body: 'Adding your configuration options! -Love your Probot App', // the body of your PR,
      maintainer_can_modify: true // allows maintainers to edit your app's PR
    }))
  })
}
