const fs = require('fs')
const randomstring = require('randomstring')
const consola = require('consola')
const bcrypt = require('bcrypt')
const config = require('../../config.js')
// eslint-disable-next-line import/order
const db = require('knex')(config.dbConnection)

const DatabaseController = {}

/* if (process.env.NODE_ENV === 'test') {
  this.db = this.init(this.preInit(require('knex')({
    client: 'sqlite3',
    connection: {
      filename: '../../db/test.db'
    }
  })))
} else {
  this.db = this.init()
} */

DatabaseController.preInit = (db) => {
  if (config.dbConnection.client === 'sqlite3' && !fs.existsSync(config.dbConnection.connection.filename)) {
    consola.info('Database not found, a new one will be created.')
  }
  if (fs.existsSync(config.dbConnection.connection.filename)) {
    db('packs').count('name as CNT').then((p) => {
      db('mods').count('name as CNT').then((m) => {
        consola.info(`Database loaded with ${p} packs, and ${m} mods.`)
      })
    })
  }
  return db
}

DatabaseController.init = (db) => {
  if (!db.schema.hasTable('packs')) {
    db.schema.createTable('packs', (table) => {
      table.increments()
      table.integer('owner')
      table.string('name')
      table.string('slug')
      table.integer('enabled')
      table.integer('timestamp')
    })
  }
  if (!db.schema.hasTable('mods')) {
    db.schema.createTable('mods', (table) => {
      table.increments()
      table.integer('user')
      table.string('name')
      table.string('slug')
      table.string('version')
      table.string('filename')
      table.string('md5')
      table.integer('enabled')
      table.integer('timestamp')
    })
  }
  if (!db.schema.hasTable('apikeys')) {
    db.schema.createTable('apikeys', (table) => {
      table.increments()
      table.integer('owner')
      table.string('keyname')
      table.string('key')
      table.integer('timestamp')
    })
  }
  if (!db.schema.hasTable('users')) {
    db.schema.createTable('users', (table) => {
      table.increments()
      table.string('username')
      table.string('email')
      table.string('password')
      table.string('NaCl')
      table.string('token')
      table.integer('permissions') // See PermissionsController for format info
      table.integer('timestamp')
    })
  }
  if (config.resetAdminPass) {
    db('users').where({ username: 'admin' }).then((u) => {
      if (u.length > 0) {
        consola.info('Admin user exists! Resetting password to configred value.')
        const salt = randomstring.generate(32)
        bcrypt.hash(`${config.adminPassword}-admin-${salt}`, 10, (e, h) => {
          if (e) {
            consola.error('Error generating password hash for admin user')
            process.exit(9)
          }
          db('users').where('username', 'admin').update({
            password: h,
            NaCl: salt,
            token: randomstring.generate(64)
          }).then(() => { consola.info('Admin password updated') })
        })
      } else {
        consola.info('Admin doesn\'t exist! Creating new account.')
        const salt = randomstring.generate(32)
        bcrypt.hash(`${config.adminPassword}-admin-${salt}`, 10, (e, h) => {
          if (e) {
            consola.error('Error generating password hash for admin user')
            process.exit(9)
          }
          consola.info('Hash calculated')
          db('users').insert({
            username: 'admin',
            email: 'admin@example.com',
            password: h,
            NaCl: salt,
            token: randomstring.generate(64),
            permissions: 3,
            timestamp: Math.floor(+new Date() / 1000)
          }).then(() => { consola.info('Admin user created') })
        })
      }
    })
  }
  return db
}

DatabaseController.db = DatabaseController.init(db)

module.exports = DatabaseController
