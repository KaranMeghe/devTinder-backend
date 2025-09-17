const express = require('express');
const app = express();
const connectDb = require('./config/database');
const User = require('./models/user');

app.use(express.json());

app.post('/signup', async (req, res) => {

    // creating new istance of the User Model (class)
    const user = new User(req.body);
    console.log("Req Body", req.body);
    await user.save();
    try {
        if (!user) {
            return res.status(404).send(`Signup failed`);
        } else {
            res.send("User Created Sucessfully");
        }
    } catch (err) {
        res.status(400).send(`Something went wrong: ${err.message}`);
    }
});

// Feed API - GET/feed - get all users from database
app.get('/feed', async (req, res) => {
    const users = await User.find({});
    try {
        if (users.length === 0) {
            res.status(401).send(`Users data not found`);
        } else {
            res.json(users);
        }
    } catch (err) {
        res.status(500).send(`Somthing went wrong: ${err.message}`);
    }
});

// Get user from email
app.get('/user', async (req, res) => {
    const userEmail = req.body.emailId;
    const user = await User.find({ emailId: userEmail });

    try {
        if (user.length === 0) {
            res.status(404).send(`User not found`);
        } else {
            const user = await User.find({ emailId: userEmail });
            res.json(user);
        }
    } catch (err) {
        res.status(400).send(`Something went wrong: ${err.message}`);
    }
});


// Deleting user by id
app.delete("/user", async (req, res) => {
    const { _id } = req.body;
    console.log(`This is user_id, ${_id}`);

    try {
        const user = await User.findByIdAndDelete(_id);

        if (!user) {
            return res.status(404).send("User not found");
        } else {
            res.send(`User Deleted Successfully: ${user.firstName} ${user.lastName}`);
        }
    } catch (err) {
        res.status(400).send(`Something went wrong: ${err.message}`);
    }
});

// Update user by id
app.patch('/user', async (req, res) => {
    const { _id } = req.body;
    const updatedData = req.body;

    try {
        const user = await User.findOneAndUpdate({ _id }, updatedData, { returnDocument: "after" });
        if (!user) {
            return res.status(404).send("User not found");
        } else {
            return res.send(`User updated successfully`, user);
        }
    } catch (err) {
        res.status(400).send(`Something went wrong: ${err.message}`);
    }
});


connectDb().then(() => {
    app.listen(7777, () => {
        console.log("Server is successfully created on port no 7777");
    });
});
