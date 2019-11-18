const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const userView_controller = require('../controllers/userView.controller');
const data = "";

// a simple test url to check that all of our files are communicating correctly.
//router.get('/userView', userView_controller.userView);module.exports = router;
router.get('/userView', (req, res) => {
  res.render('userView', {data})
})
router.post('/userViewPost', userView_controller.userViewPost);
// router.post('/userViewPost', (req, res) => {
// 	//console.log("test route")
//   res.render('userView', {
//     data: req.body, // { message, email }
//     errors: {
//       message: {
//         msg: 'A message is required'
//       },
//       email: {
//         msg: 'That email doesn‘t look right'
//       }
//     }
//   })
// })
module.exports = router
