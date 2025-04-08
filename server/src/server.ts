import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Shawty backend API!');
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
