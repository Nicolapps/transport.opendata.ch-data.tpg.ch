// ====================================
// transport.opendata.ch-data.tpg.ch
// ====================================

var colors  = require('colors'),
    mysql   = require('mysql'),
    request = require('request-json'),
    config  = require('./config')

console.log('transport.opendata.ch-data.tpg.ch'.cyan.inverse)

//-------------------------------------
// Connect to the MySQL database
//-------------------------------------

console.log('Connecting to database...')

var connection = mysql.createConnection({
  host     : config.database.host,
  user     : config.database.user,
  password : config.database.password,
  database : config.database.db_name
})

connection.connect((error) => {
  if(error) {
    console.log('ERROR'.red.inverse + " Cannot connect to database. Please make sure that the database information in config.js is correct.")
    process.exit()
  }
})

//-------------------------------------
// Fetch GetPhysicalStops from the
// transports publics genevois API
//-------------------------------------

var client = request.createClient('http://localhost:8888/')

var tpgApiUrl = 'http://prod.ivtr-od.tpg.ch/v1/GetPhysicalStops.json?key='+config.apiKey

client.get(tpgApiUrl, (err, res, body) => { // Fetch GetPhysicalStops

  if(err || body.errorMessage) {
    console.log('ERROR'.red.inverse + " Cannot connect to TPG open data API. Please make sure that the TPG open data API key in config.js is correct.")
    process.exit()
  }

  for(var i = 0; i < body.stops.length; i++){ // For each stop...
    var stop = body.stops[i]

    let tpgStopName = stop.stopName

    //-------------------------------------
    // Find the stop with the Transport API
    //-------------------------------------
    let transportApiURL = 'http://transport.opendata.ch/v1/locations'+
                          '?x='+stop.physicalStops[0].coordinates.latitude+
                          '&y='+stop.physicalStops[0].coordinates.longitude

    setTimeout(() => {
      client.get(transportApiURL, (err, res, body) => {
        process.stdout.write(tpgStopName.cyan + '... ')

        if('stations' in body){
          let sbbStopName = body.stations[0].name
          console.log(sbbStopName.green)


        } else {
          console.log('ERROR'.red.inverse)
          console.log(body)
        }
      })
    }, Math.floor(Math.random()*5*60*1000))  // Delay the request to not exceed
                                             // the transport.opendata.ch limit
                                             // (300 req/minute)
  }

})
