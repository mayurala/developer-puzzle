/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';
import { environment } from './environments/environment';

const request = require('request');

const init = async () => {
  const server = new Server({
    port: 3333,
    host: 'localhost',
  });

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

  server.method('getStockQuote', fetchStockQuote, {
    cache: {
      expiresIn: 10 * 1000,
      generateTimeout: 2000,
    }
  });

  server.route({
    method: 'GET',
    path: '/beta/stock/{symbol}/chart/{period}',
    handler: async (request, h) => {

      const { symbol, period } = request.params;
      const token = request.query.token;

      const result = await server.methods.getStockQuote(symbol, period, token);
      return result;

    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
