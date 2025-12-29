import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: "Organization route placeholder" });
});

export default router;
