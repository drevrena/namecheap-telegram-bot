# 🤖 Namecheap Telegram Bot

A serverless Telegram bot that integrates with Namecheap's auction system to notify users about auction events and allow them to respond to outbids directly from Telegram.

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

2. Create a `secrets.tfvars` file with sensitive information:

   You can use the provided setup script to create this file:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

   The script will ask for your Telegram bot token, chat ID, and Namecheap API key, then create the secrets.tfvars file with the following format:
   ```
   bot_token = "your_telegram_bot_token"
   chat_id = "your_telegram_chat_id"
   namecheap_api_key = "your_namecheap_api_key"
   ```

   If the file already exists, the script will ask if you want to override it.

4. Run the deploy script:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

5. The deployment will output a Lambda function URL that you can use for the Namecheap webhook.

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
