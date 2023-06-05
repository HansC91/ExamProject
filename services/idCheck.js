
async function idCheck(req, res, next) {
    const id = req.params.id
    //to avoid decimal numbers being rounded
    if(isNaN(id) || id.includes('.')) {
      return res.status(409).json({ Conflict: "id is not in correct format, please enter a whole number"});
    }
    next();
  }
module.exports = idCheck;