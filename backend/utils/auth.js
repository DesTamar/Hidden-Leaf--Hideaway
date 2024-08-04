const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Spot, SpotImage, Review } = require('../db/models');
const { where } = require('sequelize');

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
  // error.message = "Couldn't find a Spot with the specified id"
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
const imageAuth = async (req,res,next) => {
  const { spotId } = req.params
  let spots = await Spot.findAll({
    where: {
      id: spotId
    }
  })
  if (spots.length) return next()
  const error = new Error("Couldn't find a Spot with the specified id")
  // error.message = "Couldn't find a Spot with the specified id"
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
  err.status = 403;
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
  err.status = 403;
  return next(err)

}


const isValid = async (req, res, next) => {
  const { spotId } = req.params
  const {user} = req
  
  try {
    await Spot.create({
      ...req.body,
      spotId,
      userId: user.id
    })
    next()
  } catch (error) {
    error.message = "Bad request"
    error.status = 400
     return next(error)
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
    return next(error)
  }
}
const isValidReview = async (req, res, next) => {
  let { spotId } = req.params
  const {user} = req
  if (!spotId) {
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
      spotId,
      userId: user.id
    })
     return next()
  } catch (error) {
    error.message = "Bad request"
    error.status = 400
    return next(error)
  }
}
const revExist = async (req,res,next) => {

  const { spotId } = req.params
  const { user } = req

  const spot = await Spot.findOne({
    where: {
      id: spotId
    },
    include: [{
      model: Review
    }]
  })

  const reviews = spot.Reviews
  for (const review of reviews) {
    if (review.userId === user.id) {
      const err = new Error('Review from the current user already exists for the Spot')
      err.status = 500
     return  next(err)
    }
  }
 return  next ()
}

const validDates = (req, res, next) => {
  const {startDate,endDate} = req.body  
  let arr = startDate.split("-")
  let numArr = arr.map((num,i) => {
    if (i === 2){
      return Number(num) + 1
    }
    return Number(num)
  });
  let arr2 = endDate.split("-")
  let numArr2 = arr2.map((num,i) => {
    if (i === 2){
      return Number(num) + 1
    }
    return Number(num)
  });
  let end = new Date(`${numArr2.join('-')}`)
  let start = new Date(`${numArr.join('-')}`)
  
  const present = new Date()
  let err = new Error()
  err.errors = {}
if(start.getTime() <= present.getTime() || start.getDate() >= end.getDate()){
  if(start.getTime() <= present.getTime()){
    err.errors.startDate = "startDate cannot be in the past"  
  }
  if(start.getDate() >= end.getDate()){
    err.errors.endDate = "endDate cannot be on or before startDate"
  }
  err.message = "Bad request"
  err.status = 400
 return next(err)
}
 return next ()

}


module.exports = { setTokenCookie,validDates,revExist, restoreUser, requireAuth, spotAuth, isOwner, isValid, isValidImage, isValidReview, isReviewOwner, revAuth };