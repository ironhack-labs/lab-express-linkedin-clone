module.exports = {
  homeGet: (req, res) => {
    res.render('home', {title: `LinkedIn Home Page`})
  }
}
