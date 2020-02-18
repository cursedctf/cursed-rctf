const db = require('./db')

const ret = {
  getUserById: ({ id }) => {
    return db.query('SELECT * FROM users WHERE id = $1', [id])
      .then(res => res.rows[0])
  },
  getUserByEmail: ({ email }) => {
    return db.query('SELECT * FROM users WHERE email = $1', [email])
      .then(res => res.rows[0])
  },
  getUserByName: ({ name }) => {
    return db.query('SELECT * FROM users WHERE name = $1', [name])
      .then(res => res.rows[0])
  },
  removeUserByEmail: ({ email }) => {
    return db.query('DELETE FROM users WHERE email = $1 RETURNING *', [email])
      .then(res => res.rows[0])
  },
  makeUser: ({ id, name, email, division, perms }) => {
    return db.query('INSERT INTO users (id, name, email, division, perms) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, name, email, division, perms]
    )
      .then(res => res.rows[0])
  },
  updateUser: ({ id, name, email, division, perms }) => {
    return ret.getUser({ id })
      .then(user => {
        const upd = { name, email, division, perms }
        Object.keys(upd).forEach(key => {
          if (upd[key] === undefined) delete upd[key]
        })

        user = Object.assign(user, upd)

        return db.query('UPDATE users SET name = $1, email = $2, division = $3, perms = $5 WHERE id = $6 RETURNING *',
          [user.name, user.email, user.division, user.perms, user.id]
        )
      })
      .then(res => res.rows[0])
  }
}

module.exports = ret