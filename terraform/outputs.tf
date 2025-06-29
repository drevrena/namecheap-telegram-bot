output "dynamodb_table_name" {
  value = aws_dynamodb_table.telegram_message_data.name
}

output "lambda_function_url" {
  value = aws_lambda_function_url.lambda_webhook_url.function_url
}
