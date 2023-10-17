

export type CheckLocationInputType = {
    userLatitude: number,
    userLongitude: number,
    projectLatitude: number,
    projectLongitude: number
}


export const isNearToProject = (checkLocationInput:CheckLocationInputType): boolean => {
    const {userLatitude, userLongitude, projectLatitude, projectLongitude} = checkLocationInput;
    console.log(checkLocationInput)
    const R = 6371; // Radius of the Earth in kilometers
    const latDiff = toRadians(projectLatitude - userLatitude);
    const lonDiff = toRadians(projectLongitude - userLongitude);
    const a =
        Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
        Math.cos(toRadians(userLatitude)) *
        Math.cos(toRadians(projectLatitude)) *
        Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance <= 3; // Return true if the distance is less than or equal to 3 km, otherwise false
}

function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}