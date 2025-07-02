# 🤖 Namecheap Telegram Bot

A serverless Telegram bot that integrates with Namecheap's auction system to notify users about auction events and allow them to respond to outbids directly from Telegram.

![screenshot](https://i.imgur.com/GosFAzq.png)

## 📋 Features

- Receives and processes Namecheap auction webhooks
- Sends notifications to Telegram when you're outbid on a domain auction
- Allows users to respond to outbids directly from Telegram
- Deployed as an AWS Lambda function with a function URL endpoint

## 🚀 Technologies Used

- **TypeScript**: For type-safe development
- **Node.js**: Runtime environment
- **AWS Lambda**: Serverless function execution
- **AWS DynamoDB**: NoSQL database for storing auction data
- **Terraform**: Infrastructure as code for AWS resources
- **Jest**: Testing framework
- **Telegram Bot API**: For sending messages and handling callbacks

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/namecheap-telegram-bot.git
   cd namecheap-telegram-bot
   ```

2. Install dependencies:
   ```bash
   npm install


## 🔧 Configuration

### Telegram Bot Setup

1. Create a new bot using BotFather on Telegram
2. Save the bot token for configuration
3. Start a conversation with your bot to get the chat ID

### Namecheap API Setup

1. Obtain an API key from your Namecheap account
2. Configure webhook settings in your Namecheap account to point to your Lambda function URL

## 📦 Deployment

The project uses Terraform to deploy all necessary AWS resources:

1. Configure your AWS credentials:
   ```bash
   aws configure
   ```

2. Set up your sensitive variables

Copy the example file `secrets.tfvars.example` and fill in your secret keys and credentials:

   ```bash
   cp secrets.tfvars.example secrets.tfvars
   ```


3. Run the deploy script:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

4. The deployment will output a Lambda function URL that you can use for the Namecheap webhook.

## Usage

Once deployed, the bot will:

1. Receive notifications from Namecheap when auction events occur
2. Send messages to your Telegram chat with auction updates
3. Process your responses and take appropriate actions

## 🧪 Testing

Run the test suite with:

   ```bash
   npm test
   ```

## TODO

- [ ] Implement remaining auction event handlers (AUCTION_ENDED, AUCTION_CLOSED, AUCTION_WINNER_RUNNERUP, AUCTION_WINNER)
- [ ] Implement test for services, controllers and utils.
