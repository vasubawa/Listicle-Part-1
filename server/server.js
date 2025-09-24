import express from 'express'
import bosses from './data/bosses.js'

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/data/bosses', (req, res) => {
    res.json(bosses)
})

app.get('/data/bosses/:id', (req, res) => {
    const id = req.params.id
    const boss = bosses.find(b => b.id === id)
    if (!boss) return res.status(404).json({ error: 'Boss not found' })
    res.json(boss)
})

app.get('/api', (req, res) => {
    res.json({
        message: 'Silksong Boss API',
        endpoints: {
            bosses: '/data/bosses',
            boss_detail: '/data/bosses/:id'
        }
    })
})

app.listen(3000, () => {
    console.log('Server running on port 3000')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
})