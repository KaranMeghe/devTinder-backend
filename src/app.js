const express = require('express');
const app = express();
const connectDb = require('./config/database');
const User = require('./models/user');


app.post('/signup', async (req, res) => {
    const user = new User({
        firstName: "Jerry",
        lastName: "Rons",
        email: "roseJerry89@gmail.com",
        password: "6788dgshav",
        age: 49,
        gender: "Male",
    });

    try {
        await user.save();
        res.send("User Created Sucessfully");
    } catch (err) {
        res.status(400).send(`Error saving the user: ${err.message}`);
    }
});

connectDb().then(() => {
    app.listen(7777, () => {
        console.log("Server is successfully created on port no 7777");
    });
});
