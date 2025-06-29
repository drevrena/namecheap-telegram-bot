provider "aws" {
  region = var.aws_region
}


resource "aws_iam_role" "lambda_exec" {
  name = "${var.function_name}_exec_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_lambda_function" "lambda_webhook" {
  function_name = var.function_name
  filename      = var.lambda_zip_path
  handler       = var.lambda_handler
  runtime       = "nodejs22.x"

  environment {
    variables = {
      BOT_TOKEN         = var.bot_token
      CHAT_ID           = var.chat_id
      NAMECHEAP_API_KEY = var.namecheap_api_key
      DYNAMO_TABLE_NAME = aws_dynamodb_table.telegram_message_data.name
    }
  }

  source_code_hash = filebase64sha256(var.lambda_zip_path)
  role = aws_iam_role.lambda_exec.arn
}

resource "aws_lambda_function_url" "lambda_webhook_url" {
  function_name      = aws_lambda_function.lambda_webhook.function_name
  authorization_type = "NONE"
}

#This is used to update the telegram webhook, since aws lambda can change we always update it for good measure.
resource "null_resource" "setup_telegram_webhook" {
  depends_on = [aws_lambda_function_url.lambda_webhook_url, aws_lambda_function.lambda_webhook]

  provisioner "local-exec" {
    command = "bash ../scripts/setup-webhook.sh"
    environment = {
      BOT_TOKEN           = var.bot_token
      LAMBDA_FUNCTION_URL = aws_lambda_function_url.lambda_webhook_url.function_url
    }
  }

  triggers = {
    always_run = timestamp()
  }
}

