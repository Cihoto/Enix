const getChileanCurrency = (value) => {

    if (value < 0) {
        return `-$${Math.abs(value).toLocaleString('es-CL')}`;
    } else {
        return `$${value.toLocaleString('es-CL')}`;
    }
    // return value.toLocaleString('es-CL');
}