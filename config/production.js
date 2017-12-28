const config = {
  bot: {
    userName: 'unfollow_bot',
    token: '123456789:xxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },
  twitter: {
    tokens: {
      consumer_key: 'xxxxxxxxxxxxxxxxxxxxxxxxx',
      consumer_secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      access_token: '12345678-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      access_token_secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      timeout_ms: 60 * 1000
    }
  },
  jobRatio: 10,
  env: 'production',
  maxFollowers: 20000,
  dbPersistenceInterval: 5 * 60 * 1000,
  logger: {
    logLevel: 'warn'
  }
}

module.exports = config
