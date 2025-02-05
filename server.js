const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const funFactCache = {}; // Cache to store fun facts for numbers

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
    const digits = Math.abs(num).toString().split("").map(Number);
    const power = digits.length;
    const sum = digits.reduce((acc, digit) => acc + Math.pow(digit, power), 0);
    return sum === Math.abs(num);
};

// Function to get digit sum (keeping negative sign)
const getDigitSum = (num) => {
    const absoluteSum = num
        .toString()
        .replace("-", "") // Remove negative sign temporarily
        .split("")
        .reduce((acc, digit) => acc + parseInt(digit), 0);
    
    return num < 0 ? -absoluteSum : absoluteSum; // Return negative sum for negative numbers
};

app.get("/api/classify-number", async (req, res) => {
    const { number } = req.query;

    // Validate input: must be an integer
    if (!number || isNaN(number)) {
        return res.status(400).json({ number, error: true, message: "Invalid number input" });
    }

    const num = Number(number);

    // Check if the number is a floating-point (including .0 cases)
    if (!Number.isInteger(num) || number.includes(".")) {
        return res.status(400).json({ number, error: true, message: "Floating point numbers are not allowed" });
    }

    const digitSum = getDigitSum(num);
    let properties = [num % 2 === 0 ? "even" : "odd"];

    if (isArmstrongNum(num)) {
        properties = ["armstrong", ...properties]; // Ensure "armstrong" appears first
    }

    try {
        let funFact;
        if (funFactCache[num]) {
            funFact = funFactCache[num]; // Use cached fun fact if available
        } else {
            const funFactResponse = await axios.get(`http://numbersapi.com/${num}/math`);
            funFact = funFactResponse.data;
            funFactCache[num] = funFact; // Cache the response
        }

        res.json({
            number: num,
            is_prime: isPrimeNum(num),
            is_perfect: isPerfectNum(num),
            properties,
            digit_sum: digitSum, // Now supports negative digit sums
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
