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
  jobRatio: 2,
  owner: 'xaqron',
  env: 'development',
  maxFollowers: 20000,
  dbPersistenceInterval: 30000,
  admins: {
    ids: [],
    chatIds: []
  },
  logger: {
    maxDays: '90',
    logLevel: 'debug',
    logFolder: 'logs',
    logFileExtension: 'log',
    datePattern: 'yyyy-MM-dd.',
    fileName: 'av.log',
    logUnhandledExceptions: true,
    logUnhandledExceptionsFileName: 'exceptions.log'
  }
}

module.exports = config
