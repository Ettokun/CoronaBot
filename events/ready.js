const Giveaway = require(`${process.cwd()}/util/Giveaway.js`);
const moment = require("moment");

module.exports = class {
  constructor(bot) {
    this.bot = bot;
  }

  async run(bot) {
    setTimeout(function () {
      bot.logger.ready(
        bot.user.username +
        " is ready! Serving " +
        bot.guilds.cache.size +
        " servers."
      );
      bot.user.setActivity("with COVID-19", {
        type: "PLAYING"
      });

      bot.channels.cache.get("689473491359236322").send("`[" + moment().format("YYYY-MM-DD HH:mm:ss") + "]` :loudspeaker: **" + bot.user.tag + "** is online and ready! Serving " + bot.users.cache.size + " quaranteens in " + bot.guilds.cache.size + " servers!");

      /*let cachedMessages = [];
      bot.reactionMessages = {};
      bot.database.reactions.then(async reactions => {
        for (var i = 0; i < reactions.length; i++) {
          for (let channel in reactions[i]) {
            if (channel != "id") {
              for (let message in reactions[i][channel]) {
                await bot.channels.cache.get(channel).messages.fetch(message);
                cachedMessages.push(message);
                bot.reactionMessages[message] = reactions[i][channel][message];
              }
            }
          }
        }

        bot.users.cache
          .get(bot.config.Discord.ownerID)
          .send(
            "Fetched the following messages: ```" +
            JSON.stringify(cachedMessages, null, "\t") +
            "```"
          );
    });

    function birthdays() {
      // bot.users.cache.get(bot.config.Discord.ownerID).send("Checking Birthdays");
      let d = new Date();
      bot.guilds
        .get("688041208806899776")
        .roles.cache.get("517244087817076738")
        .members.forEach(member => {
          member.roles.remove("517244087817076738");
        });
      bot.database.users
        .filter({
          birthday: { day: d.getDate(), month: d.getMonth() + 1 }
        })
        .then(bday => {
          if (bday.length > 0) {
            let bdays = [];
            for (var i = 0; i < bday.length; i++) {
              let user = bot.guilds
                .get("688041208806899776")
                .members.cache.get(bday[i].id);
              if (user) {
                bdays.push(user.user.tag);
                user.roles.add("517244087817076738");
                user.user.send(
                  "Since today is your birthday, you have been given a special role in Self Quaranteens! :tada:"
                );
              }
            }
            bot.users
              .get(bot.config.Discord.ownerID)
              .send(
                "The following users have been given the birthday role: ```" +
                bdays.join(", ") +
                "```"
              );
          }
        });
    }

    birthdays();
    setInterval(function () {
      birthdays();
    }, 1000 * 60 * 60 * 24);*/
    }, 1000);

    var giveaways = await bot.database.giveaways.filter({ winner_object: [] });
    for (var i = 0; i < giveaways.length; i++) {
      let giveaway = giveaways[i];
      let message = await bot.guilds.cache
        .get(giveaways[i].guildID)
        .channels.cache.get(giveaways[i].channelID)
        .messages.fetch(giveaways[i].id);

      new Giveaway(bot, message, giveaway).run();
    }
    bot.logger.debug("successfully restarted giveaways");
  }
};
