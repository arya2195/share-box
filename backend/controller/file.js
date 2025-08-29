export const uploadFile = (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }
    