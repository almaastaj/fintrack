export const currencyFormatter = (amount) => {
    const formatter = Intl.NumberFormat("en-IN", {
        currency: "INR",
        style: "currency",
    });

    return formatter.format(amount);
};

export const dateFormatter = (isoString) => {
    const date = new Date(isoString);
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
    };

    return date.toLocaleDateString("en-IN", options);
};
