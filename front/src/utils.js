
const isDebug = () => (process.env.NODE_ENV !== 'production' &&
  process.env.NODE_ENV !== 'test' &&
  typeof console !== 'undefined')

const getIconUrl = function (user) {
  return `https://static.selelab.com/profile-images/${user.icon_media_key}`
}

export { getIconUrl, isDebug }
