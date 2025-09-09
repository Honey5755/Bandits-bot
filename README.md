# Bandits — Discord Moderation Bot

**Features**
- /ban <user> [reason]
- /kick <user> [reason]
- /mute <user> <duration_minutes> [reason]
- /unmute <user> [reason]
- /softban <user> [reason] (ban then unban to purge messages)
- /hackban <userId> [reason] (ban user by ID even if not in guild)
- /purge <amount>

**Important note about IP bans:** Discord does **not** expose user IP addresses via the API. Bots cannot perform "IP bans". The commands provided use Discord's official moderation actions (ban/kick/mute). A true IPban is not possible through the Discord API. See the "IP ban" section below for alternatives.

## Setup
1. Copy `.env.example` to `.env` and fill `DISCORD_TOKEN` and `CLIENT_ID`. Optionally set `GUILD_ID` for faster command registration during development.
2. Install dependencies:
   ```
   npm install
   ```
3. Register slash commands (development guild recommended):
   ```
   npm run register
   ```
4. Start the bot:
   ```
   npm start
   ```

## IP ban alternatives
- Use Discord's Trust & Safety for platform-level actions (report users).
- Use server verification levels, moderation bots, and invite controls.
- Maintain a manual blocklist of user IDs or banned invite fingerprinting (not guaranteed).

## Notes
- The bot requires the following permissions: `BanMembers`, `KickMembers`, `ManageRoles`, `ManageMessages`, `ModerateMembers`.
- Mute works by assigning a `Muted` role — the command will attempt to create it if missing.
