import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import mainRoutes from './routes/mainRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config({ path: '.env.development' })
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || '').then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api', mainRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Shawty backend API!');
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
