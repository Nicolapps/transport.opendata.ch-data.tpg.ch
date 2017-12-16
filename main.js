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

  //-------------------------------------
  // Create the database
  //-------------------------------------
  var query = 'CREATE TABLE IF NOT EXISTS `tpg-sbb` ( `id` INT NOT NULL AUTO_INCREMENT , `tpg` VARCHAR(255) NOT NULL , `sbb` VARCHAR(255) NOT NULL , `code` VARCHAR(5) NOT NULL , PRIMARY KEY (`id`), INDEX `sbb` (`sbb`), INDEX `tpg` (`tpg`), INDEX `code` (`code`)) ENGINE = InnoDB;'
  connection.query(query, (err, rows, fields) => {
    if(err) throw err
  });

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
    let tpgStopCode = stop.stopCode

    //-------------------------------------
    // Find the stop with the Transport API
    //-------------------------------------
    let transportApiURL = 'http://transport.opendata.ch/v1/locations'+
                          '?x='+stop.physicalStops[0].coordinates.latitude+
                          '&y='+stop.physicalStops[0].coordinates.longitude

    setTimeout(() => {
      client.get(transportApiURL, (err, res, body) => {
        process.stdout.write(tpgStopCode.red + '... ')
        process.stdout.write(tpgStopName.cyan + '... ')

        if('stations' in body){
          let sbbStopName = body.stations[0].name
          console.log(sbbStopName.green)

          let query = 'INSERT INTO `tpg-sbb` (`tpg`, `sbb`, `code`) VALUES (?, ?, ?)'
          connection.query(query, [tpgStopName, sbbStopName, tpgStopCode], (error) => {
            if(error) throw error
          })


        } else {
          console.log('ERROR'.red.inverse)
          console.log(body)
        }
      })
    }, Math.floor(Math.random()*5*60*1000+3000))
    // Delay the requests to not exceed the transport.opendata.ch rate limit
    // (300 req/minute)
  }

})
