const express = require('express');

const app = express();

app.listen(3001, () => {
    console.log("Server is successfully created on port no 3001");
});

app.use('/test/1', (req, res) => {
    res.send("Hello from test 1");
});

app.use('/test', (req, res) => {
    res.send("Hello From The Server");
});


app.use("/service", (req, res) => {
    res.send("Services will load soon");
});

app.use("/react", (req, res) => {
    res.send("React for Front End!");
});


app.get('/user', (req, res) => {
    res.send({ firstName: "Akshay", lastName: "Saini" });
});

app.post('/user', (req, res) => {
    res.send("User data successfully saved to Database");
});

app.delete('/user', (req, res) => {
    res.send("User Deleted Sucessfully");
});