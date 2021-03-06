const Command = require(`${process.cwd()}/base/Command.js`);

class balance extends Command {
  constructor(client) {
    super(client, {
      name: "balance",
      description: "Check how much money you have!",
      usage: "balance",
      aliases: ["bal"],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    let dbUser = (await bot.database.users.get(msg.author.id)) || {};
    if (dbUser.balance) {
      msg.reply("your current balance is " + dbUser.balance + " credits!");
    } else {
      msg.reply("your balance is 0! Please claim your dailies if you are able to do so to play!");
    }
  }
}

module.exports = balance;
