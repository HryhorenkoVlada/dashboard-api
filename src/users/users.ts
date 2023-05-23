import express from 'express';

const router = express.Router();

router.post('/login', (req, res) => {
	res.send('Login');
});

router.post('/register', (req, res) => {
	res.send('Register');
});

export { router };
