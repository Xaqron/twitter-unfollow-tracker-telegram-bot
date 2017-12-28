const path = require('path')
const Twit = require('twit')
const Datastore = require('nedb')
const config = require('../config')
const expect = require('chai').expect
const assert = require('chai').assert
const whitelist = require('../helpers/whitelist')
const db = new Datastore({
  filename: path.join(__dirname, '../data/whitelist.json'),
  autoload: true
})
db.persistence.setAutocompactionInterval(100)
const T = new Twit(config.twitter.tokens)

/* global describe it */

describe('while list', () => {
  it('building list', async () => {
    let followers = null
    try {
      followers = await whitelist(T, config.whitelistSource)
    } catch (err) {
      assert.fail(err, null, 'error retrieving whitelist')
    }
    const doc = { update: new Date(), users: followers }
    db.insert(doc, (err, newDoc) => {
      if (err) {
        console.log(err)
      } else {
        console.log(newDoc)
      }
    })
  }).timeout(0) // disabled
})
