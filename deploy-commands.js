require('dotenv').config();
const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Botun gecikme süresini gösterir'),
  new SlashCommandBuilder()
    .setName('embed-olustur')
    .setDescription('Özelleştirilebilir bir Embed oluşturur')
    .addRoleOption((option) =>
      option.setName('rol').setDescription('Ping atılacak rol (opsiyonel)').setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder()
    .setName('voice-baglan')
    .setDescription('Botu sabit ses kanalına bağlar')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder()
    .setName('voice-ayril')
    .setDescription('Botu ses kanalından ayırır')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
].map((cmd) => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
  body: commands,
}).then(() => console.log('Komut kaydedildi.'));