const { verify } = require('jsonwebtoken');

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get('authorization');
        if (token) {
            token = token.slice(7); // Menghapus kata "Bearer " dari token
            console.log('Token diterima:', token); // Log untuk token

            verify(token, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    console.error('Token tidak valid:', err);
                    return res.status(401).json({
                        error: true,
                        message: 'Token tidak valid'
                    });
                } else {
                    console.log('Token terverifikasi, payload:', decoded); // Log untuk payload
                    req.user = decoded.result; // Menyimpan data decoded ke req.user
                    next();
                }
            });
        } else {
            console.error('Token tidak tersedia');
            return res.status(403).json({
                error: true,
                message: 'Akses ditolak, penggunaan tidak sah'
            });
        }
    }
};