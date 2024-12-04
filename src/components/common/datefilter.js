import moment from "moment-timezone";

export const dateFilter = (option) => {
  const currentMoment = moment().tz("Asia/Kolkata");
  let TodayStartDateTimeStr, TodayEndDatetimeStr;
  switch (option) {
    case "Today":
      // Format the date and time
      const startOfDay = currentMoment
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ss");
      const endOfDay = currentMoment.endOf("day").format("YYYY-MM-DDTHH:mm:ss");
      TodayStartDateTimeStr = `${startOfDay}+00:00`;
      TodayEndDatetimeStr = `${endOfDay}+00:00`;
      return { TodayStartDateTimeStr, TodayEndDatetimeStr };

    case "Yesterday":
      const yesterdayStartOfDay = currentMoment
        .clone()
        .subtract(1, "day")
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ss");
      const yesterdayEndOfDay = currentMoment
        .clone()
        .subtract(1, "day")
        .endOf("day")
        .format("YYYY-MM-DDTHH:mm:ss");
      TodayStartDateTimeStr = `${yesterdayStartOfDay}+00:00`;
      TodayEndDatetimeStr = `${yesterdayEndOfDay}+00:00`;
      return { TodayStartDateTimeStr, TodayEndDatetimeStr };

    case "Last 7 Days":
      const weekStartOff = currentMoment
        .clone()
        .subtract(6, "days")
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ss");
      const weekEndOf = currentMoment
        .endOf("day")
        .format("YYYY-MM-DDTHH:mm:ss");
      TodayStartDateTimeStr = `${weekStartOff}+00:00`;
      TodayEndDatetimeStr = `${weekEndOf}+00:00`;
      return { TodayStartDateTimeStr, TodayEndDatetimeStr };

    case "Last 1 Month":
      const monthStartOff = currentMoment
        .clone()
        .subtract(1, "month")
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ss");
      const monthEndOf = currentMoment
        .endOf("day")
        .format("YYYY-MM-DDTHH:mm:ss");
      TodayStartDateTimeStr = `${monthStartOff}+00:00`;
      TodayEndDatetimeStr = `${monthEndOf}+00:00`;
      return { TodayStartDateTimeStr, TodayEndDatetimeStr };
  }
};
