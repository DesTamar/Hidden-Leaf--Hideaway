const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Spot, SpotImage, Review } = require('../db/models');

const { secret, expiresIn } = jwtConfig;


const setTokenCookie = (res, user) => {

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  const token = jwt.sign(
    { data: safeUser },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie('token', token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax"
  });

  return token;
};


const restoreUser = (req, res, next) => {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.findByPk(id, {
        attributes: {
          include: ['email', 'createdAt', 'updatedAt']
        }
      });
    } catch (e) {
      res.clearCookie('token');
      return next();
    }

    if (!req.user) res.clearCookie('token');

    return next();
  });
};

// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
  const { user } = req
  if (user) return next();

  const err = new Error('Authentication required');
  err.title = 'Authentication required';
  err.errors = { message: 'Authentication required' };
  err.status = 401;
  return next(err);
}


const spotAuth = async (req, res, next) => {
  const { spotId } = req.params
  let spots = await Spot.findAll({
    where: {
      id: spotId
    }
  })
  if (spots.length) return next()
  const error = new Error("Couldn't find a Spot with the specified id")
  error.status = 404
  return next(error)

}
const revAuth = async (req, res, next) => {
  const { reviewId } = req.params
  let spots = await Review.findAll({
    where: {
      id: reviewId
    }
  })
  if (spots.length) return next()
  const error = new Error("Couldn't find a Review with the specified id")
  error.status = 404
  return next(error)

}
const isOwner = async (req, res, next) => {
  const { user } = req
  const { spotId } = req.params
  const spot = await Spot.findOne({
    where: {
      id: spotId
    }
  })
  if (user.id == spot.ownerId) return next()

  const err = new Error('You are not the owner')
  err.title = 'Not the owner'
  err.errors = { message: 'Not the owner' };
  err.status = 401;
  return next(err)

}
const isReviewOwner = async (req, res, next) => {
  const { user } = req
  const { reviewId } = req.params
  const rev = await Review.findOne({
    where: {
      id: reviewId
    }
  })
  if (user.id == rev.userId) return next()

  const err = new Error('You are not the owner')
  err.title = 'Not the owner'
  err.errors = { message: 'Not the owner' };
  err.status = 401;
  return next(err)

}



const isValid = async (req, res, next) => {
  const { spotId } = req.params
  try {
    await Spot.create({
      ...req.body,
      spotId
    })
    next()
  } catch (error) {
   
    error.status = 400
    next(error)
  }
}
const isValidImage = async (req, res, next) => {
  const { spotId } = req.params
  try {
    await SpotImage.create({
      ...req.body,
      spotId
    })
    next()
  } catch (error) {
   
    error.status = 400
    next(error)
  }
}
const isValidReview = async (req, res, next) => {
  let  { spotId } = req.params
  if (!spotId){
    const { reviewId } = req.params
    
    const edit = await Review.findOne({
        where: {
            id: reviewId
        },
        include: [{
            model: Spot
        }]
    })
     spotId = edit.Spot.id
  }
  try {
    await Review.create({
      ...req.body,
      spotId
    })
    next()
  } catch (error) {
   
    error.status = 400
    next(error)
  }
}


module.exports = { setTokenCookie, restoreUser, requireAuth, spotAuth, isOwner, isValid ,isValidImage,isValidReview,isReviewOwner,revAuth};