const Command = require(`${process.cwd()}/base/Command.js`);
const fs = require('fs');
const stringSimilarity = require('string-similarity');

class setcollege extends Command {
    constructor(client) {
        super(client, {
            name: "setcollege",
            description: "Set what college you're from!",
            usage: "setcollege <college-name>",
            aliases: [],
            permLevel: 1
        });
    }

    async run(bot, msg, args, level) {
        let colleges = JSON.parse(fs.readFileSync('data/roles.json').toString());

        if (msg.mentions.users.size > 0) {
            var users = msg.mentions.users.array(),
                college = args
                    .splice(msg.mentions.users.size)
                    .join(" ")
                    .trim();

            // finish l8r
        } else {
            let college = args.join(" ");
            let user = await bot.database.users.get(msg.author.id);
            if (user && user.college && level < 2)
                return msg.reply("you have already set your college!");

            let found = -1;

            for (var i = 0; i < colleges.length; i++) {
                if (colleges[i].toLowerCase() == college.toLowerCase()) {
                    found = i;
                }
            }

            if (found < 1) {
                let matches = [stringSimilarity.findBestMatch(college, colleges).bestMatch.target]
                let similar = stringSimilarity.findBestMatch(college, colleges).ratings;
                for (var i = 0; i < similar.length; i++) {
                    if (similar[i] && similar[i].rating > 0.6 && matches.indexOf(similar[i].target) < 0) {
                        matches.push(similar[i].target);
                    }
                }
                return msg.reply("Did you mean: `" + matches.join(", ") + "`? If not, try again or please message one of the mods to add your college :)");
            }

            if (user) {
                await bot.database.users
                    .get(msg.author.id)
                    .update({ id: msg.author.id, college: colleges[found] });
            } else {
                await bot.database.users.insert({
                    id: msg.author.id,
                    college: colleges[found]
                });
            }

            msg.reply(
                "successfully set your college to **" +
                colleges[found] +
                "**! You will not be able to change this."
            );
        }
    }
}

module.exports = setcollege;
