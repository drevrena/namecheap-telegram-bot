import axios from 'axios';

const BASE_URL = 'https://aftermarketapi.namecheap.com/client/api';

export async function getAuctionInfo(saleId: string) {
    const url = `${BASE_URL}/sales/${saleId}`;

    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NAMECHEAP_API_KEY}`
    };


    try {
        const start = Date.now();
        const response = await axios.get(url, {headers});
        console.log(`Namecheap API call took ${Date.now() - start}ms`);
        return response.data;
    } catch (error: any) {
        console.error('An Error occurred while calling namecheap API:', error.response.data.message);
        throw error;
    }
}

export async function placeAuctionBid(saleId: string, maxAmount: number) {
    const url = `${BASE_URL}/sales/${saleId}/bids`;

    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NAMECHEAP_API_KEY}`
    };

    const body = {maxAmount};

    try {
        const start = Date.now();
        const response = await axios.post(url, body, {headers});
        console.log(`Namecheap API call took ${Date.now() - start}ms`);
        return response.data;
    } catch (error: any) {
        console.error('An Error occurred while calling namecheap API:', error.response.data.message);
        throw error;
    }
}
