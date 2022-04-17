const request = require('request');
const express = require ('express')
const path = require('path')

const app = express()
const port = 3000
const { JsonDB } = require('node-json-db')
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');

// file based db
var db = new JsonDB(new Config("pollen-risk-db.json", true, true, "/"))

// auto convert text to json object
app.use(express.json())

// static documents
app.use("/", express.static(path.join(__dirname, 'www/')))

// dynamic content
app
    // fetch requests: extern data, "Deutscher Wetterdienst" (uptdate iteration 24 h)
    .get('/dwd.json', (req, res) => {
        request({
            url: "https://opendata.dwd.de/climate_environment/health/alerts/s31fg.json",
            json: true
        }, (err, response, body) => {
            const new_data = body
            if(err) {
                console.log(err)
            }
            // create date based key, dwd 
            let dwd = new Date()
            let key = `/dwd-${dwd.getFullYear()}-${dwd.getMonth()+1}-${dwd.getDate()}`

            // check if dataset exists
            let dataset = false
            try {
                db.getData(key)
                dataset = true
            } catch {}

            if(!dataset) {
                console.log("storing new dataset @ ", key)
                db.push(key, new_data)
                res.status(200).send("Ok")
            } else {
                console.log("Key ", key, "already exists")
                res.status(400).send("dataset exists")
            }
        });
    })
    // fetch requests: intern data, "Pollen-O-Meter" (script.js)
    .get('/database', (req, res) =>  {
        // load date based key for db requests
        let dwd = new Date()
        let key = `/dwd-${dwd.getFullYear()}-${dwd.getMonth()+1}-${dwd.getDate()}`
        db.reload()
        try {
            const db_data = db.getData(key)
            console.log("Found object for id ", key)
            res.status(200)
            res.json(db_data)
        } catch {
            console.log(`no dataset for key '${key}'`)
            res.status(404)
            res.send(`no dataset for key '${key}'`)
        }
    });

app.listen(port, () => 
    console.log(`Open http://localhost:${port}`))