// Set environment variables before importing anything
process.env.BOT_TOKEN = 'mock-token';
process.env.CHAT_ID = '123456789';
process.env.AUCTION_TABLE_NAME = 'mock-table';

// Mock the TelegramBot instance
const mockSendMessage = jest.fn();
jest.mock('node-telegram-bot-api', () => {
    return jest.fn().mockImplementation(() => {
        return {
            sendMessage: mockSendMessage
        };
    });
});

jest.mock('../../src/integrations/namecheap-api', () => ({
    placeAuctionBid: jest.fn(),
}));

jest.mock('../../src/repositories/auction-data-repository', () => ({
    AuctionDataRepository: {
        get: jest.fn(),
        delete: jest.fn(),
    },
}));

// Import dependencies and functions to test
import {processTelegramWebhook, sendMessage} from '../../src/services/telegram-service';
import {placeAuctionBid} from '../../src/integrations/namecheap-api';
import {AuctionDataRepository} from '../../src/repositories/auction-data-repository';

describe('telegram-service', () => {
    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Setup mock implementations
        mockSendMessage.mockResolvedValue({
            chat: {id: 123456789},
            message_id: 987654321,
        });

        (AuctionDataRepository.get as jest.Mock).mockResolvedValue({
            data: {
                sale: {
                    id: 'mock-sale-id',
                    name: 'example.com',
                },
            },
        });

        (AuctionDataRepository.delete as jest.Mock).mockResolvedValue(undefined);
        (placeAuctionBid as jest.Mock).mockResolvedValue({success: true});
    });

    describe('processTelegramWebhook', () => {
        it('should process webhook with text message', async () => {
            // Arrange
            const mockWebhookBody = {
                message: {
                    text: '100',
                    reply_to_message: {
                        chat: {id: 123456789},
                        message_id: 987654321,
                    },
                },
            };

            // Act
            await processTelegramWebhook(mockWebhookBody);

            // Assert
            expect(AuctionDataRepository.get).toHaveBeenCalledWith(123456789, 987654321);
            expect(placeAuctionBid).toHaveBeenCalledWith('mock-sale-id', 100);
            expect(AuctionDataRepository.delete).toHaveBeenCalledWith(123456789, 987654321);
            expect(mockSendMessage).toHaveBeenCalledWith(
                123456789,
                '✅ Bid confirmed for domain example.com!'
            );
        });

        it('should not process webhook without text message', async () => {
            // Arrange
            const mockWebhookBody = {
                message: {
                    // No text property
                },
            };

            // Act
            await processTelegramWebhook(mockWebhookBody);

            // Assert
            expect(AuctionDataRepository.get).not.toHaveBeenCalled();
            expect(placeAuctionBid).not.toHaveBeenCalled();
            expect(AuctionDataRepository.delete).not.toHaveBeenCalled();
            expect(mockSendMessage).not.toHaveBeenCalled();
        });

        it('should send error message when reply message is missing', async () => {
            // Arrange
            const mockWebhookBody = {
                message: {
                    text: '100',
                    // No reply_to_message property
                },
            };

            // Act
            await processTelegramWebhook(mockWebhookBody);

            // Assert
            expect(mockSendMessage).toHaveBeenCalledWith(
                '123456789',
                'Please reply to the message with the bid Amount!',
                {parse_mode: 'HTML'}
            );
            expect(AuctionDataRepository.get).not.toHaveBeenCalled();
            expect(placeAuctionBid).not.toHaveBeenCalled();
            expect(AuctionDataRepository.delete).not.toHaveBeenCalled();
        });

        it('should handle errors during bid operation', async () => {
            // Arrange
            const mockWebhookBody = {
                message: {
                    text: '100',
                    reply_to_message: {
                        chat: {id: 123456789},
                        message_id: 987654321,
                    },
                },
            };

            const mockError = new Error('API error');
            (placeAuctionBid as jest.Mock).mockRejectedValue(mockError);

            // Act
            await processTelegramWebhook(mockWebhookBody);

            // Assert
            expect(AuctionDataRepository.get).toHaveBeenCalledWith(123456789, 987654321);
            expect(placeAuctionBid).toHaveBeenCalledWith('mock-sale-id', 100);
            expect(AuctionDataRepository.delete).not.toHaveBeenCalled();
            expect(mockSendMessage).toHaveBeenCalledWith(
                '123456789',
                'An error occurred during the Bid operation. Check logs for more details.',
                {parse_mode: 'HTML'}
            );
        });
    });

    describe('sendMessage', () => {
        it('should send message with default options', async () => {
            // Act
            const result = await sendMessage('Test message');

            // Assert
            expect(mockSendMessage).toHaveBeenCalledWith(
                '123456789',
                'Test message',
                {parse_mode: 'HTML'}
            );
            expect(result).toEqual({
                chatId: 123456789,
                messageId: 987654321,
            });
        });

        it('should send message with custom options', async () => {
            // Arrange
            const customOptions = {
                reply_markup: {
                    inline_keyboard: [[{text: 'Button', callback_data: 'data'}]],
                },
            };

            // Act
            const result = await sendMessage('Test message', customOptions, 'Markdown');

            // Assert
            expect(mockSendMessage).toHaveBeenCalledWith(
                '123456789',
                'Test message',
                {
                    reply_markup: {
                        inline_keyboard: [[{text: 'Button', callback_data: 'data'}]],
                    },
                    parse_mode: 'Markdown',
                }
            );
            expect(result).toEqual({
                chatId: 123456789,
                messageId: 987654321,
            });
        });

        it('should handle errors from bot.sendMessage', async () => {
            // Arrange
            const mockError = new Error('Telegram API error');
            mockSendMessage.mockRejectedValue(mockError);

            // Act & Assert
            await expect(sendMessage('Test message')).rejects.toThrow(mockError);
        });
    });
});
