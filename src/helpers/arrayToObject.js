const flatArray = (arrays, unitName) => {
    if (unitName === "temperature"){
        arrays.forEach(array => {
            let dateTime = new Date(array[0]);
            let year = dateTime.getFullYear();
            let month = dateTime.getMonth();
            let day = dateTime.getDate();
            let hours = dateTime.getHours();
            let minute = dateTime.getMinutes();
            let formatedTime = `${year}-${month+1}-${day}:${hours}:${minute}`;
            array[0] = formatedTime;
        });
        return arrays.flat();
    }
    else if (unitName === "humidity"){
        arrays.forEach(array => {
            let dateTime = new Date(array[0]);
            let year = dateTime.getFullYear();
            let month = dateTime.getMonth();
            let day = dateTime.getDate();
            let hours = dateTime.getHours();
            let minute = dateTime.getMinutes();
            let formatedTime = `${year}-${month+1}-${day}:${hours}:${minute}`;
            array[0] = formatedTime;
        });
        return arrays.flat();
    }
}

module.exports = {
    flatArray
}