export const calculateDates = (setFormattedDate, setMaxDate) => {
    const today = new Date();

    if (!(today instanceof Date) || isNaN(today)) {
        console.error("Invalid date");
    } else {
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');

        const newFormattedDate = `${year}-${month}-${day}`;
        setFormattedDate(newFormattedDate);

        today.setMonth(today.getMonth() + 3);
        const maxYear = today.getFullYear();
        const maxMonth = (today.getMonth() + 1).toString().padStart(2, '0');
        const maxDay = today.getDate().toString().padStart(2, '0');
        const newMaxDate = `${maxYear}-${maxMonth}-${maxDay}`;
        setMaxDate(newMaxDate);
    }
}

export const calculateDate28Day = (setFormattedDate, setMaxDate) => {
    const today = new Date();

    if (!(today instanceof Date) || isNaN(today)) {
        console.error("Invalid date");
    } else {
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');

        const newFormattedDate = `${year}-${month}-${day}`;
        setFormattedDate(newFormattedDate);

        today.setDate(today.getDate() + 28); // Adding 28 days
        const maxYear = today.getFullYear();
        const maxMonth = (today.getMonth() + 1).toString().padStart(2, '0');
        const maxDay = today.getDate().toString().padStart(2, '0');
        const newMaxDate = `${maxYear}-${maxMonth}-${maxDay}`;
        setMaxDate(newMaxDate);
    }
}
