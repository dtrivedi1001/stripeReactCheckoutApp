const stripe = require("stripe")("sk_test_ycPljLCVZt4Y3Wcff5eCfRJr");
const Counter = require('../../models/Counter');

module.exports = (app) => {
  app.get('/api/counters', (req, res, next) => {
    Counter.find()
      .exec()
      .then((counter) => res.json(counter))
      .catch((err) => next(err));
  });

  app.post('/api/stripe', function (req, res, next) {
    console.log('Request Body');
    console.log(req.body);
    const token = req.body.source.id;
    console.log('Token after process');
    console.log(token);

 stripe.charges.create({
        amount: 4900,
        currency: 'cad',
        description: 'Example charge',
        source: token,
        statement_descriptor: 'Custom descriptor',
      }, function(err,charge){
        console.log('charge');
        console.log(charge);
        console.log('Err');
   console.log(err);
        if(err){
          res.send({
            success: false,
            message: 'Error'
          });
        }else{
          res.send({
            success: true,
            message: 'Success'
        });
      }
    });
  });

  app.delete('/api/counters/:id', function (req, res, next) {
    Counter.findOneAndRemove({ _id: req.params.id })
      .exec()
      .then((counter) => res.json())
      .catch((err) => next(err));
  });

  app.put('/api/counters/:id/increment', (req, res, next) => {
    Counter.findById(req.params.id)
      .exec()
      .then((counter) => {
        counter.count++;

        counter.save()
          .then(() => res.json(counter))
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  });

  app.put('/api/counters/:id/decrement', (req, res, next) => {
    Counter.findById(req.params.id)
      .exec()
      .then((counter) => {
        counter.count--;

        counter.save()
          .then(() => res.json(counter))
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  });
};
