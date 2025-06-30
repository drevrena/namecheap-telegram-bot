resource "aws_dynamodb_table" "telegram_message_data" {
  name         = var.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }

  ttl {
    attribute_name = "expireAt"
    enabled        = true
  }

  tags = {
    Name = var.dynamodb_table_name
  }
}
