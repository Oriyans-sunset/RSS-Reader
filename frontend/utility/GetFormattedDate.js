export function GetFormattedDate(dateString) {
  const dateObj = new Date(dateString);

  // Get the individual date and time components
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1; // Months are zero-based, so add 1
  const day = dateObj.getDate();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();

  // Format the components as a normal date and time string
  const formattedDate = `${year}-${month}-${day}`;
  const formattedTime = `${hours}:${minutes}`;

  return formattedDate;
}

// Example usage
//const dateString = "2023-07-08T09:00:00-04:00";
//const { formattedDate, formattedTime } = formatDate(dateString);

//console.log(formattedDate); // Output: 2023-7-8
//console.log(formattedTime); // Output: 9:0:0
