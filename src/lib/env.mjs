export const withBasePath = originalPath => {
  return (
    process.env.ENV === 'production' ? '/fumadocs-template' + originalPath : originalPath
  ).replace(/\/\//g, '/')
}
