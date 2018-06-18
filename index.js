module.exports = async openPR(context, fields) => {
  const branch = `add-${fields.file.path}` // your branch's name
  const content = Buffer.from(fields.file.content).toString('base64') // content for your configuration file

  const reference = await context.github.gitdata.getReference(context.repo({ ref: 'heads/master' })) // get the reference for the master branch

  const getBranch = await context.github.gitdata.createReference(context.repo({
    ref: `refs/heads/${ branch }`,
    sha: reference.data.object.sha
  })) // create a reference in git for your branch

  const file = await context.github.repos.createFile(context.repo({
    path: fields.file.path, // the path to your config file
    message: `adds ${fields.file.path}`, // a commit message
    content,
    branch
  })) // create your config file

  return await context.github.pullRequests.create(context.repo({
    title: fields.pr.title, // the title of the PR
    head: branch,
    base: 'master', // where you want to merge your changes
    body: fields.pr.body, // the body of your PR,
    maintainer_can_modify: true // allows maintainers to edit your app's PR
  }))
}
