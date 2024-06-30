## Install dependencies : 
**npm install**

.env file example :
```sh
 # .env
PORT=3000
RATE_LIMIT_WINDOW_S=60
RATE_LIMIT_MAX_REQUESTS=5
CACHE_TTL=300
URL_TO_PROXY='https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m'
```
## Run the server :
```sh
npm run dev
```
