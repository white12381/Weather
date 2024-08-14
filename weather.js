// Requiring modules
const TelegramBot = require('node-telegram-bot-api')
const request = require('request')


// Token obtained from bot father
const token = "6123982971:AAGF4ilFqjTfc2WvwVMddz_z16Nynk4RQes"

const bot = new TelegramBot(token, { polling: true });
console.log('APP RUNING>>>>>');

// Create a bot that uses 'polling' to
// fetch new updates
bot.on("polling_error", (err) => console.log(err));

// The 'msg' is the received Message from user and
// 'match' is the result of execution above
// on the text content
bot.onText(/\/city (.+)/, function (msg, match) {

    // Getting the name of movie from the message
    // sent to bot
    const city = match[1];
    const chatId = msg.chat.id; 

    const query ='http://api.openweathermap.org/data/2.5/forecast?q='+ city + '&APPID=40a44f7cdec59c690504776068ed0970' ;
   
    // Key obtained from openweathermap API
    request(query, 
        function (error, response, body) {

        if (!error && response.statusCode === 200) {
            const responses = [];
            bot.sendMessage(chatId,
                '_Looking for details of_ ' + city
                + '...', { parse_mode: "Markdown" })
                .then(msg => 
                    {
                        res = JSON.parse(body)
        
                        let timestamp, date, temperature, humidity, pressure, rainDescription
        
                        const data = res.list.map(item => 
                            {
                            timestamp = item.dt;
                            date = new Date(timestamp * 1000);
                            temperature = Math.round((parseInt(item.main.temp) - 273.15), 2);
                            humidity = item.main.humidity;
                            pressure = Math.round((parseInt(item.main.pressure)  - 1013.15), 2);
                            rainDescription = item.weather[0].description; 
        
                            var message = `GETING WEATHER FORCAST DATA>>>>
                                Date: ${item.dt_txt}
                                Temp: ${temperature} °C
                                Humidity: ${humidity} 
                                Pressure: ${pressure}
                                Rain: ${rainDescription}
                                
                            <------------------------------->
                            `
                            responses.push(message);
                            message = ``; 
                        }) 
                    function sendMessageInOrder(chatId, messages){
                        let index = 0;
                        function sendMessage(){
                            if(index < messages.length){
                                bot.sendMessage(chatId, messages[index]).then( () => {
                                    index++;
                                    sendMessage();
                                }).catch(err => console.log(err.message));
                            }
                        }
                        sendMessage();
                    }
                    sendMessageInOrder(chatId, responses);
                    }
                    );             
        }
        
    } )
})