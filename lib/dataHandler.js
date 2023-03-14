const status = ["Out of Stock", "Low Stock", "In Stock"]

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export function calcQuantityStatus (qty, rp) {
    if (qty == 0) {
        return status[0];
    }
    else if (qty <= rp) {
        return status[1];
    }
    else {
        return status[2];  
    }
  
}

export function addCommasToNum(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}