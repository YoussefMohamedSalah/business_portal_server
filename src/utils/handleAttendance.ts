// Helper function to calculate the difference between login time and shift start time
export const handleStartWork = (userShiftStart: string, userLogInTime: string,) => {
	const shiftStartTime = parseTime(userShiftStart); // 06:00
	const logInTime = parseTime(userLogInTime); // 06:00

	// Check if the user logged in today
	const today = new Date().setHours(0, 0, 0, 0);
	const logInDate = new Date(logInTime).setHours(0, 0, 0, 0);
	const isLoggedToday = today === logInDate;

	// Calculate lateness/earliness
	const minutesLateOrEarly = calculateMinutesLateOrEarly(shiftStartTime, logInTime);

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
	console.log(lateTime, earlyTime)

	return {
		isLoggedToday, // true
		userStatus, // 'On time'
		late, early, absent,
		lateTime, earlyTime
	};
}

// Helper function to calculate total working hours and overtime
export const handleEndWork = (userShiftStart: string, userShiftEnd: string, userLogInTime: string, userLogOutTime: string,) => {
	const shiftStart = new Date(`2000-01-01 ${userShiftStart}`).getTime();
	const shiftEnd = new Date(`2000-01-01 ${userShiftEnd}`).getTime();
	const logIn = new Date(`2000-01-01 ${userLogInTime}`).getTime();
	const logOut = new Date(`2000-01-01 ${userLogOutTime}`).getTime();
	let workingTimeFormat = '00:00';
	let overtimeFormat = '00:00';

	if (logOut >= shiftStart && logIn <= shiftEnd) {
		// Calculate working hours only if the log-in and log-out times fall within the shift timings
		const start = Math.max(logIn, shiftStart);
		const end = Math.min(logOut, shiftEnd);
		let workingHours = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours

		// Calculate the regular working hours
		const regularHours = Math.floor(workingHours);
		const regularMinutes = Math.floor((workingHours - regularHours) * 60);

		// Format the regular working hours as a time string
		const formattedRegularHours = String(regularHours).padStart(2, '0');
		const formattedRegularMinutes = String(regularMinutes).padStart(2, '0');
		workingTimeFormat = `${formattedRegularHours}:${formattedRegularMinutes}`;
		// Calculate the overtime
		const totalWorkingHours = (shiftEnd - shiftStart) / (1000 * 60 * 60);
		const overtimeHours = (end - start) / (1000 * 60 * 60) - totalWorkingHours;
		const overtimeMinutes = Math.floor((overtimeHours - Math.floor(overtimeHours)) * 60);

		// calculate the over time only if user worked more than the shift hours
		if (totalWorkingHours <= workingHours) {
			// Format the overtime as a time string
			const formattedOvertimeHours = String(Math.floor(overtimeHours)).padStart(2, '0');
			const formattedOvertimeMinutes = String(overtimeMinutes).padStart(2, '0');
			overtimeFormat = `${formattedOvertimeHours}:${formattedOvertimeMinutes}`;
		}
	}
	return {
		workingTimeFormat,
		overtimeFormat
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

export const formatMinutesToTime = (minutes: number) => {
	const hours = Math.floor(minutes / 60);
	const formattedHours = String(hours).padStart(2, '0');
	const formattedMinutes = String(minutes % 60).padStart(2, '0');
	return `${formattedHours}:${formattedMinutes}`;
}