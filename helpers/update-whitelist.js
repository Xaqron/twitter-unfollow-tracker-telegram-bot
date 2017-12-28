const config = require('../config')
const getWhitelist = require('./get-whitelist')
const logger = require('../utils/logger')

async function updateWhitelist (db, T) {
  let newUsers = null
  try {
    newUsers = await getWhitelist(T, config.owner)
  } catch (err) {
    logger.error(`Error retrieving whitelist: ${err}`)
  }
  db.count({}, (err, count) => {
    if (err) {
      logger.error(`Error while counting db: ${err}`)
    } else {
      if (count > 0) {
        const data = db.getAllData()
        const updated = newUsers.map((x) => {
          let result = data.filter(y => y.id === x.id)
          if (result.length > 0) {
            x.chats = result[0].chats
            x.followers = result[0].followers
          }
          return x
        })
        db.remove({}, {multi: true}, (err, n) => {
          if (err) {
            console.log(`Error removing all data: ${err}`)
          } else {
            db.insert(updated, (err, newDoc) => {
              if (err) {
                console.log(`Error inserting updated whitelist: ${err}`)
              }
            })
          }
        })
      } else {
        db.insert(newUsers, (err, newDoc) => {
          if (err) {
            logger.error(`Error while inserting whitelist: ${err}`)
          } else {
            logger.info(`db created with ${newDoc.length} users.`)
          }
        })
      }
    }
  })
}

module.exports = updateWhitelist
