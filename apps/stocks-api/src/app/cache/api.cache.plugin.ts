import { environment } from '../../environments/environment';

const request = require('request');
const fetchStockQuote = async (symbol, period, token) => {

    const stockURL = environment.apiURL + symbol + '/chart/' + period + '?token=' + token;
    return new Promise((resolve, reject) => {
        request(stockURL, (error, response, body) => {
            if (error) reject(error);
            if (response && response['statusCode'] === 200) {
                resolve(body)
            }
            reject("Invalid status code : " + response.statusCode);

        });
    });

};

export const apiCachePlugin = {
    name: 'api-cache.plugin',
    version: '1.0.0',
    register: async function (server) {
        server.method('getStockQuote', fetchStockQuote, {
            cache: {
                expiresIn: 10 * 1000,
                generateTimeout: 2000,
            }
        });

        server.route({
            method: 'GET',
            path: '/beta/stock/{symbol}/chart/{period}',
            handler: async (req, h) => {

                const { symbol, period } = req.params;
                const token = req.query.token;

                const result = await server.methods.getStockQuote(symbol, period, token);
                return result;

            }
        });
    }
}