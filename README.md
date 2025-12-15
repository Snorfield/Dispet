# Dispet

### Discord bot written in discord.js that allows you to collect custom server emojis and battle (soon) with them, complete with collectible card generation


## How To Host

First, clone the repo or download it.

```bash
git clone https://github.com/Snorfield/Dispet.git
```
Next install dependencies, requires Node.js to run. 

**Note: This bot uses the [*canvas*](https://www.npmjs.com/package/canvas) module, which doesn't always work out of the box on certain systems. You can view the npm page for more information on how to install the additional dependencies if canvas isn't working for you.**

```bash
npm i
```

Fill out `config.example.json` with your credentials and rename it to `config.json`.

Register the bot commands

```bash
node register.js
```

Initiate the database with therequired tables.

```bash
node setup.js
```
Start the bot

```bash
node index.js
```

Congratulations, the bot is now (hopefully) online.
