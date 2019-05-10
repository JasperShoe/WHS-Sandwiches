function getNextPickupDateFrom(startDate) {
    let nextPickupDate = new Date(startDate);
    if (startDate.getHours() >= 8) {
        nextPickupDate.setDate(startDate.getDate() + 1);
    }
    while (!isPickupDate(nextPickupDate)) {
        nextPickupDate.setDate(nextPickupDate.getDate() + 1)
    }
    return nextPickupDate;


}
function getPreviousPickupDateFrom(startDate) {
    let prevPickupDate = new Date(startDate);
    if (isPickupDate(startDate)) {
        prevPickupDate.setDate(startDate.getDate()-1)
    }
    while (!isPickupDate(prevPickupDate)) {
        prevPickupDate.setDate(prevPickupDate.getDate() - 1)
    }
    return prevPickupDate;
}

function isPickupDate(date) {
    switch (date.getDay()) {
        case 1:
        case 2:
        case 3:
            return true;
        default:
            return false;

    }
}