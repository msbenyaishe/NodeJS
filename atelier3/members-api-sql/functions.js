// Success response
const success = (result) => {
  return {
    status: 'success',
    result: result
  }
}

// Error response
const error = (message) => {
  return {
    status: 'error',
    message: message
  }
}

module.exports = { success, error }