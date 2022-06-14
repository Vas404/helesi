var router = require('express').Router()
var path = require('path')

router.get('/403', (req, res, next)=>{
    console.log('unauthorized')
    res.sendFile('/unauthorized.html', { root: 'app/static_error'})
})

module.exports = router