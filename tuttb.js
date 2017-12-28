const TelegramBot = require('node-telegram-bot-api')
const path = require('path')
const Twit = require('twit')
const Datastore = require('nedb')
const config = require('./config')
const logger = require('./utils/logger')
const updateFollowers = require('./helpers/update-followers')
const updateWhitelist = require('./helpers/update-whitelist')

logger.info(`unfollow tracker bot started in ${process.env.NODE_ENV} environment`)
const db = new Datastore({ filename: path.join(__dirname, `./data/db.json`), autoload: true })
db.persistence.setAutocompactionInterval(config.dbPersistenceInterval)

const T = new Twit(config.twitter.tokens)
const bot = new TelegramBot(config.bot.token, {polling: true})
let shutDown = false

updateWhitelist(db, T)
  .then(() => {
    bot.on('message', async (msg) => {
      const twitterScreenName = msg.text.trim()
      if (shutDown) {
        bot.sendMessage(msg.chat.id, 'Under maintenance. Come back later.')
          .catch(err => logger.error(`Under maintenance message error: ${err}`))
      } else if (msg.from.is_bot) { // no bot allowed
        logger.warn(`Bot banned. UserId: ${msg.from.id}, UserName: ${msg.from.username}`)
      } else if (msg.chat.type !== 'private') {
        bot.sendMessage(msg.chat.id, 'Groups & channels currently are not supported.')
          .catch(err => logger.error(`'Groups & channels message error: ${err}`))
      } else if (msg.text === '/start') {
        bot.sendMessage(msg.chat.id, `send me Twitter account's screen name:`)
          .catch(err => logger.error(`'Screen name message error: ${err}`))
      } else if (msg.text === '/unsubscribe') {
          // TODO: unsubscribe
      } else if ((msg.text === '/shutdown') && config.admins.ids.includes(msg.from.username)) {
        shutDown = true
      } else if (!msg.text.match(/^[A-Za-z0-9_]{1,15}$/)) {
        bot.sendMessage(msg.chat.id, `Invalid Twitter screen name: ${msg.text}`)
          .catch(err => logger.error(`'Invalid screen name message error: ${err}`))
      } else {
        db.find({ screen_name: twitterScreenName }, (err, docs) => {
          if (err) {
            logger.error(`Error finding ${twitterScreenName}: ${err}`)
          } else {
            if (docs.length > 0) {
              let user = docs[0]
              if (user.followers_count > config.maxFollowers) {
                bot.sendMessage(msg.chat.id, `Sorry, Twitter users with more than ${config.maxFollowers} are not supported currently.\n${twitterScreenName} has ${user.followers_count} followers.`)
                  .catch(err => logger.error(`'Max follower message error: ${err}`))
              } else if (user.protected) {
                bot.sendMessage(msg.chat.id, `${twitterScreenName} account is protected and cannot be tracked.`)
                  .catch(err => logger.error(`'Protected account message error: ${err}`))
              } else {
                if (user.chats.indexOf(msg.chat.id) < 0) {
                  user.chats.push(msg.chat.id)
                  db.update({ screen_name: twitterScreenName }, { $set: { chats: user.chats } }, {}, (err, numUpdated) => {
                    if (err) {
                      logger.error(`Error updating chats: ${err}`)
                    } else {
                      if (numUpdated !== 1) {
                        logger.error(`Corrupted db. Error while updating ${twitterScreenName}. Documents updated: ${numUpdated}`)
                      } else {
                        bot.sendMessage(msg.chat.id, `You have subscribed for: ${twitterScreenName}`)
                          .catch(err => logger.error(`'Subscribe message error: ${err}`))
                      }
                    }
                  })
                } else {
                  bot.sendMessage(msg.chat.id, `You are already subscribed for: ${twitterScreenName}`)
                    .catch(err => logger.error(`'Already subscribed message error: ${err}`))
                }
              }
            } else {
              bot.sendMessage(msg.chat.id, `Sorry, only https://twitter.com/${config.owner} followers can use this service.`)
                .catch(err => logger.error(`'Non-follower message error: ${err}`))
            }
          }
        })
      }
    })
    jobs(config.jobRatio)
  })
    .catch((err) => {
      logger.error(`Error updating whitelist at start: ${err}`)
    })

async function jobs (ratio) {
  if (!shutDown) {
    try {
      await updateWhitelist(db, T)
    } catch (err) {
      logger.error(`Error in updating whitelist: ${err}`)
    }
    if (!shutDown) {
      try {
        await updateFollowers(db, T, bot)
      } catch (err) {
        logger.error(`Error in updating followers: ${err}`)
      }
    }
      // TODO: backup db
      // db.persistence.compactDatafile()
      // send to admin via Telegram
    if (!shutDown) {
      setTimeout(async (ratio) => {
        await jobs(ratio)
          .catch((err) => logger.error(`Error in jobs: ${err}`))
      }, 2 * 60 * 1000)
    }
  }
  if (shutDown) {
    db.persistence.compactDatafile()
    for (let chatId of config.admins.chatIds) {
      logger.info(`Bot has shutdown successfully.`)
      bot.sendMessage(chatId, 'Twitter unfollower tracker bot has shutdown successfully.')
        .catch((err) => {
          logger.error(`Error sending shutdown message: ${err}`)
        })
    }
  }
}
