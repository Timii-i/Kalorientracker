/* Datei um die JSON Dateien zu bearbeiten, um sie in APL benutzen zu können */

const AWS = require('aws-sdk');
const fs = require('fs');

// definiert das Array in das die Funktionen kommt
var functions = {};

// Funktion um den neuen Wert des Tagesbedarfs in die JSON zu schreiben um in APL anzuzeigen
functions.WriteSetMaximumCaloriesJSON = function(cal) {
  var calories = {
    "SetMaximumCaloriesData": {
        "type": "object",
        "objectId": "bt6Sample",
        "backgroundImage": {
            "sources": [
                {
                    "url": "https://www.dieter-forte-gesamtschule.de/wp-content/uploads/2017/10/Seitenbild-Sport-960x480.jpg",
                    "size": "small",
                    "widthPixels": 0,
                    "heightPixels": 0
                },
                {
                    "url": "https://www.dieter-forte-gesamtschule.de/wp-content/uploads/2017/10/Seitenbild-Sport-960x480.jpg",
                    "size": "large",
                    "widthPixels": 0,
                    "heightPixels": 0
                }
            ]
        },
        "textContent": {
            "primaryText": {
                "type": "PlainText",
                "text": "Dein neuer Tagesbedarf beträgt: "
            },
            "secondaryText": {
                "type": "PlainText",
                "text": cal + " Kalorien"
            }
        },
        "hintText": "Sag, \"Alexa, hilf mir\" falls du nicht weiter weißt."
    }
};
 
  var data = JSON.stringify(calories, null, 2);
  
  // erstellt und schreibt in eine JSON, die in APL benutzt wird
  fs.writeFileSync('/tmp/SetMaximumCalories.json', data);
};

// Funktion um den momentanen Wert des Tagesbedarfs in die JSON zu schreiben um in APL anzuzeigen
functions.WriteGetMaximumCaloriesJSON = function(cal) {
  var calories = {
    "GetMaximumCaloriesData": {
        "type": "object",
        "objectId": "bt6Sample",
        "backgroundImage": {
            "sources": [
                {
                    "url": "https://www.dieter-forte-gesamtschule.de/wp-content/uploads/2017/10/Seitenbild-Sport-960x480.jpg",
                    "size": "small",
                    "widthPixels": 0,
                    "heightPixels": 0
                },
                {
                    "url": "https://www.dieter-forte-gesamtschule.de/wp-content/uploads/2017/10/Seitenbild-Sport-960x480.jpg",
                    "size": "large",
                    "widthPixels": 0,
                    "heightPixels": 0
                }
            ]
        },
        "textContent": {
            "primaryText": {
                "type": "PlainText",
                "text": "Dein Tagesbedarf liegt bei "
            },
            "secondaryText": {
                "type": "PlainText",
                "text": cal + " Kalorien"
            }
        },
        "hintText": "Sag, \"Alexa, hilf mir\" falls du nicht weiter weißt."
    }
};
  
  var data = JSON.stringify(calories, null, 2);
  
  // erstellt und schreibt in eine JSON, die in APL benutzt wird
  fs.writeFileSync('/tmp/GetMaximumCalories.json', data);
};

// Funktion um den Wert, der noch fehlenden Kalorien bis zum Tagesbedarf ,in die JSON zu schreiben um in APL anzuzeigen
functions.WriteDifferenceCaloriesJSON = function(cal) {
  var calories = {
    "GetDiffCaloriesData": {
        "type": "object",
        "objectId": "bt6Sample",
        "backgroundImage": {
            "sources": [
                {
                    "url": "https://www.dieter-forte-gesamtschule.de/wp-content/uploads/2017/10/Seitenbild-Sport-960x480.jpg",
                    "size": "small",
                    "widthPixels": 0,
                    "heightPixels": 0
                },
                {
                    "url": "https://www.dieter-forte-gesamtschule.de/wp-content/uploads/2017/10/Seitenbild-Sport-960x480.jpg",
                    "size": "large",
                    "widthPixels": 0,
                    "heightPixels": 0
                }
            ]
        },
        "textContent": {
            "primaryText": {
                "type": "PlainText",
                "text": "Du hast deinen Tagesbedarf um"
            },
            "secondaryText": {
                "type": "PlainText",
                "text": cal + " Kalorien überschritten"
            }
        },
        "hintText": "Sag, \"Alexa, hilf mir\" falls du nicht weiter weißt."
    }
};
  
  var data = JSON.stringify(calories, null, 2);
  
  // erstellt und schreibt in eine JSON, die in APL benutzt wird
  fs.writeFileSync('/tmp/GetDifferenceCalories.json', data);
};

// Funktion um den Wert, der Kalorien die zu viel sind,in die JSON zu schreiben um in APL anzuzeigen
functions.WriteDifferenceCalories2JSON = function(cal) {
  var calories = {
    "GetDiff2CaloriesData": {
        "type": "object",
        "objectId": "bt6Sample",
        "backgroundImage": {
            "sources": [
                {
                    "url": "https://www.dieter-forte-gesamtschule.de/wp-content/uploads/2017/10/Seitenbild-Sport-960x480.jpg",
                    "size": "small",
                    "widthPixels": 0,
                    "heightPixels": 0
                },
                {
                    "url": "https://www.dieter-forte-gesamtschule.de/wp-content/uploads/2017/10/Seitenbild-Sport-960x480.jpg",
                    "size": "large",
                    "widthPixels": 0,
                    "heightPixels": 0
                }
            ]
        },
        "textContent": {
            "primaryText": {
                "type": "PlainText",
                "text": "Zu deinem Tagesbedarf fehlen"
            },
            "secondaryText": {
                "type": "PlainText",
                "text": "noch " + cal + " Kalorien"
            }
        },
        "hintText": "Sag, \"Alexa, hilf mir\" falls du nicht weiter weißt."
    }
};
  
  var data = JSON.stringify(calories, null, 2);
  
  // erstellt und schreibt in eine JSON, die in APL benutzt wird
  fs.writeFileSync('/tmp/GetDifferenceCalories2.json', data);
};

// Funktion um den Wert, der noch fehlenden Kalorien bis zum Tagesbedarf ,in die JSON zu schreiben um in APL anzuzeigen
functions.WriteCurrentCaloriesJSON = function(cal) {
  var calories = {
    "GetCurrentCaloriesData": {
        "type": "object",
        "objectId": "bt6Sample",
        "backgroundImage": {
            "sources": [
                {
                    "url": "https://www.dieter-forte-gesamtschule.de/wp-content/uploads/2017/10/Seitenbild-Sport-960x480.jpg",
                    "size": "small",
                    "widthPixels": 0,
                    "heightPixels": 0
                },
                {
                    "url": "https://www.dieter-forte-gesamtschule.de/wp-content/uploads/2017/10/Seitenbild-Sport-960x480.jpg",
                    "size": "large",
                    "widthPixels": 0,
                    "heightPixels": 0
                }
            ]
        },
        "textContent": {
            "primaryText": {
                "type": "PlainText",
                "text": "Du hast heute bereits"
            },
            "secondaryText": {
                "type": "PlainText",
                "text": cal + " Kalorien eingenommen"
            }
        },
        "hintText": "Sag, \"Alexa, hilf mir\" falls du nicht weiter weißt."
    }
};
  
  var data = JSON.stringify(calories, null, 2);
  
  // erstellt und schreibt in eine JSON, die in APL benutzt wird
  fs.writeFileSync('/tmp/CurrentCalories.json', data);
};

// Funktion um den Wert, der noch fehlenden Kalorien bis zum Tagesbedarf ,in die JSON zu schreiben um in APL anzuzeigen
functions.WriteAddCaloriesJSON = function(cal) {
  var calories = {
    "AddCaloriesData": {
        "type": "object",
        "objectId": "bt6Sample",
        "backgroundImage": {
            "sources": [
                {
                    "url": "https://www.dieter-forte-gesamtschule.de/wp-content/uploads/2017/10/Seitenbild-Sport-960x480.jpg",
                    "size": "small",
                    "widthPixels": 0,
                    "heightPixels": 0
                },
                {
                    "url": "https://www.dieter-forte-gesamtschule.de/wp-content/uploads/2017/10/Seitenbild-Sport-960x480.jpg",
                    "size": "large",
                    "widthPixels": 0,
                    "heightPixels": 0
                }
            ]
        },
        "textContent": {
            "secondaryText": {
                "type": "PlainText",
                "text": "Ich habe " + cal + " Kalorien heute hinzugefügt."
            }
        },
        "hintText": "Sag, \"Alexa, hilf mir\" falls du nicht weiter weißt."
    }
};

  var data = JSON.stringify(calories, null, 2);
  
  // erstellt und schreibt in eine JSON, die in APL benutzt wird
  fs.writeFileSync('/tmp/AddCalories.json', data);
};

// Funktion um den Wert, der Kalorien vom bestimmten Datum ,in die JSON zu schreiben um in APL anzuzeigen
functions.WriteCaloriesFromDateJSON = function(date, cal) {
  var calories = {
    "DateCaloriesData": {
        "type": "object",
        "objectId": "bt6Sample",
        "backgroundImage": {
            "sources": [
                {
                    "url": "https://www.dieter-forte-gesamtschule.de/wp-content/uploads/2017/10/Seitenbild-Sport-960x480.jpg",
                    "size": "small",
                    "widthPixels": 0,
                    "heightPixels": 0
                },
                {
                    "url": "https://www.dieter-forte-gesamtschule.de/wp-content/uploads/2017/10/Seitenbild-Sport-960x480.jpg",
                    "size": "large",
                    "widthPixels": 0,
                    "heightPixels": 0
                }
            ]
        },
        "textContent": {
            "primaryText": {
                "type": "PlainText",
                "text": "Du hast am " + date 
            },
            "secondaryText": {
                "type": "PlainText",
                "text": " keine Kalorien zu dir genommen"
            }
        },
        "hintText": "Sag, \"Alexa, hilf mir\" falls du nicht weiter weißt."
    }
};
  
  var data = JSON.stringify(calories, null, 2);
  
  // erstellt und schreibt in eine JSON, die in APL benutzt wird
  fs.writeFileSync('/tmp/DateCalories.json', data);
};

// Funktion um den Wert der Kalorien von gestern in die JSON zu schreiben um in APL anzuzeigen
functions.WriteCaloriesFromDateYesterdayJSON = function(cal) {
  var calories = {
    "DateCaloriesData": {
        "type": "object",
        "objectId": "bt6Sample",
        "backgroundImage": {
            "sources": [
                {
                    "url": "https://www.dieter-forte-gesamtschule.de/wp-content/uploads/2017/10/Seitenbild-Sport-960x480.jpg",
                    "size": "small",
                    "widthPixels": 0,
                    "heightPixels": 0
                },
                {
                    "url": "https://www.dieter-forte-gesamtschule.de/wp-content/uploads/2017/10/Seitenbild-Sport-960x480.jpg",
                    "size": "large",
                    "widthPixels": 0,
                    "heightPixels": 0
                }
            ]
        },
        "textContent": {
            "primaryText": {
                "type": "PlainText",
                "text": "Du hast gestern "
            },
            "secondaryText": {
                "type": "PlainText",
                "text": cal + " Kalorien zu dir genommen"
            }
        },
        "hintText": "Sag, \"Alexa, hilf mir\" falls du nicht weiter weißt."
    }
};
  
  var data = JSON.stringify(calories, null, 2);
  
  // erstellt und schreibt in eine JSON, die in APL benutzt wird
  fs.writeFileSync('/tmp/DateCaloriesYesterday.json', data);
};

// Funktion um den Wert der Kalorien von heute in die JSON zu schreiben um in APL anzuzeigen
functions.WriteCaloriesFromDateTodayJSON = function(cal) {
  var calories = {
    "DateCaloriesData": {
        "type": "object",
        "objectId": "bt6Sample",
        "backgroundImage": {
            "sources": [
                {
                    "url": "https://www.dieter-forte-gesamtschule.de/wp-content/uploads/2017/10/Seitenbild-Sport-960x480.jpg",
                    "size": "small",
                    "widthPixels": 0,
                    "heightPixels": 0
                },
                {
                    "url": "https://www.dieter-forte-gesamtschule.de/wp-content/uploads/2017/10/Seitenbild-Sport-960x480.jpg",
                    "size": "large",
                    "widthPixels": 0,
                    "heightPixels": 0
                }
            ]
        },
        "textContent": {
            "primaryText": {
                "type": "PlainText",
                "text": "Du hast heute schon "
            },
            "secondaryText": {
                "type": "PlainText",
                "text": cal + " Kalorien zu dir genommen"
            }
        },
        "hintText": "Sag, \"Alexa, hilf mir\" falls du nicht weiter weißt."
    }
};
  
  var data = JSON.stringify(calories, null, 2);
  
  // erstellt und schreibt in eine JSON, die in APL benutzt wird
  fs.writeFileSync('/tmp/DateCaloriesToday.json', data);
};

// Funktion um die APL reinzuladen bei dem der User gebeten wird sein Geschlecht und Menge an Aktivität anzugeben
functions.WriteSetMaximumCaloriesAlexaJSON = function(cal) {
  var calories = {
"SetMaxDailyCalories": {
        "type": "object",
        "objectId": "bt6Sample",
        "backgroundImage": {
            "sources": [
                {
                    "url": "https://www.dieter-forte-gesamtschule.de/wp-content/uploads/2017/10/Seitenbild-Sport-960x480.jpg",
                    "size": "small",
                    "widthPixels": 0,
                    "heightPixels": 0
                },
                {
                    "url": "https://www.dieter-forte-gesamtschule.de/wp-content/uploads/2017/10/Seitenbild-Sport-960x480.jpg",
                    "size": "large",
                    "widthPixels": 0,
                    "heightPixels": 0
                }
            ]
        },
        "textContent": {
            "primaryText": {
                "type": "PlainText",
                "text": "Ich habe deinen Tagesbedarf nun anhand deiner Angaben auf: "
            },
            "secondaryText": {
                "type": "PlainText",
                "text": cal + " Kalorien gelegt."
            }
        },
        "hintText": "Sag, \"Alexa, hilf mir\" falls du nicht weiter weißt."
    }
};
  
  var data = JSON.stringify(calories, null, 2);
  
  // erstellt und schreibt in eine JSON, die in APL benutzt wird
  fs.writeFileSync('/tmp/SetMaxDailyCalories.json', data);
};

// Funktion um die JSON zu lesen (hauptsächlich zum debuggen) 
//functions.Read_JSON = function() {
//  
//  let rawdata = fs.readFileSync('/tmp/test.json');
//  let calories = JSON.parse(rawdata);
//  console.log('\n' + calories + '\n');
//
//console.log('This is after the read call');
//};

// Exportiert die Funktionen für die index.js
module.exports = functions;