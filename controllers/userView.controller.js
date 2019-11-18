const userView = require('../models/userView.model');

//Simple version, without validation or sanitation
exports.userView = function (req, res) {
    res.send('Greetings from the Test controller!');
};

exports.userViewPost = function (req, res) {
	let user = new userView(
        {
            userId: "ABC",
            viewDate: new Date(),
            productId: req.body.product
        }
    );

    user.save(function (err) {
        if (err) {
            return next(err);
        }
        const findQuery = [];


	if(req.body.date == "custom"){

		console.log("date0", new Date(req.body.custom).toISOString());
		findQuery.push({
	        $match: {
	            productId: req.body.product,
	            viewDate: new Date(req.body.custom).toISOString()
	        }
    	})
	}else{
		findQuery.push({
	        $match: {
	            productId: req.body.product
	        }
    	})
	}

        

		if(req.body.date == "daily"){
			findQuery.push({
                '$project': {
                    timestamp: {'$dateToString': {format: '%Y-%m-%d', date: '$viewDate'}}}
            }, {
                '$group': {
                    _id: {timestamp: '$timestamp'},
                    count: {'$sum': 1}
                }
            })
		}

	if(req.body.date == "monthly" || req.body.date == "weekly"){

		findQuery.push({ "$group": {
	        "_id": {
	            "$add": [
	                { "$subtract": [
	                    { "$subtract": [ "$viewDate", new Date(0) ] },
	                    { "$mod": [
	                        { "$subtract": [ "$viewDate", new Date(0) ] },
	                        1000 * 60 * 60 * 24
	                    ]}                        
	                ]},
	                new Date(0)
	            ]
	        },
	        "week": { "$first": { "$week": "$viewDate" } },
	        "month": { "$first": { "$month": "$viewDate" } },
	        "count": { "$sum": 1 }
	    }},
	    // Then group by week
	    { "$group": {
	        "_id": "$week",
	        "month": { "$first": "$month" },
	        "days": {
	            "$push": {
	                "day": "$_id",
	                "count": "$count"
	            }
	        },
	        "count": { "$sum": "$count" }
	    }},
		 // Then group by month
	    { "$group": {
	        "_id": "$month",
	        "weeks": {
	            "$push": {
	                "week": "$_id",
	                "count": "$count",
	                "days": "$days"
	            }
	        },
	        "count": { "$sum": "$count"	 }
	    }})

	     if(req.body.date == "weekly"){
			findQuery.push({ "$unwind": "$weeks" })
		}
	
	}
		userView.aggregate(findQuery, function (err, data){
			if (err) {
				res.send('Product not found')
			} else {
				console.log("data", data)
			
					res.render('userView', {data: data, "date": req.body.date})
			
			}
		})
})
}
