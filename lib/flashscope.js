module.exports.FlashScope = {

    add : function(req, name, value) {
        req.session[name] = value;
    },

    retrieve: function(req, name) {
        var value = '';
        if (req.session[name]) {
            value = req.session[name]
            req.session[name] = ''
        }
        return value;
    }
};
