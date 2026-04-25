export const calcConsequitiveDays = (dates: string[]) => {
  let streakDay = 0;
  let longest = 0;
  const total = dates.length;

  if (dates.length === 1) return { streakDay: 1, longest: 1, total: 1 };

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);

    const dif =
      Math.round(curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    if (dif === 1) {
      streakDay++;
      longest = Math.max(streakDay, longest);
    } else {
      streakDay = 1;
    }
  }
  return { streakDay, longest, total };
};
