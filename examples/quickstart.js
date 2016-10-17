'use strict';

let Wit = null;
let interactive = null;
try {
  // if running from repo
  Wit = require('../').Wit;
  interactive = require('../').interactive;
} catch (e) {
  Wit = require('node-wit').Wit;
  interactive = require('node-wit').interactive;
}

const accessToken = (() => {
  if (process.argv.length != 3) {
    console.log('usage: node examples/quickstart.js <wit-access-token>');
    process.exit(1);
  }
  return process.argv[2];
})();

// Quickstart example
// See https://wit.ai/ar7hur/quickstart

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    return new Promise(function(resolve, reject) {
      console.log('sending...', JSON.stringify(response));
      return resolve();
    });
  },
  getForecast({context, entities}) {
    return new Promise(function(resolve, reject) {
      var location = firstEntityValue(entities, 'location')
      if (location) {
        context.forecast = 'sunny in ' + location; // we should call a weather API here
        delete context.missingLocation;
      } else {
        context.missingLocation = true;
        delete context.forecast;
      }
      return resolve(context);
      
    });
  },
  getPtDetails({context, entities}) {
    return new Promise(function(resolve, reject) {
      var datetime = firstEntityValue(entities, 'datetime')
      if (datetime) {
        context.promptDetails = 'ok'; 
        delete context.missingOnset;
      } else {
        context.missingOnset = true;
        delete context.promptDetails;
      }
      return resolve(context);
      
    });
  },
  greetBack({context, entities}) {
    return new Promise(function(resolve, reject) {
      var robot = firstEntityValue(entities, 'robot')
      if (robot) {
        context.promptGoal = true; 
      } 
      return resolve(context);
      
    });
  },
  farewellReturn({context, entities}) {
    return new Promise(function(resolve, reject) {
      var robot = firstEntityValue(entities, 'robot')
      if (robot) {
        context.goodbye = true; 
      } 
      return resolve(context);
      
    });
  },
  searchObject({context, entities}) {
    return new Promise(function(resolve, reject) {
      var object = firstEntityValue(entities, 'object')
      var direction = firstEntityValue(entities, 'direction')
      var distance = firstEntityValue(entities, 'distance')
      var unit = firstEntityValue(entities, 'unit')
      if (direction) {
        context.validation = ' sunny in ' + object; 
        delete context.missingDirection;
      } else if (object && distance && unit) {
      	context.missingDirection = true;
        delete context.validation;
      }
      return resolve(context);
      
    });
  },
  move({context, entities}) {
    return new Promise(function(resolve, reject) {
      var direction = firstEntityValue(entities, 'direction')
      if (direction) {
        context.direction = direction;
        delete context.missingDirection;
      } else {
        context.missingDirection = true;
        delete context.direction;
      }
    });
  }
};

const client = new Wit({accessToken, actions});
interactive(client);

//const client = new Wit({accessToken: process.argv[2]});
//var prompt = process.argv[3]; 
//prompt = prompt.split('-').join(' ');
//client.message(prompt, {})
//.then((data) => {
//  console.log('YAY, got Wit.ai response: ' + JSON.stringify(data));
//})
//.catch(console.error);
