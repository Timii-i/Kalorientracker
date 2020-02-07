 /* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const AWS = require('aws-sdk');
const changeJSON = require('./changeJSON.js');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    
      // zieht die Daten aus data/welcome.json in den Skill
      const welcomeData = require('./data/welcome.json');
      const welcomeTemplate = require('./templates/welcome.json');
	  const user = await handlerInput.attributesManager.getPersistentAttributes();
      Update_Date_Func(user);
	  
      
      const speechText = 'Willkommen bei deinem Kalorientracker. Du kannst deine täglichen Kalorien eintragen und deinen täglichen Bedarf an Kalorien angeben oder von mir ausrechnen lassen. Falls du Hilfe benötigst oder Fragen hast sag einfach Hilfe.';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
                .addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.1',
                document: welcomeTemplate,
                datasources: welcomeData
              })
            .getResponse();
  }
};

//Funktion die das Datum updated bzw. nachschaut ob der gleiche Wert heute ist
function Update_Date_Func(DB) { //Function, mit Datenbank als Parameter
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(); //Monat gibt Zahl von 0-11 zurück, deshalb + 1
  
  if (!(DB.currentDate)) { //Wenn Datum keinen Wert hat, Setz den heutigen Tag ein
    DB.currentDate = date;
    DB.currentCalories = 0;
  }
  else {
    if (DB.currentDate != date) { //Wenn Das Datum in der DB nicht das gleiche ist, wie der heutige Tag, Setz Alles um
      DB.currentCalories = 0;
      DB.currentDate = date;
      
    }
  }
}


// Handler um den Tagesbedarf zu setzen
const SetMaximumDailyCaloriesIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'SetMaximumDailyCaloriesIntent';
    },
    async handle(handlerInput) {
      
      const SetMaximumCaloriesTemplate = require('./templates/SetMaximumCalories.json');
      
      const slots = handlerInput.requestEnvelope.request.intent.slots;
      // Der vom User genannte Tagesbedarf
      var dailyMaxCalories = parseInt(slots.DailyMaxKalorienAnz.value,10);
      
      const user = await handlerInput.attributesManager.getPersistentAttributes();
      
      // Setzt den Wert für den Tagesbedarf gleich dem Wert den der User angegeben hat
      user.dailyMaxCalories = dailyMaxCalories;
      
      // ruft die Funktion auf um in die JSON für APL zu schreiben
      changeJSON.WriteSetMaximumCaloriesJSON(dailyMaxCalories);
      const SetMaximumCaloriesData = require('/tmp/SetMaximumCalories.json');
      
      handlerInput.attributesManager.setPersistentAttributes(user);
      await handlerInput.attributesManager.savePersistentAttributes(user);

      var speakOutput = 'Ich habe dein Tagesbedarf auf ' + dailyMaxCalories + ' Kalorien gesetzt';
      return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
                    .addDirective({
                      type: 'Alexa.Presentation.APL.RenderDocument',
                      version: '1.1',
                      document: SetMaximumCaloriesTemplate,
                      datasources: SetMaximumCaloriesData
                    })
            .getResponse();
    }
};

//Handler zum Dialog um Daily Max Calories von Alexa berechnen zu lassen	
const SetMaxDailyCaloriesByAlexaIntentHandler = {	
  canHandle(handlerInput) {	
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'	
      && (handlerInput.requestEnvelope.request.intent.name === 'SetMaxDailyCaloriesByAlexaIntent');	
  },	
  async handle(handlerInput) {	

	const SetMaxDailyCaloriesTemplate = require('./templates/SetMaxDailyCalories.json');

    const slots = handlerInput.requestEnvelope.request.intent.slots;	
    var KalorienMax = 0;	
    var Bewegung = slots.Bewegung.value;	
    var Geschlecht = slots.Geschlecht.value;	
    
    // ruft die Funktion auf um in die JSON für APL zu schreiben
    changeJSON.WriteSetMaximumCaloriesAlexaJSON();
    const SetMaxDailyCaloriesData = require('/tmp/SetMaxDailyCalories.json');

    if (Geschlecht == "Männlich") {	
      KalorienMax = 2000;	
    }	
    else {	
      KalorienMax = 1800;	
    }	

    if (Bewegung == "Viel") {	
      KalorienMax += 200;	
    }	
    var speakOutput = "Ich habe deinen Tagesbedarf nun anhand deiner Angaben auf " + KalorienMax + "gelegt.";	

    const user = await handlerInput.attributesManager.getPersistentAttributes();	
    // Setzt den Wert für den Tagesbedarf gleich dem Wert den der User angegeben hat	
    user.dailyMaxCalories = KalorienMax;	

    return handlerInput.responseBuilder	
      .speak(speakOutput)
      .addDirective({
                      type: 'Alexa.Presentation.APL.RenderDocument',
                      version: '1.1',
                      document: SetMaxDailyCaloriesTemplate,
                      datasources: SetMaxDailyCaloriesData
                    }) 	
      .getResponse();	
  },	
};

// Handler um den Tagesbedarf abzufragen
const GetMaximumDailyCaloriesIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetMaximumDailyCaloriesIntent';
    },
    async handle(handlerInput) {
      
      const GetMaximumCaloriesTemplate = require('./templates/GetMaximumCalories.json');
      
      const user = await handlerInput.attributesManager.getPersistentAttributes();
      var dailyMaxCalories = user.dailyMaxCalories;
      
      // ruft die Funktion auf um in die JSON für APL zu schreiben
      changeJSON.WriteGetMaximumCaloriesJSON(dailyMaxCalories);
      const GetMaximumCaloriesData = require('/tmp/GetMaximumCalories.json');
      
      var speakOutput = '';
      if(user.dailyMaxCalories) 
      {
        speakOutput = 'Dein Tagesbedarf liegt bei ' + dailyMaxCalories + ' Kalorien';
      }
      else 
      {
        speakOutput = 'Du hast noch keinen Tagesbedarf angegeben. Wenn du ein Tagesbedarf hinzufügen möchtest, sage zum Beispiel: Setz mein Tagesbedarf auf 200 Kalorien oder lass ihn von mir ausrechnen';
      }
      return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
                 .addDirective({
                      type: 'Alexa.Presentation.APL.RenderDocument',
                      version: '1.1',
                      document: GetMaximumCaloriesTemplate,
                      datasources: GetMaximumCaloriesData
                    }) 
            .getResponse();
    }
};

// Handler um die noch nötigen Kalorien, bis zum Tagesbedarf, auszugeben
const GetDifferenceCaloriesIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetDifferenceCaloriesIntent';
    },
    async handle(handlerInput) {
      
      const user = await handlerInput.attributesManager.getPersistentAttributes();
      Update_Date_Func(user);
      var dailyMaxCalories = user.dailyMaxCalories;
      var calories = user.currentCalories;
      var caloriesDifference = dailyMaxCalories - calories;
      
      var speakOutput = '';
      if (calories > dailyMaxCalories) {
        speakOutput = 'Du hast dein Tagesbedarf um ' + calories + ' Kalorien überschritten';
        
        const GetDiffCaloriesTemplate = require('./templates/GetDiffCalories.json');
        changeJSON.WriteDifferenceCaloriesJSON(caloriesDifference);
        const GetDiffCaloriesData = require('/tmp/GetDifferenceCalories.json');
        
        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(repromptOutput)
        .addDirective({
                      type: 'Alexa.Presentation.APL.RenderDocument',
                      version: '1.1',
                      document: GetDiffCaloriesTemplate,
                      datasources: GetDiffCaloriesData
                    }) 
        .getResponse();
      }
      else 
      {
        speakOutput = 'Dir fehlen noch ' + caloriesDifference + ' Kalorien zu deinem Tagesbedarf';
        
        const GetDiff2CaloriesTemplate = require('./templates/GetDiff2Calories.json');
        changeJSON.WriteDifferenceCalories2JSON(caloriesDifference);
        const GetDiff2CaloriesData = require('/tmp/GetDifferenceCalories2.json');
        
        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(repromptOutput)
        .addDirective({
                      type: 'Alexa.Presentation.APL.RenderDocument',
                      version: '1.1',
                      document: GetDiff2CaloriesTemplate,
                      datasources: GetDiff2CaloriesData
                    }) 
        .getResponse();
      }
      /*return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
            */
    }
};

// Handler um Kalorien zum momentanen Kalorienstand hinzuzufügen
const AddCaloriesIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AddCaloriesIntent';
    },
    async handle(handlerInput) {
      
        const SubmitCaloriesTemplate = require('./templates/SubmitCalories.json');
      
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        // Die vom User genannte Kalorienanzahl
        var calories = parseInt(slots.KalorienAnz.value);
        
        const user = await handlerInput.attributesManager.getPersistentAttributes();
        if(user.currentCalories)
        {
          user.currentCalories += +calories;
        }
        else
        {
          user.currentCalories = calories;
        }
        
        // ruft die Funktion auf um in die JSON für APL zu schreiben
        changeJSON.WriteAddCaloriesJSON(user.currentCalories);
        const SubmitCaloriesData = require('/tmp/AddCalories.json');
        
        handlerInput.attributesManager.setPersistentAttributes(user);
        await handlerInput.attributesManager.savePersistentAttributes(user);
        
        var speakOutput = 'Ich habe ' + calories + ' Kalorien heute hinzugefügt';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
                  .addDirective({
                      type: 'Alexa.Presentation.APL.RenderDocument',
                      version: '1.1',
                      document: SubmitCaloriesTemplate,
                      datasources: SubmitCaloriesData
                    }) 
            .getResponse();
    }
};

// Handler um Kalorien eines Bestimmten Tages anzuzeigen
const GetCaloriesFromDateIntent = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetCaloriesFromDateIntent';
    },
    async handle(handlerInput) {
      
        const DateCaloriesTemplate = require('./templates/DateCalories.json');
      
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        
        // Das vom User genannte Datum
        var date = slots.Datum.value;
        
        const user = await handlerInput.attributesManager.getPersistentAttributes();
        
        //Als beispiel, nehmen wir hier den derzeitigen Kalorienwert + 1000 um ihn "realistischer" zu gestalten
        var calories = user.currentCalories + 1000;
        
        changeJSON.WriteCaloriesFromDateJSON(calories);
        const DateCaloriesData = require('/tmp/DateCalories.json');
        
        var speakOutput = 'Du hast am ' + date + " " + calories + ' Kalorien eingenommen';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .addDirective({
                      type: 'Alexa.Presentation.APL.RenderDocument',
                      version: '1.1',
                      document: DateCaloriesTemplate,
                      datasources: DateCaloriesData
                    }) 
            .getResponse();
    }
};


// Handler um die am Tag schon zu sich genommenen Kalorien abzufragen 
const GetCurrentCaloriesIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetCurrentCaloriesIntent';
  },
  async handle(handlerInput) {
    
    const TodaysCaloriesTemplate = require('./templates/TodaysCalories.json');
    
    const user = await handlerInput.attributesManager.getPersistentAttributes();
    var calories = user.currentCalories;
    
    // ruft die Funktion auf um in die JSON für APL zu schreiben
    changeJSON.WriteCurrentCaloriesJSON(calories);
    const TodaysCaloriesData = require('/tmp/CurrentCalories.json');
    
    var speakOutput = '';
    if(user.currentCalories) {
      speakOutput = 'Du hast heute schon ' + calories + ' zu dir genommen';
    }else {
      speakOutput = 'Du hast heute noch keine Kalorien heute angegeben';
    }
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(repromptOutput)
            .addDirective({
                      type: 'Alexa.Presentation.APL.RenderDocument',
                      version: '1.1',
                      document: TodaysCaloriesTemplate,
                      datasources: TodaysCaloriesData
                    }) 
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'Du kannst deine täglichen Kalorien eintragen und deinen täglichen Bedarf an Kalorien angeben oder von mir ausrechnen lassen. Weiterhin kannst du fragen wieviele Kalorien du noch offen hast und fragen wieviele Kalorien du an einem bestimmten Tag gegessen hat';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Me no understando')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const repromptOutput = 'Was möchtest du jetzt machen ?';

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    SetMaximumDailyCaloriesIntentHandler,
    SetMaxDailyCaloriesByAlexaIntentHandler,
    GetMaximumDailyCaloriesIntentHandler,
    GetDifferenceCaloriesIntentHandler,
    AddCaloriesIntentHandler,
	  GetCaloriesFromDateIntent,
    GetCurrentCaloriesIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withTableName('user')
  .withAutoCreateTable(true)
  .lambda();
