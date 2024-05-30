const { getFaktabyId } = require("./kulit.service");

const getHomeData = (req, res) => {
    const idFakta = Math.floor(Math.random() * 10) + 1;

    getFaktabyId(idFakta, (err, randomFakta) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).json({
                error: true,
                message: 'Internal server error'
            });
        }
        if (!randomFakta) {
            return res.status(404).json({
                error: true,
                message: 'Fact not found'
            });
        }
        return res.status(200).json({
            error: false,
            message: 'Home data fetched successfully',
            randomFakta: randomFakta
        });
    });
}

module.exports = { getHomeData };
