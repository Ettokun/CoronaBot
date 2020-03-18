const Command = require(`${process.cwd()}/base/Command.js`);

class eightball extends Command {
  constructor(client) {
    super(client, {
      name: "8ball",
      description: "Rolls a virtual 8ball in response to a question.",
      usage: "8ball <question>",
      aliases: ["8b"],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    if (args.join() == "") return msg.reply("please ask a question!");
    var predictions = [
      "it is certain",
      "it is decidedly so",
      "without a doubt",
      "yes definitely",
      "you may rely on it",
      "as I see it, yes",
      "most likely",
      "outlook good",
      "yes",
      "signs point to yes",
      "reply hazy try again",
      "ask again later",
      "better not tell you now",
      "cannot predict now",
      "concentrate and ask again",
      "don't count on it",
      "my reply is no",
      "my sources say no",
      "outlook not so good",
      "very doubtful"
    ];
    msg.reply(
      predictions[Math.floor(Math.random() * (predictions.length - 0))]
    );
  }
}

module.exports = eightball;
