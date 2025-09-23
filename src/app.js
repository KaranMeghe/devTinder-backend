const express = require('express');
const app = express();
const connectDb = require('./config/database');
const User = require('./models/user');
app.use(express.json());

const bcrypt = require('bcrypt');
const sanitizeUserInput = require('./middlewares/sanitize');
const sanitizeUpdateInput = require('./middlewares/sanitizeUpdateInput');

// Create new user
app.post('/signup', sanitizeUserInput, async (req, res) => {
    try {
        // Encrypt the password 
        const { password, ...rest } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);

        const userData = { ...rest, password: passwordHash };
        // creating new istance of the User Model (class)
        const user = new User(userData);
        console.log("Req Body", userData);
        // save user in DB
        await user.save();

        // proper structured response 
        return res.status(201).json({
            success: true,
            message: "User Created Successfully",
            data: user
        });

    } catch (err) {
        console.error("Signup Error:", err);

        // Duplicate Email Error (MongoDB Code)
        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exist"
            });
        }

        // Validation error
        if (err.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        // Fallback for unknown errors
        return res.status(500).json({
            success: false,
            message: "Something went wrong on the server"
        });

    }
});

// Feed API - GET/feed - get all users from database
app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({});

        res.status(200).json({
            success: true,
            message: users.length > 0 ? "Users fetched successfully" : "No users found",
            data: users
        });

    } catch (err) {
        console.error("Feed Error:", err);
        res.status(500).json({
            success: false,
            message: `Somthing went wrong on the server: ${err.message}`
        });
    }
});

// Get user from email
app.get('/user', async (req, res) => {

    try {
        //check if email is provided or not
        const { emailId } = req.body;
        if (!emailId) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // what if user not found
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // send response 
        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user
        });


    } catch (err) {
        console.error("Get User Error:", err);
        res.status(500).json({
            success: false,
            message: `Something went wrong on the server: ${err.message}`
        });
    }
});


// Deleting user by id
app.delete("/user", async (req, res) => {
    const { _id } = req.body;

    try {
        const user = await User.findByIdAndDelete(_id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        } else {
            res.status(200).json({
                success: true,
                message: `User Deleted Successfully: ${user.firstName} ${user.lastName}`,
                data: null
            });
        }
    } catch (err) {
        console.error("Delete User Error:", err);
        res.status(500).json({
            success: false,
            message: `Something went wrong on the server: ${err.message}`
        });
    }
});

// Update user by id
app.patch('/user/:userId', sanitizeUpdateInput, async (req, res) => {
    const updatedData = req.body;
    const userId = req.params?.userId;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID (_id) is required"
        });
    }

    try {
        const user = await User.findOneAndUpdate(
            { _id: userId },
            updatedData,
            { returnDocument: "after", runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: user
            });
        }
    } catch (err) {
        console.error("Update User Error:", err);
        res.status(500).json({
            success: false,
            message: `Something went wrong on the server: ${err.message}`
        });
    }
});


connectDb().then(() => {
    app.listen(7777, () => {
        console.log("Server is successfully created on port no 7777");
    });
});
