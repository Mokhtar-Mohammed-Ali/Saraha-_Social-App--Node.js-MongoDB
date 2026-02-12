export const SuccessResponse = ({ res,message = "donr", status = 200, data = undefined } = {}) => {
  return res.status(status).json({
    status,
    message,
    data
  })
}