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
    const digits = num.toString().split("").map(Number);
    const sum = digits.reduce((acc, digit) => acc + Math.pow(digit, digits.length), 0);
    return sum === num;
};

app.get("/api/classify-number", async (req, res) => {
    const { number } = req.query;
    if (!number || isNaN(number)) {
        return res.status(400).json({ number, error: true });
    }
    
    const num = parseInt(number);
    const digitSum = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    const properties = [num % 2 === 0 ? "even" : "odd"];
    if (isArmstrongNum(num)) properties.unshift("armstrong");
    
    try {
        const funFactResponse = await axios.get(`http://numbersapi.com/${num}/math`);
        res.json({
            number: num,
            is_prime: isPrimeNum(num),
            is_perfect: isPerfectNum(num),
            properties,
            digit_sum: digitSum,
            fun_fact: funFactResponse.data
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
