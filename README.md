# dngs-bot

A Discord bot built with Node.js and [discord.js](https://discord.js.org/).

## Setup

1. **Create a Discord application**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications) → New Application.
   - Under **Bot**, create a bot and copy the **Token**.
   - Under **OAuth2 → General**, copy the **Application ID** (this is `DISCORD_CLIENT_ID`).

2. **Invite the bot to your Discord server**
   - In the Developer Portal, open your application.
   - In the left sidebar, click **OAuth2** → **URL Generator**.
   - Under **SCOPES**, check:
     - **bot** (lets the bot join servers and do bot things)
     - **applications.commands** (lets users see and use slash commands like `/ping`)
   - Under **BOT PERMISSIONS**, check at least **Send Messages** (or **Administrator** for testing).
   - At the bottom, copy the **Generated URL**.
   - Paste that URL into your browser and open it. Choose the server you want to add the bot to, then click **Authorize**. The bot will appear in that server’s member list (you may need to refresh).

3. **Install and configure**
   ```bash
   npm install
   cp .env.example .env
   ```
   Edit `.env` and set:
   - `DISCORD_TOKEN` — bot token
   - `DISCORD_CLIENT_ID` — application ID  
   Optionally set `DISCORD_GUILD_ID` to your server ID to register slash commands only there (faster for development).

4. **Register slash commands**
   ```bash
   npm run deploy
   ```

5. **Run the bot**
   ```bash
   npm start
   ```

In Discord, use `/ping` to get a “Pong!” reply.

## Adding commands

Add a new file in `src/commands/` that exports an object with `data` (a `SlashCommandBuilder`) and `execute(interaction)`. Example: `src/commands/ping.js`. Then run `npm run deploy` again.
