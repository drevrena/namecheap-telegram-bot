variable "aws_region" {
  type    = string
  default = "eu-west-1"
}

variable "function_name" {
  type = string
}

variable "lambda_zip_path" {
  type = string
}

variable "lambda_handler" {
  type    = string
  default = "index.handler"
}
variable "dynamodb_table_name" {
  type        = string
  default     = "telegram-auction-cache"
}

variable "namecheap_api_key" {
  type      = string
  sensitive = true
}

variable "bot_token" {
  type      = string
  sensitive = true
}

variable "chat_id" {
  type      = string
  sensitive = true
}