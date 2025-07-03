// Set environment variables before importing anything
process.env.BOT_TOKEN = 'mock-token';
process.env.CHAT_ID = '123456789';
process.env.NAMECHEAP_API_KEY = 'mock-api-key';
process.env.AUCTION_TABLE_NAME = 'mock-table';

// Mock dependencies
jest.mock('../../src/integrations/namecheap-api', () => ({
  getAuctionInfo: jest.fn(),
}));


jest.mock('../../src/utils/date-utils', () => {
  const original = jest.requireActual('../../src/utils/date-utils');
  return {
    getTimeLeft: jest.fn(),
    padTime: original.padTime,
  };
});

jest.mock('../../src/services/telegram-service', () => ({
  sendMessage: jest.fn(),
}));

jest.mock('../../src/repositories/auction-data-repository', () => ({
  AuctionDataRepository: {
    set: jest.fn(),
  },
}));

// Import dependencies and function to test
import { handleOutbid } from '../../src/services/auction-service';
import { getAuctionInfo } from '../../src/integrations/namecheap-api';
import { getTimeLeft, padTime } from '../../src/utils/date-utils';
import { sendMessage } from '../../src/services/telegram-service';
import { AuctionDataRepository } from '../../src/repositories/auction-data-repository';
import { AuctionEvent, AuctionEventType, Sale } from '../../src/types/auction-webhook-types';

describe('auction-service', () => {
  describe('handleOutbid', () => {
    // Mock data
    const mockSaleId = 'abv123';
    const mockDomainName = 'example.com';
    const mockMinBid = 100;
    const mockRenewPrice = 10;
    const mockEndDate = '2023-12-31T23:59:59Z';

    const mockEvent: AuctionEvent = {
      type: AuctionEventType.AUCTION_OUTBID,
      data: {
        nextBid: { amount: 110 },
        previousBid: { amount: 100, maxAmount: 100 },
        sale: {
          id: mockSaleId,
          name: mockDomainName,
          status: 'ACTIVE',
          minBid: mockMinBid,
          price: 100,
          renewPrice: mockRenewPrice,
          bidCount: 2,
          startDate: '2023-01-01T00:00:00Z',
          endDate: mockEndDate,
        },
      },
    };

    const mockSale: Sale = {
      id: mockSaleId,
      name: mockDomainName,
      status: 'ACTIVE',
      minBid: mockMinBid,
      price: 100,
      renewPrice: mockRenewPrice,
      bidCount: 2,
      startDate: '2023-01-01T00:00:00Z',
      endDate: mockEndDate,
    };

    const mockTimeLeft = {
      days: 5,
      hours: 12,
      minutes: 5,
      seconds: 45,
    };

    const mockChatId = 987654321;
    const mockMessageId = 123456789;

    beforeEach(() => {
      // Reset all mocks
      jest.clearAllMocks();

      // Setup mock implementations
      (getAuctionInfo as jest.Mock).mockResolvedValue(mockSale);
      (getTimeLeft as jest.Mock).mockReturnValue(mockTimeLeft);
      // padTime is using the real implementation
      (sendMessage as jest.Mock).mockResolvedValue({ chatId: mockChatId, messageId: mockMessageId });
      (AuctionDataRepository.set as jest.Mock).mockResolvedValue(undefined);
    });

    it('should fetch auction info with the correct sale ID', async () => {
      // Act
      await handleOutbid(mockEvent);

      // Assert
      expect(getAuctionInfo).toHaveBeenCalledWith(mockSaleId);
    });

    it('should calculate time left correctly', async () => {
      // Arrange
      const mockDate = new Date('2023-12-26T11:54:14Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as Date);

      // Act
      await handleOutbid(mockEvent);

      // Assert
      expect(getTimeLeft).toHaveBeenCalledWith(mockDate, new Date(mockEndDate));

      // Restore Date
      jest.restoreAllMocks();
    });

    it('should send a message with the correct information', async () => {
      // Act
      await handleOutbid(mockEvent);

      // Assert
      expect(sendMessage).toHaveBeenCalledWith(
        `Hey, You got outbid on the domain 🌐 ${mockDomainName}, you got: \n` +
        `📅 <b>${mockTimeLeft.days} Days and ⏳${padTime(mockTimeLeft.hours)}:${padTime(mockTimeLeft.minutes)}:${padTime(mockTimeLeft.seconds)}</b> \n` +
        `💸 ${mockMinBid}$ + (${mockRenewPrice}$) \n\n` +
        `Please reply to the message with the bid amount if you want to continue`
      );
    });

    it('should store the event data in the repository', async () => {
      // Act
      await handleOutbid(mockEvent);

      // Assert
      expect(AuctionDataRepository.set).toHaveBeenCalledWith(mockChatId, mockMessageId, mockEvent);
    });

    it('should handle errors from getAuctionInfo', async () => {
      // Arrange
      const mockError = new Error('API error');
      (getAuctionInfo as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert
      await expect(handleOutbid(mockEvent)).rejects.toThrow(mockError);
      expect(sendMessage).not.toHaveBeenCalled();
      expect(AuctionDataRepository.set).not.toHaveBeenCalled();
    });

    it('should handle errors from sendMessage', async () => {
      // Arrange
      const mockError = new Error('Telegram error');
      (sendMessage as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert
      await expect(handleOutbid(mockEvent)).rejects.toThrow(mockError);
      expect(AuctionDataRepository.set).not.toHaveBeenCalled();
    });

    it('should handle errors from AuctionDataRepository.set', async () => {
      // Arrange
      const mockError = new Error('Database error');
      (AuctionDataRepository.set as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert
      await expect(handleOutbid(mockEvent)).rejects.toThrow(mockError);
    });
  });
});
