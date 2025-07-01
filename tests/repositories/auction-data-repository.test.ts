// Set environment variables before importing anything
process.env.AUCTION_TABLE_NAME = 'mock-table';
process.env.AWS_REGION = 'eu-west-3';

// Mock the AWS SDK modules before importing anything else
jest.mock('@aws-sdk/client-dynamodb', () => {
  return {
    DynamoDBClient: jest.fn(() => ({
      // Empty mock implementation
    }))
  };
});

// Create a mock send function that we can control in our tests
const mockSend = jest.fn();

jest.mock('@aws-sdk/lib-dynamodb', () => {
  return {
    DynamoDBDocumentClient: {
      from: jest.fn(() => ({
        send: mockSend
      }))
    },
    GetCommand: jest.fn(params => params),
    PutCommand: jest.fn(params => params)
  };
});

// Now import the module under test
import {AuctionDataRepository} from "../../src/repositories/auction-data-repository";
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

describe('auction-data-repository', () => {
  // Mock data
  const mockChatId = 123456789;
  const mockMessageId = 987654321;
  const mockData = { data: { mock: 'mock' } };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    // Reset the mock implementation for send
    mockSend.mockReset();
    mockSend.mockResolvedValue({});
  });

  describe('set', () => {
    it('should create a PutCommand with the correct parameters', async () => {
      // Setup - mock the current time for consistent testing
      const mockNow = 1609459200000; // 2021-01-01T00:00:00.000Z
      jest.spyOn(Date, 'now').mockReturnValue(mockNow);

      // Execute
      await AuctionDataRepository.set(mockChatId, mockMessageId, mockData);

      // Assert
      expect(PutCommand).toHaveBeenCalledWith({
        TableName: process.env.AUCTION_TABLE_NAME,
        Item: {
          id: `${mockChatId}:${mockMessageId}`,
          data: mockData,
          expirationTime: Math.floor(mockNow / 1000) + 259200, // Default TTL
        },
      });
      expect(mockSend).toHaveBeenCalledTimes(1);

      // Restore Date.now
      jest.restoreAllMocks();
    });

    it('should set the correct TTL when provided', async () => {
      // Setup
      const customTtl = 3600; // 1 hour
      const mockNow = 1609459200000; // 2021-01-01T00:00:00.000Z
      jest.spyOn(Date, 'now').mockReturnValue(mockNow);

      // Execute
      await AuctionDataRepository.set(mockChatId, mockMessageId, mockData, customTtl);

      // Assert
      expect(PutCommand).toHaveBeenCalledWith({
        TableName: process.env.AUCTION_TABLE_NAME,
        Item: {
          id: `${mockChatId}:${mockMessageId}`,
          data: mockData,
          expirationTime: Math.floor(mockNow / 1000) + customTtl,
        },
      });

      // Restore Date.now
      jest.restoreAllMocks();
    });
  });

  describe('get', () => {
    it('should create a GetCommand with the correct parameters', async () => {
      // Execute
      await AuctionDataRepository.get(mockChatId, mockMessageId);

      // Assert
      expect(GetCommand).toHaveBeenCalledWith({
        TableName: process.env.AUCTION_TABLE_NAME,
        Key: { id: `${mockChatId}:${mockMessageId}` },
      });
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('should return the data from the DynamoDB response', async () => {
      // Setup
      const mockResponse = {
        Item: {
          id: `${mockChatId}:${mockMessageId}`,
          data: mockData,
          expirationTime: 1609545600, // 2021-01-02T00:00:00.000Z
        },
      };
      mockSend.mockResolvedValueOnce(mockResponse);

      // Execute
      const result = await AuctionDataRepository.get(mockChatId, mockMessageId);

      // Assert
      expect(result).toEqual(mockData);
    });

    it('should return undefined if the item does not exist', async () => {
      // Setup
      mockSend.mockResolvedValueOnce({ Item: undefined });

      // Execute
      const result = await AuctionDataRepository.get(mockChatId, mockMessageId);

      // Assert
      expect(result).toBeUndefined();
    });
  });
});
