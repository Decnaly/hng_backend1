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
    if (num < 1) return false;
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
    const absNum = Math.abs(num); 
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

    try {
        // Fetch fun fact from API
        let funFact;
        if (funFactCache[num]) {
            funFact = funFactCache[num];
        } else {
            const funFactResponse = await axios.get(`http://numbersapi.com/${num}/math`);
            funFact = funFactResponse.data;
            funFactCache[num] = funFact; // Store in cache
        }

        // Send response with fun fact
        res.json({
            number: num,
            is_prime: isPrimeNum(num),
            is_perfect: isPerfectNum(num),
            properties,
            digit_sum: digitSum,
            fun_fact: funFact
        });

    } catch (error) {
        res.json({
            number: num,
            is_prime: isPrimeNum(num),
            is_perfect: isPerfectNum(num),
            properties,
            digit_sum: digitSum,
            fun_fact: "Fun fact unavailable"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
