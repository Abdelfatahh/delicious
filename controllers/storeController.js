exports.myMiddleware = (req, res, next) =>{
    req.name = 'Wex'
    next();
};

exports.homepage = (req, res) => {
    res.render('index')
}
