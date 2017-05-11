
'use strict';

// import Immutable from 'immutable';

// import Interpreter from 'js-interpreter';

import {
  NEXT_CHALLENGE,
  TESTS_STARTED,
  CODE_CHANGED,
  OUTPUT_CHANGED,
  START_CHALLENGE,
  TESTS_FINISHED,
  TIMER_STARTED,
  TIMER_UPDATED,
  STOP_TIMER,
  FINISH_SESSION
} from '../actions/ArcadeAction';

import UserData from '../model/UserData';
import Challenges from '../../../json/challenges.json';
import TestResults from '../model/TestResults';
import Challenge from '../model/Challenge';

// const initialState = Immutable.Map();
//

const timerDefaultValue = 5 * 1000; // 15 minutes

export default function arcadeReducer(state, action) {
  if (typeof state === 'undefined') {
    return {
      title: '',
      description: [],
      code: `
        The code to work with will show up here.
        When you are ready, enter a time at the top and press start to begin!
      `,
      // Challenges.challenges[0].challengeSeed.join('\n'),
      userOutput: 'The output of your code will show up here.',
      interpreterError: false,
      isRunningTests: false,
      userData: new UserData({ username: '' }),
      testResults: new TestResults([]),
      challengeNumber: 0,
      currChallenge: new Challenge(Challenges.challenges[0]),
      nextChallenge: '',

      // Timer handling
      isTimerFinished: false,
      timerMaxValue: timerDefaultValue,
      timeLeft: timerDefaultValue,
      timerStart: 0,

      // Session control variables
      isSessionFinished: false
    };
  }

  const nextState = Object.assign({}, state);

  switch (action.type) {
    case TESTS_STARTED: {
      nextState.isRunningTests = true;
      break;
    }
    case TESTS_FINISHED: {
      nextState.isRunningTests = false;
      nextState.testResults = new TestResults(action.testResults);
      break;
    }
    case CODE_CHANGED: {
      nextState.code = action.code;
      break;
    }
    case NEXT_CHALLENGE: {
      nextState.currChallenge = state.nextChallenge;
      nextState.title = state.nextChallenge.getTitle();
      nextState.description = state.nextChallenge.getDescription();
      nextState.code = state.nextChallenge.getSeed().join('\n');
      nextState.testResults = new TestResults([]);
      nextState.challengeNumber++;
      nextState.userOutput = '';
      nextState.nextChallenge = new Challenge(Challenges.challenges[state.challengeNumber + 1]);
      break;
    }
    case OUTPUT_CHANGED: {
      nextState.userOutput = action.userOutput;
      break;
    }
    case TIMER_STARTED: {
      nextState.isTimerFinished = false;
      nextState.timeLeft = timerDefaultValue;
      nextState.timerStart = new Date().getTime();
      break;
    }
    case START_CHALLENGE: {
      nextState.title = state.currChallenge.getTitle();
      nextState.description = state.currChallenge.getDescription();
      nextState.code = state.currChallenge.getSeed().join('\n');
      nextState.challengeNumber++;
      nextState.nextChallenge = new Challenge(Challenges.challenges[state.challengeNumber + 1]);
      break;
    }
    case TIMER_UPDATED: {
      const timeNow = new Date().getTime();
      nextState.timeLeft = state.timerMaxValue - (timeNow - state.timerStart);
      break;
    }
    case STOP_TIMER: {
      nextState.isTimerFinished = true;
      nextState.timeLeft = 0;
      break;
    }
    case FINISH_SESSION: {
      nextState.isSessionFinished = true;
      break;
    }
    default: console.log('ERROR. ArcadeReducer default reached.');
  }

  return nextState;
}
