const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");
const fs = require('fs');
const stringSimilarity = require('string-similarity');

class peoplefrom extends Command {
    constructor(client) {
        super(client, {
            name: "peoplefrom",
            description: "Look for people from a uni!",
            usage: "peoplefrom <college-name>",
            aliases: ["lb"],
            permLevel: 1
        });
    }

    async run(bot, msg, args, level) {
        let colleges = JSON.parse(fs.readFileSync('data/roles.json').toString());
        let college = args.join(" ");
        let found = -1;

        for (var i = 0; i < colleges.length; i++) {
            if (colleges[i].toLowerCase() == college.toLowerCase()) {
                found = i;
            }
        }

        if (found < 0) {
            let matches = [stringSimilarity.findBestMatch(college, colleges).bestMatch.target]
            let similar = stringSimilarity.findBestMatch(college, colleges).ratings;
            for (var i = 0; i < similar.length; i++) {
                if (similar[i] && similar[i].rating > 0.6 && matches.indexOf(similar[i].target) < 0) {
                    matches.push(similar[i].target);
                }
            }
            return msg.reply("Did you mean: `" + matches.join(", ") + "`? If not, try again or please message one of the mods to add your college :)");
        }

        let collegePeeps = await bot.database.users.getAll(colleges[found], { index: "college" });
        let embed = new MessageEmbed()
            .setTitle("People from " + colleges[found])
            .setColor(msg.guild.me.displayHexColor)
            .setFooter(msg.guild.name, msg.guild.iconURL());

        let desc = "";

        collegePeeps.forEach(user => {
            desc += bot.users.cache.get(user.id) ? bot.users.cache.get(user.id).tag + "\n" : "";
        });

        desc += "-----\n**Total: " + collegePeeps.length + "**";

        embed.setDescription(desc);

        msg.channel.send({ embed: embed });
    }
}

module.exports = peoplefrom;
