export const generateTempPassword = () => {
    const min = 10000000; // Minimum 8-digit number
    const max = 99999999; // Maximum 8-digit number
    // Generate a random number between min and max (inclusive)
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
}

//   // Example usage
//   const randomNum = generateRandomNumber();
//   console.log(randomNum);