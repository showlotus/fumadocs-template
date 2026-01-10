export const withBasePath = (originalPath: string) => {
  return (
    process.env.NODE_ENV === 'production' ? '/fumadocs-template' + originalPath : originalPath
  ).replace(/\/\//g, '/')
}
