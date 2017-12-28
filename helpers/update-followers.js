const config = require('../config')
const logger = require('../utils/logger')
const getUser = require('./get-user')
const getFollowers = require('twitter-followers')

async function updateFollowers (db, T, bot) {
  const users = db.getAllData()
  for (let user of users) {
    if ((user.chats.length) && (!user.protected) && (user.followers_count <= config.maxFollowers)) {
      let newFollowers = null
      try {
        newFollowers = await getFollowers(T, user.screen_name, 5 * 60 * 1000)
      } catch (err) {
        logger.error(`Error in retrieving followers of userId: ${user.id}, screen name: ${user.screen_name}`)
      }
      db.find({ id: user.id }, (err, docs) => {
        if (err) {
          logger.error(`Error finding userId: ${user.id} (screen name: ${user.screen_name}): ${err}`)
        } else {
          if (docs.length > 0) {
            const dbUser = docs[0]
            const diff = dbUser.followers.filter(follower => !newFollowers.includes(follower))
            db.update({ id: user.id }, { $set: { followers: newFollowers } }, {}, async (err, numUpdated) => {
              if (err) {
                logger.error(`Error updating followers for userId: ${user.id}, (screen name: ${user.screen_name}): ${err}`)
              } else {
                if (numUpdated !== 1) {
                  logger.warning(`Corrupted db. Multiple instances of userId: ${user.id}, (screen name: ${user.screen_name}).`)
                }
                if (diff.length > 0) {
                  for (let chat of user.chats) {
                    for (let unfollowerId of diff) {
                      let unfollower = null
                      try {
                        unfollower = await getUser(T, unfollowerId)
                      } catch (err) {
                        logger.error(`Error retrieving userId: ${user.id}, (screen name: ${user.screen_name}) details: ${err}`)
                      }
                      if (unfollower.profile_image_url) {
                        const txt = `${unfollower.name}\nhttps://twitter.com/${unfollower.screen_name}\n\nunfollowed ${user.screen_name}`
                        bot.sendPhoto(chat, unfollower.profile_image_url, { caption: txt })
                          .catch((err) => {
                            logger.error(`Error sending unfollower message as photo: ${err}`)
                          })
                      } else {
                        bot.sendMessage(chat, `https://twitter.com/${unfollower.screen_name} has unfollowed ${user.screen_name}.`)
                          .catch((err) => {
                            logger.error(`Error sending unfollower message as text: ${err}`)
                          })
                      }
                    }
                  }
                }
              }
            })
          } else {
            logger.warning(`Cannot find userId: ${user.id} (screen name: ${user.screen_name}): ${err}`)
          }
        }
      })
    }
  }
}

module.exports = updateFollowers
