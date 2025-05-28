export const formatDateForInput = (dateTimeString) => {
    if (!dateTimeString) return '';

    let dateObj;
    if (typeof dateTimeString === 'string' && dateTimeString.includes(' ')) {
        dateObj = new Date(dateTimeString.replace(' ', 'T'));
    } else {
        dateObj = new Date(dateTimeString);
    }

    if (isNaN(dateObj.getTime())) return '';

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const formatTimeForInput = (dateTimeString) => {
    if (!dateTimeString) return '';

    let dateObj;
    if (typeof dateTimeString === 'string' && dateTimeString.includes(' ')) {
        dateObj = new Date(dateTimeString.replace(' ', 'T'));
    } else {
        dateObj = new Date(dateTimeString);
    }

    if (isNaN(dateObj.getTime())) return '';

    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

export const combineDateTime = (dateValue, timeValue) => {
    if (!dateValue || !timeValue) return '';
    return `${dateValue}T${timeValue}:00`;
};

export const format12HourTime = (dateTimeString) => {
    if (!dateTimeString) return '';

    let dateObj;
    if (typeof dateTimeString === 'string' && dateTimeString.includes(' ')) {
        dateObj = new Date(dateTimeString.replace(' ', 'T'));
    } else {
        dateObj = new Date(dateTimeString);
    }

    if (isNaN(dateObj.getTime())) return '';

    return dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
};

export const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};