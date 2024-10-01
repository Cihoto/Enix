function calculatePaidPercentage (total, saldo) {
    const paidAmmount = total - saldo;
    return Math.round((paidAmmount * 100) / total);
}