const { Router } = require('express');
const {
  getAllOutfits,
  getOutfitById,
  createOutfit,
  updateOutfitById,
  deleteOutfitById,
} = require('../controllers/outfit');
const { validateJWT } = require('../middlewares/verifyJWT');

const router = Router();

router.get('/', [validateJWT], getAllOutfits);
router.get('/:id', [validateJWT], getOutfitById);
router.post('/', [validateJWT], createOutfit);
router.put('/:id', [validateJWT], updateOutfitById);
router.delete('/:id', [validateJWT], deleteOutfitById);

module.exports = router;
