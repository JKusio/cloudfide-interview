Hi! To start the project install all dependencies and run `npm run start:dev`

To run the app you need `.env` file with this content:

```
BINANCE_API_URL="https://api.binance.com"
```

To test run `npm run test`.

It's simple code as there was not much time to make it nicer :)

I've decided to analyze the data in this way:

- get highest price
- get lowest price
- analyze periods
  - check if the price was stable, decreasing or increasing
  - get start and end time of period
  - get start and end price

There is not much error handling, but for now it's probably not required.

The only thing I would be cautious about is the time period used in the endpoint as we do some API calls in the loop to get all the trades.
I'd use small start and end times.

There's only one endpoint:
`GET /analytics?symbol={symbol}&startTime={startTime}&endTime={endTime}`

All query params required :)
