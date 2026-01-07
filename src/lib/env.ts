export const withBasePath = (originalPath: string) => {
  return (
    process.env.ENV === 'production' ? '/fumadocs-template' + originalPath : originalPath
  ).replace(/\/\//g, '/')
}
