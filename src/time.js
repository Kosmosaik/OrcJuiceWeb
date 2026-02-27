// src/time.js
// Time simulation logic (Milestone 0): 1 real second -> 1 game day, 30-day months.

export function updateTime(state, dtSeconds, config, onLog) {
  state.time._acc += dtSeconds;

  if (state.time._acc >= config.secondsPerGameDay) {
    state.time._acc = 0;

    // Advance one in-game day
    state.time.day += 1;

    // Super simple month/year for now (30-day months)
    if (state.time.day > 30) {
      state.time.day = 1;
      state.time.month += 1;

      if (state.time.month > 12) {
        state.time.month = 1;
        state.time.year += 1;
        if (onLog) onLog(`🎉 Happy new year! Year is now ${state.time.year}`);
      }
    }

    // Update season based on month
    state.time.season = getSeasonFromMonth(state.time.month);
  }
}

export function getSeasonFromMonth(month) {
  if (month >= 1 && month <= 3) return "Spring";
  if (month >= 4 && month <= 6) return "Summer";
  if (month >= 7 && month <= 9) return "Autumn";
  return "Winter";
}
