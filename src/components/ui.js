import art from 'ascii-art'
import ora from 'ora'

const spinner = ora()

const doomMessage = (message, color = 'bright_blue') => new Promise((resolve, reject) => art.font(message, 'Doom', color, (err, data) => {
  if (err) return reject(err)
  console.log(data)
  resolve()
})).catch(err => console.log(err))


export default {
  doomMessage,
  spinner,
}
