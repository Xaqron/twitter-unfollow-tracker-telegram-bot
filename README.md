# twitter-unfollow-tracker-telegram-bot

Find out who unfollows you without any permission delegation.

**Warning**: Beta version with multiple known issues. :sweat:

## Config

Replace [Twitter](https://apps.twitter.com) and [Telegram](https://t.me/BotFather) tokens of your own in `config/default.js` file.

```js
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
  }
```

## Install

```bash
git clone https://github.com/Xaqron/twitter-unfollow-tracker-telegram-bot.git
cd twitter-unfollow-tracker-telegram-bot
npm install
node tuttb.js
```

### To Do

- [ ] Fix shutdown command.
- [ ] Unit tests.
- [x] Support graphical unfollow Telegram messages.
- [ ] Implement /unsubscribe Telegram bot command.
- [ ] Implement auto backup and send file via telegram to admins.
- [ ] More admin commands.
- [ ] Admin stats.

PRs are welcome.
### Contact [@Xaqron](https://twitter.com/xaqron)