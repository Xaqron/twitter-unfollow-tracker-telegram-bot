function getWhitelist (T, screenName, interval = 5 * 60 * 1000, followers = [], cursor = -1) {
  return new Promise((resolve, reject) => {
    T.get('followers/list', { screen_name: screenName, cursor: cursor, count: 20 }, (err, data, response) => {
      if (err) {
        if (err.message === 'Rate limit exceeded') {
          setTimeout(() => {
            return resolve(getWhitelist(T, screenName, interval, followers, cursor))
          }, interval)
        } else {
          cursor = -1
          reject(err)
        }
      } else {
        cursor = data.next_cursor
        followers.push(data.users.map(user => {
          return {
            id: user.id_str,
            name: user.name,
            updated: new Date(),
            protected: user.protected,
            screen_name: user.screen_name,
            followers_count: user.followers_count,
            chats: [],
            followers: []
          }
        }))
        if (cursor > 0) {
          return resolve(getWhitelist(T, screenName, interval, followers, cursor))
        } else {
          return resolve([].concat(...followers))
        }
      }
    })
  })
}

module.exports = getWhitelist
