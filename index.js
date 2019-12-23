/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const AWS = require('aws-sdk');
//const Adapter = require('ask-sdk-dynamodb-persistence-adapter');
//const docClient = new AWS.DynamoDB.DocumentClient();

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'hi';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

// Handler um den Tagesbedarf zu setzen
const SetMaximumDailyCaloriesIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'SetMaximumDailyCaloriesIntent';
    },
    async handle(handlerInput) {
      const slots = handlerInput.requestEnvelope.request.intent.slots;
      // Der vom User genannte Tagesbedarf
      var dailyMaxCalories = parseInt(slots.DailyMaxKalorienAnz.value,10);
      
      const user = await handlerInput.attributesManager.getPersistentAttributes();
      // Setzt den Wert für den Tagesbedarf gleich dem Wert den der User angegeben hat
      user.dailyMaxCalories = dailyMaxCalories;
      
      handlerInput.attributesManager.setPersistentAttributes(user);
      await handlerInput.attributesManager.savePersistentAttributes(user);

      var speakOutput = 'Ich habe dein Tagesbedarf auf ' + dailyMaxCalories + ' Kalorien gesetzt';
      return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
    }
};

// Handler um den Tagesbedarf abzufragen
const GetMaximumDailyCaloriesIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetMaximumDailyCaloriesIntent';
    },
    async handle(handlerInput) {
      
      const user = await handlerInput.attributesManager.getPersistentAttributes();
      var dailyMaxCalories = user.dailyMaxCalories;
      
      var speakOutput = '';
      if(user.dailyMaxCalories) 
      {
        speakOutput = 'Dein Tagesbedarf liegt bei ' + dailyMaxCalories + ' Kalorien';
      }
      else 
      {
        speakOutput = 'Du hast noch keinen Tagesbedarf angegeben. Wenn du ein Tagesbedarf hinzufügen möchtest, sage zum Beispiel: Setz mein Tagesbedarf auf 200 Kalorien';
      }
      return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
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
      var dailyMaxCalories = user.dailyMaxCalories;
      var calories = user.currentCalories;
      var caloriesDifference = dailyMaxCalories - calories;
      
      var speakOutput = '';
      if (calories > dailyMaxCalories) {
        speakOutput = 'Du hast dein Tagesbedarf um ' + calories + ' Kalorien überschritten';
      }
      else 
      {
        speakOutput = 'Dir fehlen noch ' + caloriesDifference + ' Kalorien zu deinem Tagesbedarf';
      }
      return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
    }
};

// Handler um Kalorien zum momentanen Kalorienstand hinzuzufügen
const AddCaloriesIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AddCaloriesIntent';
    },
    async handle(handlerInput) {
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        // Die vom User genannte Kalorienanzahl
        var calories = parseInt(slots.KalorienAnz.value,10);
        // Speichert die UserID des USers
        //const userID =  this.event.context.System.user.userId;
        // Speichert das momentane Datum
        //var timestamp = new Date().getTime();
        
        const user = await handlerInput.attributesManager.getPersistentAttributes();
        if(user.currentCalories)
        {
          user.currentCalories += +calories;
        }
        else
        {
          user.currentCalories = calories;
        }
        handlerInput.attributesManager.setPersistentAttributes(user);
        await handlerInput.attributesManager.savePersistentAttributes(user);
        
        var speakOutput = 'Ich habe ' + calories + ' Kalorien heute hinzugefügt';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
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
    
    const user = await handlerInput.attributesManager.getPersistentAttributes();
    var calories = user.currentCalories;
    
    var speakOutput = '';
    if(user.currentCalories) {
      speakOutput = 'Du hast heute schon ' + calories + ' zu dir genommen';
    }else {
      speakOutput = 'Du hast heute noch keine Kalorien heute angegeben';
    }
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(repromptOutput)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
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
    GetMaximumDailyCaloriesIntentHandler,
    GetDifferenceCaloriesIntentHandler,
    AddCaloriesIntentHandler,
    GetCurrentCaloriesIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withTableName('user')
  .withAutoCreateTable(true)
  //.withDynamoDbClient()
  .lambda();
