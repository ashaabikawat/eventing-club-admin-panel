const getMonthName = (monthIndex) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthIndex];
};

export const formatDate2 = (dateString) => {
  // Split the string into date and time components
  const parts = dateString.split(" ");
  const dateParts = parts[0].split("-");
  const timeParts = parts[1].split(":");

  // Parse the date and time parts into integers
  const day = parseInt(dateParts[0], 10);
  const monthIndex = parseInt(dateParts[1], 10) - 1; // Month index is 0-based
  const year = parseInt(dateParts[2], 10);
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  const seconds = parseInt(timeParts[2], 10);

  // Create a new Date object with the parsed values
  const date = new Date(year, monthIndex, day, hours, minutes, seconds);

  // Format the date into a more readable form
  return `${day} ${getMonthName(monthIndex)} ${year}`;
};

export const formatDate3 = (dateString) => {
  // Split the string into date components

  // console.log({ dateString });

  const dateParts = dateString.split("-");

  // Parse the date parts into integers
  const year = parseInt(dateParts[0], 10);
  const monthIndex = parseInt(dateParts[1], 10) - 1; // Month index is 0-based
  const day = parseInt(dateParts[2], 10);

  // Format the date into a more readable form
  return `${getMonthName(monthIndex)} ${day}, ${year}`;
};
