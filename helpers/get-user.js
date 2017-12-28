function getUser (T, id, interval = 5 * 60 * 1000) {
  return new Promise((resolve, reject) => {
    T.get('users/show', { user_id: id }, (err, user, response) => {
      if (err) {
        if (err.message === 'Rate limit exceeded') {
          setTimeout(() => {
            return resolve(getUser(T, id, interval))
          }, interval)
        } else {
          return reject(err)
        }
      } else {
        return resolve({
          id: user.id_str,
          name: user.name,
          screen_name: user.screen_name,
          profile_image_url: user.default_profile_image ? null : user.profile_image_url.replace('_normal', '')
        })
      }
    })
  })
}

module.exports = getUser
