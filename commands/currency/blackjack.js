const Command = require(`${process.cwd()}/base/Command.js`);

class blackjack extends Command {
  constructor(client) {
    super(client, {
      name: "blackjack",
      description: "",
      usage: "blackjack <gamble-amount>",
      aliases: ["bj"],
      permLevel: 1
    });
  }

  restart(player_hand, cpu_hand, cards) {
    player_hand.push(this.drawCard(cards));
    cpu_hand.push(this.drawCard(cards));
    player_hand.push(this.drawCard(cards));
  }

  drawCard(cards) {
    let i = Math.floor(Math.random() * cards.length)
    return cards.splice(i, 1)[0];
  }

  calculateTotal(hand) {
    let total = 0;
    for (var i = 0; i < hand.length; i++) {
      if (hand[i] == "J" || hand[i] == "Q" || hand[i] == "K") {
        total += 10
      } else if (hand[i] == "A") {
        total += 11
      } else {
        total += hand[i]
      }
    }

    for (var i = 0; i < hand.length; i++) {
      if (hand[i] == "A" && total > 21) {
        total -= 10
      }
    }
    return total;
  }

  calculateWinner(player_hand, cpu_hand, cards) {
    //dealer draw - attempt to beat player
    let player_total = this.calculateTotal(player_hand);
    while (this.calculateTotal(cpu_hand) < player_total && this.calculateTotal(cpu_hand) < 21) {
      cpu_hand.push(this.drawCard(cards));
    }
    let cpu_total = this.calculateTotal(cpu_hand);

    /**
     * note that some of the outcomes represented below are unused but kept in the code architecture
     * for legibility and ease for any future edits
     * 0 dealer bust
     * 1 dealer win
     * 2 player bust
     * 3 player win
     * 4 push
     */
    if (cpu_total > 21) {
      return 0; //on dealer bust
    } else if (player_total > 21) {
      return 2; //unused; on player bust
    } else {
      if (cpu_total > player_total) {
        return 1; //on dealer win
      } else if (cpu_total < player_total) {
        return 3; //unused; on player win
      } else if (cpu_total == player_total) {
        return 4; //on push
      }
    }
  }

  async run(bot, msg, args, level) {
    var amount;
    var cards = [
      "A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K",
      "A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K",
      "A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K",
      "A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"
    ];
    var player_hand = [];
    var cpu_hand = [];
    var timeout = true;

    if (args[0] && isNaN(args[0])) amount = 10;
    else if (args[0] && !isNaN(args[0]) && Number(args[0]) > 0) amount = Number(args[0]);
    else amount = 10;

    let account = (await bot.database.users.get(msg.author.id)) || {};
    if (!account || !account.balance)
      return msg.reply(
        "you do not have an account yet! Please claim your dalies to setup an account!"
      );
    if (account.balance < amount)
      return msg.reply("you don't have enough money to cover that bet!");

    bot.database.update(
      "users",
      {
        balance: account.balance - amount,
        id: msg.author.id
      },
      bot.logger
    );

    this.restart(player_hand, cpu_hand, cards)

    let blackjackMessage = await msg.channel.send({
      embed: {
        title: "** Blackjack Bid Amount:** " + amount + " credits",
        description: "Dealer's card: " + cpu_hand +
          "\n؜" + "<@" + msg.author.id + ">'s cards: " + player_hand +
          "\n" + "Please react ✌ to hit and 🖐 to stay",
        footer: {
          text: bot.user.username + " Blackjack",
          iconURL: bot.user.avatarURL()
        },
        timestamp: new Date()
      }
    })
      .then(message => {
        message.react("✌")
        message.react("🖐")
        return message;
      });

    let filter = (reaction, user) => (reaction.emoji.name === '✌' || reaction.emoji.name === "🖐") && user.id === msg.author.id;
    let collector = blackjackMessage.createReactionCollector(filter, { time: 1000 * 3 * 60 })
    collector.on("collect", messageReaction => {
      if (messageReaction.emoji.name === "🖐") {
        if (this.calculateWinner(player_hand, cpu_hand, cards) == 0) {
          //dealer busts
          blackjackMessage.edit({
            embed:
            {
              title: "**Blackjack Bid Amount:** " + amount + " credits",
              description: "Dealer's card: " + cpu_hand +
                "\n؜" + "<@" + msg.author.id + ">'s cards: " + player_hand +
                "\n" + "Dealer has busted, You win " + 2 * amount + " credits",
              footer: {
                text: bot.user.username + " Blackjack",
                iconURL: bot.user.avatarURL()
              },
              timestamp: new Date()
            }
          });
          bot.database.update(
            "users",
            {
              balance: account.balance + amount,
              id: msg.author.id
            },
            bot.logger
          );
        } else if (this.calculateWinner(player_hand, cpu_hand, cards) == 1) {
          //dealer win
          blackjackMessage.edit({
            embed:
            {
              title: "**Blackjack Bid Amount:** " + amount + " credits",
              description: "Dealer's card: " + cpu_hand +
                "\n؜" + "<@" + msg.author.id + ">'s cards: " + player_hand +
                "\n" + "Dealer wins, You lose " + amount + " credits",
              footer: {
                text: bot.user.username + " Blackjack",
                iconURL: bot.user.avatarURL()
              },
              timestamp: new Date()
            }
          });
          bot.database.update(
            "users",
            {
              balance: account.balance - amount,
              id: msg.author.id
            },
            bot.logger
          );
        } else if (this.calculateWinner(player_hand, cpu_hand, cards) == 4) {
          //push
          blackjackMessage.edit({
            embed:
            {
              title: "**Blackjack Bid Amount:** " + amount + " credits",
              description: "Dealer's card: " + cpu_hand +
                "\n؜" + "<@" + msg.author.id + ">'s cards: " + player_hand +
                "\n" + "Push! You win back your " + amount + " credits",
              footer: {
                text: bot.user.username + " Blackjack",
                iconURL: bot.user.avatarURL()
              },
              timestamp: new Date()
            }
          });
          /**
           * account has no change due to push
          bot.database.update(
            "users",
            {
              balance: account.balance + amount,
              id: msg.author.id
            },
            bot.logger
          );
          */
        } //we can stop here
        timeout = false;
        collector.stop();
      } else if (messageReaction.emoji.name === "✌") {
        player_hand.push(this.drawCard(cards));
        if (this.calculateTotal(player_hand) > 21) {
          blackjackMessage.edit({
            embed:
            {
              title: "**Blackjack Bid Amount:** " + amount + " credits",
              description: "<@" + msg.author.id + "> busted! " + player_hand +
                "\n" + "You lost " + amount + " credits",
              footer: {
                text: bot.user.username + " Blackjack",
                iconURL: bot.user.avatarURL()
              },
              timestamp: new Date()
            }
          });
          timeout = false;
          collector.stop();
        } else {
          blackjackMessage.edit({
            embed:
            {
              title: "**Blackjack Bid Amount:** " + amount + " credits",
              description: "Dealer's card: " + cpu_hand +
                "\n؜" + "<@" + msg.author.id + ">'s cards: " + player_hand +
                "\n" + "Please react ✌ to hit and 🖐 to stay",
              footer: {
                text: bot.user.username + " Blackjack",
                iconURL: bot.user.avatarURL()
              },
              timestamp: new Date()
            }
          });
        }
      }
      let me = messageReaction.users.cache.filter(user => user.username == msg.author.username).first();
      messageReaction.users.remove(me);
    })
    collector.on("end", collected => {
      if (timeout) {
        blackjackMessage.edit({
          embed:
          {
            title: "**Blackjack Bid Amount:** " + amount + " credits",
            description: "You took too long and forfit the match",
            footer: {
              text: bot.user.username + " Blackjack",
              iconURL: bot.user.avatarURL()
            },
            timestamp: new Date()
          }
        });
      }
    })
  }
}

module.exports = blackjack;
