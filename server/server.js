// Import express
import express from 'express'

// Initialize express
const app = express();

// Middlewear
// Serves files from client
app.use('/public', express.static('./public'))
app.use('/script', express.static('./public/scrips'))


// Starts the server on port 3001

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
})