const Transaction = require('../models/Transaction');  // Bring our model in so we can use mongoDB functions like create, find, remove

// @description - Get all transactions
//@route - GET /api/v1/transactions

exports.getTransactions = async (req,res,next) => {  // using await as this a promise
    try {
        const transactions = await Transaction.find();  // Using model (Transaction.js) to use find() method.  

        return res.status(200).json({  // status code 200 means everything went OK
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (err) {
        return res.status(500).json({
            success: false,             // False as this is an error
            error: 'Server Error'       // Message 'Server Error' will be displayed
        });
    }
}

// @description - Add transaction
//@route - POST /api/v1/transactions

exports.addTransaction = async (req,res,next) => {
    try {
        
        const {text,amount} = req.body;  // req.body is the data which we entered 

        const transaction = await Transaction.create(req.body) // This will create a transaction with the data we entered using create() mongoBD method

        return res.status(201).json({ 
            success: true,
            data: transaction  // transaction is the variable we just created above
        });
    } catch (err) {
        if(err.name == 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);

            return res.status(400).json({
                success: false,
                error: messages 
            });
        } 
        else {
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
        
    }
}

// @description - Delete transaction
//@route - DELETE /api/v1/transactions/:id

exports.deleteTransaction = async (req,res,next) => {
    try {
        const transaction = await Transaction.findByIdAndRemove(req.params.id);

        if(!transaction) {                          // If transaction is not found
            return res.status(404).json({
                success: false,
                error: 'No transaction found'
            });
        }
        
        return res.status(200).json({   // Will return this if successfully deleted from database
            success: true,
            data: {}
        });
    } catch (err) {
        return res.status(500).json({  // If not successfully deleted from database
            success: false,
            error: 'Server Error'
        });
    }
}



