export interface AuctionEvent {
    type: AuctionEventType
    data: Data
}

export enum AuctionEventType {
    AUCTION_CLOSED = 'AUCTION_CLOSED',
    AUCTION_ENDED = 'AUCTION_ENDED',
    AUCTION_OUTBID = 'AUCTION_OUTBID',
    AUCTION_WINNER = 'AUCTION_WINNER',
    AUCTION_WINNER_RUNNERUP = 'AUCTION_WINNER_RUNNERUP'
}

export interface Data {
    nextBid: Bid;
    previousBid: PreviousBid;
    sale: Sale;
}

export interface Bid {
    amount: number
}

export interface PreviousBid extends Bid {
    maxAmount: number;
}

export interface Sale {
    id: string
    name: string
    status: string
    price: number
    renewPrice: number
    bidCount: number
    startDate: string
    endDate: string
}