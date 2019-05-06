import React, { useState, useEffect } from 'react';
import './Popup.scss';
import { message } from './message';

const cacheKey = {
  RUN: 'isRunning',
  ALARM_CONFIG: 'alarmConfig',
  ALARM: 'alarm'
};
const Popup: React.FC = () => {
  const [way, setWay] = useState('hourly'); // default hourly alarm
  const [interval, setInterval] = useState(60); // default 40 minites
  const [isRunning, setIsRunning] = useState(false);
  const [nextFireAt, setNextFireAt] = useState(new Date());
  useEffect(() => {
    chrome.storage.sync.get([cacheKey.RUN], result => {
      if (result[cacheKey.RUN]) {
        setIsRunning(true);
        chrome.alarms.get(cacheKey.ALARM, alarm => {
          setNextFireAt(new Date(alarm.scheduledTime));
        });
      }
    });

    if (isRunning) {
    }
  });
  const handleWayChange = event => {
    setWay(event.target.value);
  };
  const isHourly = () => {
    return way === 'hourly';
  };

  const _startAlarm = alarmInfo => {
    chrome.alarms.onAlarm.addListener(alarm => {
      message('Time to rest, or you will die for this.');
    });
    chrome.alarms.create(cacheKey.ALARM, alarmInfo);
    setIsRunning(true);
    chrome.storage.sync.set({ [cacheKey.ALARM_CONFIG]: alarmInfo });
    chrome.storage.sync.set({ [cacheKey.RUN]: true });
  };
  const handleStart = () => {
    let now = new Date();
    now.setMinutes(0);
    now.setMilliseconds(0);
    now.setSeconds(0);
    let alarmInfo: { when?: number; periodInMinutes?: number } = {
      when: now.getTime(),
      periodInMinutes: 60
    };

    if (!isHourly()) {
      if (interval < 4) {
        message('Interval must be larger than 4 mintes!', 'Error');
        return;
      }
      alarmInfo = {
        periodInMinutes: interval
      };
    }
    _startAlarm(alarmInfo);
  };

  const handleStop = () => {
    chrome.storage.sync.clear();
    chrome.alarms.clearAll();
    setIsRunning(false);
    setWay('hourly');
    setInterval(60);
  };
  return (
    <div className="Popup">
      {isRunning ? (
        <div>
          Latest Fire Will @{' '}
          <span className="time-str">{nextFireAt.toString()}</span>
        </div>
      ) : (
        <>
          <p>please choose the way life saving that you prefer:</p>
          <input
            id="hourly"
            name="way"
            type="radio"
            checked={way === 'hourly'}
            value="hourly"
            onChange={handleWayChange}
          />
          <label htmlFor="hourly">Hourly Alarm</label>
          <br />
          <input
            id="interval"
            name="way"
            type="radio"
            checked={way === 'interval'}
            value="interval"
            onChange={handleWayChange}
          />
          <label htmlFor="interval">Specified Interval</label>
          <br />
          {way === 'hourly' ? (
            ''
          ) : (
            <>
              <input
                value={interval}
                onChange={event => {
                  setInterval(+event.target.value);
                }}
                style={{ width: '100px' }}
                type="text"
                placeholder="set the interval, default: 40 minutes"
              />
              minites
            </>
          )}
          <br />
          <button onClick={handleStart}>Start</button>
        </>
      )}
      <button onClick={handleStop}>Reset</button>
    </div>
  );
};

export default Popup;
