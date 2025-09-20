const express = require('express');
const app = express();
const connectDb = require('./config/database');
const User = require('./models/user');
app.use(express.json());

const sanitizeUserInput = require('./middlewares/sanitize');

// Create new user
app.post('/signup', sanitizeUserInput, async (req, res) => {
    try {
        // creating new istance of the User Model (class)
        const user = new User(req.body);
        console.log("Req Body", req.body);
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
            res.status(409).json({
                success: false,
                message: "User with this email already exist"
            });
        }

        // Validation error
        if (err.name === "ValidationError") {
            res.status(400).json({
                success: false,
                message: err.message
            });
        }

        // Fallback for unknown errors
        res.status(500).json({
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
app.patch('/user', async (req, res) => {
    const { _id, ...updatedData } = req.body;

    if (!_id) {
        return res.status(400).json({
            success: false,
            message: "User ID (_id) is required"
        });
    }

    try {
        const user = await User.findOneAndUpdate(
            { _id },
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
