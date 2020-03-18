const Command = require(`${process.cwd()}/base/Command.js`);
var jokes = require("../../data/jokes.json");

class joke extends Command {
  constructor(client) {
    super(client, {
      name: "joke",
      description: "Tells you a random joke!",
      usage: "joke",
      aliases: [],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    var min = 0,
      max = jokes.length - 1;
    msg.reply(jokes[Math.floor(Math.random() * (max - min + 1)) + min].body);
  }
}

module.exports = joke;
