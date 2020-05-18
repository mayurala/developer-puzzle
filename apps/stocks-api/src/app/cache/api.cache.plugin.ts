import { environment } from '../../environments/environment';

const request = require('request');
const fetchStockQuote = async (symbol, period, token) => {

    const stockURL = environment.apiURL + symbol + '/chart/' + period + '?token=' + token;

    return new Promise((resolve, reject) => {
        return request(stockURL, (error, response, body) => {

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

        await server.cache.provision({
            provider: require('@hapi/catbox-memory'),
            name: 'cache-response'
        });

        server.method('getStockCache', fetchStockQuote, {
            cache: {
                cache: 'cache-response',
                expiresIn: 10 * 1000,
                generateTimeout: 5000,
                getDecoratedValue: true
            }
        });

        server.route({
            method: 'GET',
            path: '/api/beta/stock/{symbol}/chart/{period}',
            handler: async (req, h) => {

                const { symbol, period } = req.params;

                const token = req.query.token;
                const { value, cached } = await server.methods.getStockCache(symbol, period, token);

                const lastModified = cached ? new Date(cached.stored) : new Date();

                return h.response(value)
                    .header('Last-modified', lastModified.toUTCString());


            }
        });
    }
}