const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const creditsMap = require('../data/credits.json');

module.exports = {
  name: 'embed-olustur',
  async execute(interaction) {
    const secilenRol = interaction.options.getRole('rol');

    const modal = new ModalBuilder()
      .setCustomId(`embedModal_${secilenRol ? secilenRol.id : 'none'}`)
      .setTitle('Embed Oluştur');

    const baslikInput = new TextInputBuilder()
      .setCustomId('baslik')
      .setLabel('Başlık')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const aciklamaInput = new TextInputBuilder()
      .setCustomId('aciklama')
      .setLabel('Açıklama')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const renkInput = new TextInputBuilder()
      .setCustomId('renk')
      .setLabel('Renk (hex kod, örn: FF0000)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const resimInput = new TextInputBuilder()
      .setCustomId('resim')
      .setLabel('Resim linki')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const footerInput = new TextInputBuilder()
      .setCustomId('footer')
      .setLabel('Footer metni')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(baslikInput),
      new ActionRowBuilder().addComponents(aciklamaInput),
      new ActionRowBuilder().addComponents(renkInput),
      new ActionRowBuilder().addComponents(resimInput),
      new ActionRowBuilder().addComponents(footerInput),
    );

    await interaction.showModal(modal);
  },

  async handleModalSubmit(interaction) {
    const rolId = interaction.customId.split('_')[1];
    const rolMetni = rolId !== 'none' ? (rolId === interaction.guild.id ? '@everyone ' : `<@&${rolId}> `) : '';
    const baslik = interaction.fields.getTextInputValue('baslik');
    const aciklama = interaction.fields.getTextInputValue('aciklama');
    const renk = interaction.fields.getTextInputValue('renk');
    const resim = interaction.fields.getTextInputValue('resim');
    const footer = interaction.fields.getTextInputValue('footer');

    const embed = new EmbedBuilder()
      .setTitle(baslik)
      .setDescription(aciklama);

    if (renk) embed.setColor(`#${renk.replace('#', '')}`);
    if (resim) embed.setImage(resim);
    if (footer) embed.setFooter({ text: footer });
    embed.setTimestamp();

    await interaction.channel.send({ content: rolMetni || undefined, embeds: [embed] });
    await interaction.reply({ content: 'Embed gönderildi!', ephemeral: true });
  },
};