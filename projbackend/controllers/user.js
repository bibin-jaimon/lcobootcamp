const User = require('../models/user');
const Order = require('../models/order');

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.json({
                error: 'No user found'
            })
        }
        req.profile = user
        next()
    })
}

exports.getUser = (req, res) => {
    req.profile.encry_password = undefined
    req.profile.salt = undefined
    req.profile.createdAt = undefined
    req.profile.updatedAt = undefined
    return res.json(req.profile)
}

exports.getAllUsers = (req, res) => {
    User.find().exec((err, users) => {
        if (err || !users) {
            return res.status(400).json({
                error: 'No users list available'
            })
        }
        console.log(users)
        res.json(users)
    })
}

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.profile._id },
        { $set: req.body },
        { new: true, useFindAndModify: false },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: 'You are not authorized to update the user'
                })
            }
            user.salt = undefined
            user.encry_password = undefined
            user.updatedAt = undefined
            user.createdAt = undefined
            res.json(user)
        }
    )
}

exports.userPurchaseList = (req, res) => {
    Order.find({ user: req.profile._id })
    .populate('user', '_id name')
    .exec((err, orders) => {
        if (err) {
            return res.status(400).json({
                error: 'No orders in this account'
            })
        }
        return res.json(orders)
    })
}

exports.pushOrderInPurchaseList = (req, res, next) => {
    
    let purchases = [];
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        })
    })

    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { purchases: purchases } },
        { new: true },
        (err, purchases) => {
            if (err) {
                return res.status(400).json({
                    error: 'Unable to save purchases list'
                });
            }
            next()
        }
    )
}