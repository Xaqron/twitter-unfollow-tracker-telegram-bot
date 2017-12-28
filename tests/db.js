const path = require('path')
const Datastore = require('nedb')
const expect = require('chai').expect
const assert = require('chai').assert
const db = new Datastore({
  filename: path.join(__dirname, '../data/test-db.json'),
  autoload: true
})
db.persistence.setAutocompactionInterval(100)

/* global describe it */

describe('testing file db', () => {
  it('insert', (done) => {
    const doc = {
      chatId: 1234,
      twitterId: 5678,
      screenName: 'xaqron',
      registered: new Date(),
      followers: [ 1, 2, 3, 4 ]
    }
    db.insert(doc, (err, newDoc) => {
      if (err) {
        console.log(err)
      } else {
        console.log(newDoc)
      }
      done()
    })
  })
  it('find', (done) => {
    db.find({ screenName: 'xaqron' }, (err, docs) => {
      if (err) {
        console.log(`Error reading data file: ${err}`)
      } else {
        expect(docs.length).to.be.greaterThan(0)
        done()
      }
    })
  })
  it('update', (done) => {
    db.update({ screenName: 'xaqron' }, { $set: { chatId: 999 } }, {}, (err, numUpdated) => {
      if (err) {
        console.log(`Error updating data: ${err}`)
      } else {
        expect(numUpdated).to.be.equal(1)
        done()
      }
    })
  })
  it('remove', (done) => {
    db.remove({ screenName: 'xaqron' }, {}, (err, numRemoved) => {
      if (err) {
        console.log(`Error removing data: ${err}`)
      } else {
        assert(numRemoved === 1)
        done()
      }
    })
  })
})
