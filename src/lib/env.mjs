export const withBasePath = originalPath => {
  return (
    process.env.NODE_ENV === 'production' ? '/fumadocs-template' + originalPath : originalPath
  ).replace(/\/\//g, '/')
}
