// TODO!!!!!!!!!!!!!!!!!!
// additional stuff set nav on website by forecast
let forecast_array = ["today", "tomorrow", "dayafter_to"]
let forecast = forecast_array[0]

// BEGINN HELPER FUNCTIONS
function decodeColor(contentVal){
if (contentVal == "0") { return "#00ed01" }
else if (contentVal == "0-1") { return "#87d800" }
else if (contentVal == "1") { return "#fce101" }
else if (contentVal == "1-2") { return "#fbb124" }
else if (contentVal == "2") { return "#fa8223" }
else if (contentVal == "2-3") { return "#eb2c00" }
else if (contentVal == "3") { return "#ff0000" }
else { return "#000000" }
}

function decodeLegend(contentVal){
if (contentVal == "0") { return "keine Belastung" }
else if (contentVal == "0-1") { return "keine bis geringe Belastung" }
else if (contentVal == "1") { return "geringe Belastung" }
else if (contentVal == "1-2") { return "geringe bis mittlere Belastung" }
else if (contentVal == "2") { return "mittlere Belastung" }
else if (contentVal == "2-3") { return "mittlere bis hohe Belastung" }
else if (contentVal == "3") { return "hohe Belastung" }
else { return -1 }
}

function decodeRisk(contentVal){
if (contentVal == "0") { return 0 }
else if (contentVal == "0-1") { return 0.5 }
else if (contentVal == "1") { return 1 }
else if (contentVal == "1-2") { return 1.5 }
else if (contentVal == "2") { return 2 }
else if (contentVal == "2-3") { return 2.5 }
else if (contentVal == "3") { return 3 }
else { return -1 }
}

function encodeRisk(contentVal){
if (contentVal == 0) { return "0" }
else if (contentVal == 0.5) { return "0-1" }
else if (contentVal == 1) { return "1" }
else if (contentVal == 1.5) { return "1-2" }
else if (contentVal == 2) { return "2" }
else if (contentVal == 2.5) { return "2-3" }
else if (contentVal == 3) { return "3" }
else { return "-1" }
}
// END HELPER FUNCTIONS

// determine higehst pollen risk id value for a single federal state
function getMaxPollenRisk(subreg){
let values = []
// loop thru list of objects (more subregions) or single object 
if (Array.isArray(subreg)){
    subreg.forEach(e => {
        Object.values(e.Pollen).forEach((value) => {
            values.push(decodeRisk(value[forecast]))
        })
    });
} else {
    Object.values(subreg.Pollen).forEach((value) => {
        values.push(decodeRisk(value[forecast]))
    });
}
return (encodeRisk(Math.max(...values)));
}

// initialize max. pollen risk forecast
function initMap(){
fetch("testdata.json")
    .then( response => response.json() )
    .then( pollenData => {
        // aside: set max pollen risk colors of svg map paths
        var state = document.querySelectorAll("path.federalState")
        state.forEach(region => {
            // filter relevant list of nested objects for each region
            var subregion = pollenData.content.filter(x => x.region_id ==region.classList[1])
            // set color by a bunch of defined helper functions
            document.getElementById(`${region.id}`)
                .style.fill = decodeColor(getMaxPollenRisk(subregion))
        });

        // article: add some data source information
        const source = document.getElementById("source")
        let sender_ = document.createElement("p")
        let name_ = document.createElement("p")
        let lastUpdate_ = document.createElement("p")
        let nextUpdate_ = document.createElement("p")
        source.appendChild(sender_)
        source.appendChild(name_)
        source.appendChild(lastUpdate_)
        source.appendChild(nextUpdate_)
        sender_.innerText =pollenData.sender
        name_.innerText =pollenData.name
        lastUpdate_.innerHTML = "Datenstand: " + pollenData.last_update

        // article  init legend for coded color description
        const legend = document.getElementById("legend") 
        legend.innerHTML = ""
        // create nested dict for clean context and right count of mixed legend data
        let legendDictionary = {
            "code": {},
            "desc": {}
        };
        Object.entries(pollenData.legend).sort().forEach(([key, value]) => {
            if ( key.includes("_desc") ) { 
                legendDictionary["desc"][key.replace("_desc","")] = value 
            } 
            else { legendDictionary["code"][key] = value }     
        });
        // add li children by sorted list and identified type of code or description
        Object.entries(legendDictionary["desc"]).forEach(([key, value]) => {
            let li = document.createElement("li")
            let a = document.createElement("a")
            legend.appendChild(li)
            li.appendChild(a)
            li.id= key
            a.innerText = value
            li.style=`background-color:${decodeColor(legendDictionary["code"][key])+"BF"};`
        });
    });
}

// BEGIN navigate() FUNCTIONS
function loadPage(name, e) {
    // check if website already loaded
    if ( (e.querySelectorAll("*").length === 0) && (name!="LANDING") ) {
        fetch("testdata.json")
            .then( response => response.json() )
            .then( pollenData => {
                // sections: dynamic content, only load clicked items once in single session
                const section = document.getElementById(name)
                let regId = document.getElementById("i"+name).classList[1]
                let subregions = pollenData.content.filter(x => x.region_id ==regId)

                // remove all entries
                section.innerHTML=""

                // create table
                let table = document.createElement("table")
                let caption = document.createElement("caption")
                let thead = document.createElement("thead")
                let thead_tr = document.createElement("tr")
                section.appendChild(table)

                // add table caption
                table.appendChild(caption)
                caption.className = "region"
                caption.id = String(regId)
                caption.innerText = subregions[0].region_name

                // add table thead
                table.appendChild(thead)
                thead.appendChild(thead_tr)
                thead_tr.className="pollen-list"
                // add list of all pollen data from german weather service
                Object.keys(pollenData.content[0].Pollen).sort().forEach(pol => {
                    let thead_th = document.createElement("th")
                    thead_tr.appendChild(thead_th)
                    thead_th.id=pol
                    thead_th.innerText=pol
                    thead_th.style = "padding: 14px 7px 4px;"
                });

                // add table tbody
                let tbody = document.createElement("tbody")
                table.appendChild(tbody)
                // add tr parent for each td child subregion
                subregions.forEach(sr => {
                    let tbody_tr = document.createElement("tr")
                    let tbody_td = document.createElement("td")
                    let tbody_tr_pollen = document.createElement("tr")
                    tbody.appendChild(tbody_tr)
                    tbody_tr.className = "subregion-list"
                    tbody_tr.appendChild(tbody_td)
                    tbody_td.className = "subregion"
                    tbody_td.id = sr.partregion_id
                    tbody_td.colSpan = Object.keys(sr.Pollen).length
                    tbody_td.innerText = sr.partregion_name
                    // add tr parent for td child iteration
                    tbody.appendChild(tbody_tr_pollen)
                    tbody_tr_pollen.className = "pollen-list"
                    // add sorted list of td children and set their decoded pollen risk colors
                    Object.entries(sr.Pollen).sort().forEach(([key, value]) => {
                        let tbody_td = document.createElement("td")
                        tbody_tr_pollen.appendChild(tbody_td)
                        tbody_td.className = "pollen "+ key 
                        tbody_td.style=`background-color:${decodeColor(value[forecast])+"BF"};`
                    });
                });
            });
    }
}

// loop through all sections and copare actual with navigate id
function showSection(name) {
for(let e of document.getElementsByTagName("section")) {
    if(e.id == name) {
        e.classList.remove("hidden")
        loadPage(name, e)} 
    else { e.classList.add("hidden") }
    }
}

function navigate(section) {
    if(location.hash == "#SH"){showSection("SH")} 
    else if (location.hash == "#HH"){showSection("HH")}
    else if (location.hash == "#MV"){showSection("MV")} 
    else if (location.hash == "#NI"){showSection("NI")} 
    else if (location.hash == "#HB"){showSection("HB")} 
    else if (location.hash == "#NW"){showSection("NW")} 
    else if (location.hash == "#BB"){showSection("BB")} 
    else if (location.hash == "#BE"){showSection("BE")} 
    else if (location.hash == "#ST"){showSection("ST")} 
    else if (location.hash == "#TH"){showSection("TH")} 
    else if (location.hash == "#SN"){showSection("SN")} 
    else if (location.hash == "#HE"){showSection("HE")} 
    else if (location.hash == "#RP"){showSection("RP")} 
    else if (location.hash == "#SL"){showSection("SL")} 
    else if (location.hash == "#BW"){showSection("BW")} 
    else if (location.hash == "#BY"){showSection("BY")} 
    else {showSection("LANDING")}
}
// END navigate() FUNCTIONS

// EventListener Pollen-O-Meter
window.addEventListener("load", () => {
    initMap()
    navigate()
    window.addEventListener("hashchange", navigate)
});
