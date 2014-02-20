var presenter = module.exports;

presenter.uri = '/hello';

presenter.show = function (req, res) {
    res.send('Hello World!');
};