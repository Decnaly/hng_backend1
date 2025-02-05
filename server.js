const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Function to check if a number is prime
const isPrimeNum = (num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

// Function to check if a number is a perfect number
const isPerfectNum = (num) => {
    if (num < 1) return false; // Negative numbers are not perfect numbers
    let sum = 1;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            sum += i;
            if (i !== num / i) sum += num / i;
        }
    }
    return sum === num && num !== 1;
};

// Function to check if a number is an Armstrong number
const isArmstrongNum = (num) => {
    const absNum = Math.abs(num); // Take absolute value for negative numbers
    const digits = absNum.toString().split("").map(Number);
    const sum = digits.reduce((acc, digit) => acc + Math.pow(digit, digits.length), 0);
    return sum === absNum;
};

// Function to calculate digit sum (ignoring negative sign)
const getDigitSum = (num) => {
    return Math.abs(num).toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
};

// Cache to store fun facts for numbers
const funFactCache = {};

app.get("/api/classify-number", async (req, res) => {
    const { number } = req.query;
    if (!number || isNaN(number)) {
        return res.status(400).json({ number, error: true });
    }
    
    const num = parseInt(number);
    const digitSum = getDigitSum(num);
    const properties = [num % 2 === 0 ? "even" : "odd"];
    if (isArmstrongNum(num)) properties.unshift("armstrong");

    // Prepare response object (send without waiting for fun fact)
    const responseData = {
        number: num,
        is_prime: isPrimeNum(num),
        is_perfect: isPerfectNum(num),
        properties,
        digit_sum: digitSum,
        fun_fact: funFactCache[num] || "Loading..."
    };

    res.json(responseData);

    // Fetch fun fact asynchronously if not in cache
    if (!funFactCache[num]) {
        try {
            const funFactResponse = await axios.get(`http://numbersapi.com/${num}/math`);
            funFactCache[num] = funFactResponse.data;
        } catch (error) {
            funFactCache[num] = "Fun fact unavailable";
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
