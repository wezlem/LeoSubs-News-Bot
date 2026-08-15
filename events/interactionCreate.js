const pingCommand = require('../commands/ping');
const embedOlusturCommand = require('../commands/embed-olustur');

const commands = {
  [pingCommand.name]: pingCommand,
  [embedOlusturCommand.name]: embedOlusturCommand,
};

module.exports = {
  name: 'interactionCreate',
  once: false,
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = commands[interaction.commandName];
      if (command) {
        await command.execute(interaction, client);
      }
      return;
    }

    if (interaction.isModalSubmit() && interaction.customId.startsWith('embedModal_')) {
      await embedOlusturCommand.handleModalSubmit(interaction);
    }
  },
};