// Helper function to calculate the difference between login time and shift start time
export const handleStartWork = (userShiftStart: string, userLogInTime: string,) => {
	const shiftStartTime = parseTime(userShiftStart); // 06:00
	const logInTime = parseTime(userLogInTime); // 06:00

	// Check if the user logged in today
	const today = new Date().setHours(0, 0, 0, 0);
	const logInDate = new Date(logInTime).setHours(0, 0, 0, 0);
	const isLoggedToday = today === logInDate;

	// Calculate lateness/earliness
	const minutesLateOrEarly = calculateMinutesLateOrEarly(shiftStartTime, logInTime); // -90 min
	// Determine if the user is late, early, or on time
	let userStatus;
	let late: boolean;
	let early: boolean;
	let absent;
	let lateTime: string = '00:00:00';
	let earlyTime: string = '00:00:00';

	if (minutesLateOrEarly > 0) {
		userStatus = `Late by ${minutesLateOrEarly} minutes`;
		late = true;
		early = false;
		absent = false;
		lateTime = formatMinutesToTime(minutesLateOrEarly)
	} else if (minutesLateOrEarly < 0) {
		userStatus = `Early by ${Math.abs(minutesLateOrEarly)} minutes`;
		late = false;
		early = true;
		absent = false;
		earlyTime = formatMinutesToTime(Math.abs(minutesLateOrEarly))
	} else {
		userStatus = 'On time';
		late = false;
		early = false;
		absent = false;
	}

	return {
		isLoggedToday, // true
		userStatus, // 'On time'
		late, early, absent,
		lateTime, earlyTime, lateBy: minutesLateOrEarly
	};
}

// Helper function to calculate total working hours and overtime
export const handleEndWork = (userShiftStart: string, userShiftEnd: string, userLogInTime: string, userLogOutTime: string,) => {
	const shiftStart = new Date(`2000-01-01 ${userShiftStart}`).getTime();
	const shiftEnd = new Date(`2000-01-01 ${userShiftEnd}`).getTime();
	const logIn = new Date(`2000-01-01 ${userLogInTime}`).getTime();
	const logOut = new Date(`2000-01-01 ${userLogOutTime}:00`).getTime();
	let totalWorkingToReturn = '00:00';
	let overTimeToReturn = '00:00';
	let totalShiftMinutes = (shiftEnd - shiftStart) / (1000 * 60);
	let totalWorkingMinutes = (logOut - logIn) / (1000 * 60);

	if(totalWorkingMinutes > totalShiftMinutes) {
		let overTimeMinutes = totalWorkingMinutes - totalShiftMinutes;
		overTimeToReturn = formatMinutesToTime(overTimeMinutes);
	}
	totalWorkingToReturn = formatMinutesToTime(totalWorkingMinutes);
	return {
		workingTimeFormat: totalWorkingToReturn,
		overtimeFormat: overTimeToReturn
	}
}

// Helper function to parse time string in format "HH:mm" to Date object
export const parseTime = (timeString: string) => {
	const [hours, minutes] = timeString.split(':');
	const date = new Date();
	date.setHours(Number(hours));
	date.setMinutes(Number(minutes));
	return date;
}

// Helper function to calculate the difference in minutes between two time values
export const calculateMinutesLateOrEarly = (shiftStartTime: Date, logInTime: Date) => {
	const timeDiff = logInTime.getTime() - shiftStartTime.getTime();
	return Math.floor(timeDiff / 1000 / 60);
}
// Helper function to format minutes to time string in format "HH:mm"
export const formatMinutesToTime = (minutes: number) => {
	const hours = Math.floor(minutes / 60);
	const formattedHours = String(hours).padStart(2, '0');
	const formattedMinutes = String(minutes % 60).padStart(2, '0');
	return `${formattedHours}:${formattedMinutes}`; //01:30
}