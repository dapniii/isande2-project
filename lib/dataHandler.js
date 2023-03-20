
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

// Generate sequential IDs
export function generateID(num, length) {
    return String(num + 1).padStart(length-1, "0").padStart(length,"1")
}

export function calcQuantityStatus (qty, rp) {
    const status = ["Out of Stock", "Low Stock", "In Stock"]

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

export function convertDataForAutoComplete(data) {

    let temp = []

    data.map(element => {
        temp.push({
            value: element.name,
            label: element.name
        })
    })

    return temp;
    
}