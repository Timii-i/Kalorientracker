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
	  
      
      const speechText = 'Willkommen bei deinem Kalorientracker. Du kannst deine täglichen Kalorien eintragen und deinen täglichen Bedarf an Kalorien angeben oder von mir ausrechnen lassen. Falls du Hilfe benötigst oder Fragen hast sag einfach Hilfe.';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(LaunchrepromptOutput)
        // fügt directive beim Request hinzu um APL auf dem Echo anzeigen zu lassen
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
    if (DB.currentDate != date) { //Wenn Das Datum in der DB nicht das gleiche ist, wie der heutige Tag, updatet er das Datum 
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
	    Update_Date_Func(user);
      
      // Setzt den Wert für den Tagesbedarf gleich dem Wert den der User angegeben hat
      user.dailyMaxCalories = dailyMaxCalories;
      
      // ruft die Funktion auf um in die JSON für APL zu schreiben
      changeJSON.WriteSetMaximumCaloriesJSON(dailyMaxCalories);
      const SetMaximumCaloriesData = require('/tmp/SetMaximumCalories.json');
      
      // schreibt den Tagesbedarf in die Datenbank und speichert ihn
      handlerInput.attributesManager.setPersistentAttributes(user);
      await handlerInput.attributesManager.savePersistentAttributes(user);

      var speakOutput = 'Ich habe dein Tagesbedarf auf ' + dailyMaxCalories + ' Kalorien gesetzt';
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(repromptOutput)
        // fügt directive beim Request hinzu um APL auf dem Echo anzeigen zu lassen
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
	  Update_Date_Func(user);	
    // Setzt den Wert für den Tagesbedarf gleich dem Wert den der User angegeben hat	
    user.dailyMaxCalories = KalorienMax;	

    return handlerInput.responseBuilder	
      .speak(speakOutput)
      .reprompt(repromptOutput)
      // fügt directive beim Request hinzu um APL auf dem Echo anzeigen zu lassen
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
	    Update_Date_Func(user);
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
        // fügt directive beim Request hinzu um APL auf dem Echo anzeigen zu lassen
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
      
      // falls der User den Tagesbedarf bereits überschritten hat
      if (calories > dailyMaxCalories) {
        speakOutput = 'Du hast dein Tagesbedarf um ' + calories + ' Kalorien überschritten';
        
        const GetDiffCaloriesTemplate = require('./templates/GetDiffCalories.json');
        // ruft die Funktion auf um in die JSON für APL zu schreiben
        changeJSON.WriteDifferenceCaloriesJSON(caloriesDifference);
        const GetDiffCaloriesData = require('/tmp/GetDifferenceCalories.json');
        
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(repromptOutput)
          // fügt directive beim Request hinzu um APL auf dem Echo anzeigen zu lassen
          .addDirective({
                      type: 'Alexa.Presentation.APL.RenderDocument',
                      version: '1.1',
                      document: GetDiffCaloriesTemplate,
                      datasources: GetDiffCaloriesData
                    }) 
          .getResponse();
      }
      
      // falls der User den Tagesbedarf noch nicht erreicht hat
      else 
      {
        speakOutput = 'Dir fehlen noch ' + caloriesDifference + ' Kalorien zu deinem Tagesbedarf';
        
        const GetDiff2CaloriesTemplate = require('./templates/GetDiff2Calories.json');
        // ruft die Funktion auf um in die JSON für APL zu schreiben
        changeJSON.WriteDifferenceCalories2JSON(caloriesDifference);
        const GetDiff2CaloriesData = require('/tmp/GetDifferenceCalories2.json');
        
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(repromptOutput)
          // fügt directive beim Request hinzu um APL auf dem Echo anzeigen zu lassen
          .addDirective({
                      type: 'Alexa.Presentation.APL.RenderDocument',
                      version: '1.1',
                      document: GetDiff2CaloriesTemplate,
                      datasources: GetDiff2CaloriesData
                    }) 
         .getResponse();
      }
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
		    Update_Date_Func(user);
		    
		    // schaut nach ob der User bereits Kalorien an dem Tag zu sich genommen hat 
        if(user.currentCalories)
        {
          user.currentCalories += +calories;
        }
        else
        {
          user.currentCalories = calories;
        }
        
        // ruft die Funktion auf um in die JSON für APL zu schreiben
        changeJSON.WriteAddCaloriesJSON(calories);
        const SubmitCaloriesData = require('/tmp/AddCalories.json');
        
        handlerInput.attributesManager.setPersistentAttributes(user);
        await handlerInput.attributesManager.savePersistentAttributes(user);
        
        var speakOutput = 'Ich habe ' + calories + ' Kalorien heute hinzugefügt';
        
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(repromptOutput)
          // fügt directive beim Request hinzu um APL auf dem Echo anzeigen zu lassen
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
		    Update_Date_Func(user);
        
        // yesterday und today definiert um die Werte dynamisch zu generieren
        var yesterday = new Date();
        yesterday = yesterday.getFullYear()+'-'+(yesterday.getMonth()+1)+'-'+yesterday.getDate(); //Monat gibt Zahl von 0-11 zurück, deshalb + 1
        var today = new Date();
        today = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(); //Monat gibt Zahl von 0-11 zurück, deshalb + 1
        
        var calories;
        var speakOutput = '';
        
        if(date == yesterday) {
          //Als beispiel, nehmen wir hier den derzeitigen Kalorienwert + 1000 um ihn "realistischer" zu gestalten
          calories = user.currentCalories + 1000;
          speakOutput = 'Du hast gestern ' + calories + ' Kalorien zu dir genommen';
        }
        else if(date == today) {
          calories =- user.currentCalories;
          speakOutput = 'Du hast heute schon ' + calories + ' zu dir genommen';
        }
        else {
          speakOutput = 'Du hast am ' + date + ' keine Kalorien zu dir genommen';
        }
        
        changeJSON.WriteCaloriesFromDateJSON(calories);
        const DateCaloriesData = require('/tmp/DateCalories.json');
        
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(repromptOutput)
          // fügt directive beim Request hinzu um APL auf dem Echo anzeigen zu lassen
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
	  Update_Date_Func(user);
    var calories = user.currentCalories;
    
    // ruft die Funktion auf um in die JSON für APL zu schreiben
    changeJSON.WriteCurrentCaloriesJSON(calories);
    const TodaysCaloriesData = require('/tmp/CurrentCalories.json');
    
    var speakOutput = '';
    
    // schaut nach ob der User bereits Kalorien zu sich genommen hat oder nicht
    if(user.currentCalories) {
      speakOutput = 'Du hast heute schon ' + calories + ' zu dir genommen';
    }else {
      speakOutput = 'Du hast heute noch keine Kalorien heute angegeben';
    }
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(repromptOutput)
      // fügt directive beim Request hinzu um APL auf dem Echo anzeigen zu lassen
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
    const speechText = 'Auf Wiedersehen. Bis zum nächsten Mal!';

    return handlerInput.responseBuilder
      .speak(speechText)
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
      .speak('Tut mir leid ich habe dich leider nicht verstanden.')
      .reprompt('Bitte versuche es erneut')
      .getResponse();
  },
};


// Standard Repromt Text
const repromptOutput = 'Was möchtest du jetzt machen ?';
// Launch Repromt Text
const LaunchrepromptOutput = 'Was möchtest du machen ?';

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
