var command = module.exports;

command.uri = '/say-hello';

command.execute = function (req, redirectCallback) {
    redirectCallback("/hello")
}
