const Beep = {
  init() {
    this.ctx = new AudioContext()
  },
  beep({ duration = 250, type = 'sine', frequency = 440 }) {
    console.log('🔊', duration, type, frequency)
    const osc = this.ctx.createOscillator()
    osc.connect(this.ctx.destination)
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime)
    osc.start()
    return new Promise(resolve => {
      setTimeout(() => {
        osc.stop()
        console.log('done beeping')
        resolve()
      }, duration)
    })
  },
}

const sleep = ms => {
  console.log('sleeping: ', ms)
  return new Promise(resolve => setTimeout(resolve, ms))
}

let beeper

const main = async () => {
  beeper = Object.create(Beep)
  beeper.init()
  const beepHigh = props => beeper.beep({ frequency: 620, ...props })
  const beepMid = props => beeper.beep({ frequency: 440, ...props })
  const beepLow = props => beeper.beep({ frequency: 380, ...props })

  for (let i=1; i<= 20; i++) {
    // hold
    document.querySelector('#state').innerHTML = `${i} - hold`
    await beepHigh()
    await sleep(750)

    // negative (push-ups: down)
    document.querySelector('#state').innerHTML = `${i} - negative`
    await beepMid()
    await sleep(1750)

    // pause
    document.querySelector('#state').innerHTML = `${i} - bottom pause`
    await beepLow()
    await sleep(750)

    // positive (push-ups: up)
    console.log('rep: ', i, ' - positive')
    document.querySelector('#state').innerHTML = `${i} - positive`
    await beepLow({ duration: 50 })
    await sleep(200)
    await beepHigh({ duration: 50 })
    await sleep(1750)
  }
}
