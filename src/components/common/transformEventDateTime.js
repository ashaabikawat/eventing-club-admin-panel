// Utility function to transform event date and time
export const transformEventDateTime = (EventDateTime) => {
  return EventDateTime.map((event) => {
    const [EventEndDate, EventEndTime] = event.EventEndDateTime.split("T");
    const [EventStartDate, EventStartTime] =
      event.EventStartDateTime.split("T");

    return {
      ...event,
      EventEndDate,
      EventEndTime: EventEndTime.split(".")[0], // Removing milliseconds and Z
      EventStartDate,
      EventStartTime: EventStartTime.split(".")[0], // Removing milliseconds and Z
    };
  });
};
