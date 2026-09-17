(function () {
  "use strict";

  function readMinute(minute, clock) {
    var value = Number(minute);
    if (!Number.isInteger(value) || value < 0 || value > 59) {
      return "";
    }
    if (value === 0) {
      return clock.minuteUnits[0];
    }
    var tens = Math.floor(value / 10) * 10;
    var ones = value % 10;
    if (ones === 0) {
      return clock.minuteTens[tens];
    }
    if (tens === 0) {
      return clock.minuteUnits[ones];
    }
    return clock.minutePrefixes[tens] + clock.minuteUnits[ones];
  }

  function minuteRows(clock) {
    var rows = [];
    for (var minute = 0; minute < 60; minute += 1) {
      rows.push({
        number: minute,
        form: minute + "分",
        reading: readMinute(minute, clock)
      });
    }
    return rows;
  }

  function readDayDuration(day, days) {
    var value = Number(day);
    if (!Number.isInteger(value) || value < 1 || value > 31) {
      return "";
    }
    if (days.durationSpecials[value]) {
      return days.durationSpecials[value];
    }
    return days.numberReadings[value] + "にち";
  }

  function dayDurationRows(days) {
    var rows = [];
    for (var day = 1; day <= 31; day += 1) {
      rows.push({
        number: day,
        form: day + "日",
        reading: readDayDuration(day, days)
      });
    }
    return rows;
  }

  function normalizeAnswer(value) {
    return String(value || "").replace(/[\s　]+/g, "");
  }

  function acceptsAnswer(value, question) {
    var answer = normalizeAnswer(value);
    var accepted = [question.answer].concat(question.accepted || []);
    return accepted.some(function (item) {
      return normalizeAnswer(item) === answer;
    });
  }

  window.NihongoCounterEngine = {
    readMinute: readMinute,
    minuteRows: minuteRows,
    readDayDuration: readDayDuration,
    dayDurationRows: dayDurationRows,
    normalizeAnswer: normalizeAnswer,
    acceptsAnswer: acceptsAnswer
  };
})();
