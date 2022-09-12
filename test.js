const test = require('tape')
const Validator = require('is-my-json-valid')

const schema = require('./schema.json')

const isValid = Validator(schema, { verbose: true })

test('schema', t => {
  t.true(isValid({
    type: 'about',
    about: '@DIoOBMaI1f0mJg+5tUzZ7vgzCeeHh8+zGta4pOjc+k0=.ed25519',
    publicWebHosting: true
  }))
  t.true(isValid({
    type: 'about',
    about: '@DIoOBMaI1f0mJg+5tUzZ7vgzCeeHh8+zGta4pOjc+k0=.ed25519',
    publicWebHosting: false
  }))

  // Incorrect type
  t.false(isValid({
    type: 'post',
    about: '@DIoOBMaI1f0mJg+5tUzZ7vgzCeeHh8+zGta4pOjc+k0=.ed25519',
    publicWebHosting: false
  }), 'type = "about"')
  t.false(isValid({
    type: 'about',
    about: 'dog',
    publicWebHosting: false
  }), 'about = FeedId')
  t.false(isValid({
    type: 'about',
    about: '@DIoOBMaI1f0mJg+5tUzZ7vgzCeeHh8+zGta4pOjc+k0=.ed25519',
    publicWebHosting: 4
  }), 'publicWebHosting = Boolean')

  // Missing field
  t.false(isValid({
    about: '@DIoOBMaI1f0mJg+5tUzZ7vgzCeeHh8+zGta4pOjc+k0=.ed25519',
    publicWebHosting: false
  }), 'type required')
  t.false(isValid({
    type: 'about',
    publicWebHosting: false
  }), 'about required')
  t.false(isValid({
    type: 'about',
    about: '@DIoOBMaI1f0mJg+5tUzZ7vgzCeeHh8+zGta4pOjc+k0=.ed25519'
  }), 'publicWebHosting required')

  // Extra fields
  t.false(isValid({
    type: 'about',
    about: '@DIoOBMaI1f0mJg+5tUzZ7vgzCeeHh8+zGta4pOjc+k0=.ed25519',
    publicWebHosting: false,
    boom: 'bam!'
  }), 'no additional fields')

  t.end()
})
