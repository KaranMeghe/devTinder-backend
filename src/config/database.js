const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        await mongoose.connect('mongodb+srv://karanmeghe87:6FV2qoCysqqZIPaY@namastenode11.j6iqwrr.mongodb.net/devTinder');
        console.log("Datbase connection established");
    } catch (err) {
        console.error("Error:", err);
    }
};

module.exports = connectDb;