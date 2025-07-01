#!/bin/bash

# Define the path to the secrets file
SECRETS_FILE="terraform/secrets.tfvars"

# Check if the secrets file already exists
if [ -f "$SECRETS_FILE" ]; then
    echo "The file $SECRETS_FILE already exists."
    read -p "Do you want to override it? (y/n): " override
    if [[ $override != "y" && $override != "Y" ]]; then
        echo "Operation cancelled. Exiting..."
        exit 0
    fi
fi

# Ask for the required inputs
echo "Please provide the following information:"
read -p "Enter your Namecheap API key: " namecheap_api_key
read -p "Enter your Telegram bot token: " bot_token
read -p "Enter your Telegram chat ID: " chat_id

# Create or overwrite the secrets file
echo "Creating/updating $SECRETS_FILE..."
cat > "$SECRETS_FILE" << EOF
namecheap_api_key = "$namecheap_api_key"
bot_token = "$bot_token"
chat_id = "$chat_id"
EOF

echo "File $SECRETS_FILE has been created/updated successfully!"