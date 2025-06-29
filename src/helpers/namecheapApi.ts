import axios from 'axios';

const BASE_URL = 'https://aftermarketapi.namecheap.com/client/api';

export async function placeBid(saleId: string, maxAmount: number) {
    const url = `${BASE_URL}/sales/${saleId}/bids`;

    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NAMECHEAP_API_TOKEN}`
    };

    const body = {maxAmount};

    try {
        const response = await axios.post(url, body, {headers});
        return response.data;
    } catch (error) {
        console.error('Errore chiamata placeBid:', error);
        throw error;
    }
}
