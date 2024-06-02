const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5300;
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("Traverse server is running.");
})

app.listen(port, () => {
    console.log(`Traverse server is running on port: ${port}`)
})
