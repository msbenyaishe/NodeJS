// success function
success = (result) => {
  return {
    status: 'success',
    result: result
  }
}

// error function
error = (message) => {
  return {
    status: 'error',
    message: message
  }
}

exports.success = success
exports.error = error