function padNumber(number, maxLength, fillString) {
    return `${number}`.padStart(maxLength, fillString);
  }
  
  /*
  @params date: Date 
  @returns dateString: DD-MM-YYYY
  */
  function formatDate(date) {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; // Add 1 to get the correct month
    const day = dateObj.getDate(); // Use getDate() to get the day of the month
    return `${padNumber(day, 2, '0')}-${padNumber(month, 2, '0')}-${year}`;
  }
  
  // Example usage:
  console.log(formatDate(new Date()));