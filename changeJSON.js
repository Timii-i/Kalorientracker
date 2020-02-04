/* Datei um die JSON Dateien zu bearbeiten, um sie in APL benutzen zu können */

//const Alexa = require('ask-sdk');
const AWS = require('aws-sdk');
const fs = require('fs');

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
                    "url": "https://wallpapercave.com/wp/rUSFi40.jpg",
                    "size": "small",
                    "widthPixels": 0,
                    "heightPixels": 0
                },
                {
                    "url": "https://wallpapercave.com/wp/rUSFi40.jpg",
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
  fs.writeFileSync('/tmp/SetMaximumCalories.json', data);
  console.log('This is after the write call');
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
                    "url": "https://wallpapercave.com/wp/rUSFi40.jpg",
                    "size": "small",
                    "widthPixels": 0,
                    "heightPixels": 0
                },
                {
                    "url": "https://wallpapercave.com/wp/rUSFi40.jpg",
                    "size": "large",
                    "widthPixels": 0,
                    "heightPixels": 0
                }
            ]
        },
        "textContent": {
            "primaryText": {
                "type": "PlainText",
                "text": "Dein Tagesbedarf beträgt: "
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
  fs.writeFileSync('/tmp/GetMaximumCalories.json', data);
  console.log('This is after the write call');
};

// Funktion um den Wert, der noch fehlenden Kalorien bis zum Tagesbedarf ,in die JSON zu schreiben um in APL anzuzeigen
functions.WriteDifferenceCaloriesJSON = function(cal) {
  var calories = {
    "DifferenceCaloriesData": {
        "type": "object",
        "objectId": "bt6Sample",
        "backgroundImage": {
            "sources": [
                {
                    "url": "https://wallpapercave.com/wp/rUSFi40.jpg",
                    "size": "small",
                    "widthPixels": 0,
                    "heightPixels": 0
                },
                {
                    "url": "https://wallpapercave.com/wp/rUSFi40.jpg",
                    "size": "large",
                    "widthPixels": 0,
                    "heightPixels": 0
                }
            ]
        },
        "textContent": {
            "primaryText": {
                "type": "PlainText",
                "text": "So viel Kalorien fehlen dir noch bis zum Tagesbedarf: "
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
  fs.writeFileSync('/tmp/GetDifferenceCalories.json', data);
  console.log('This is after the write call');
};

// Funktion um den Wert, der noch fehlenden Kalorien bis zum Tagesbedarf ,in die JSON zu schreiben um in APL anzuzeigen
functions.WriteCurrentCaloriesJSON = function(cal) {
  var calories = {
    "CurrentCaloriesData": {
        "type": "object",
        "objectId": "bt6Sample",
        "backgroundImage": {
            "sources": [
                {
                    "url": "https://wallpapercave.com/wp/rUSFi40.jpg",
                    "size": "small",
                    "widthPixels": 0,
                    "heightPixels": 0
                },
                {
                    "url": "https://wallpapercave.com/wp/rUSFi40.jpg",
                    "size": "large",
                    "widthPixels": 0,
                    "heightPixels": 0
                }
            ]
        },
        "textContent": {
            "primaryText": {
                "type": "PlainText",
                "text": "Deine heutigen Kalorien betragen: "
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
  fs.writeFileSync('/tmp/CurrentCalories.json', data);
  console.log('This is after the write call');
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
                    "url": "https://wallpapercave.com/wp/rUSFi40.jpg",
                    "size": "small",
                    "widthPixels": 0,
                    "heightPixels": 0
                },
                {
                    "url": "https://wallpapercave.com/wp/rUSFi40.jpg",
                    "size": "large",
                    "widthPixels": 0,
                    "heightPixels": 0
                }
            ]
        },
        "textContent": {
            "primaryText": {
                "type": "PlainText",
                "text": "Kalorien heute hinzugefügt: "
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
  fs.writeFileSync('/tmp/AddCalories.json', data);
  console.log('This is after the write call');
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

module.exports = functions;