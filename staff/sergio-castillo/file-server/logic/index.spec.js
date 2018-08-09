'use strict'

const logic = require('.')
const { expect } = require('chai')

describe('logic', () => {
    beforeEach(() => {
        logic.users = {}
    })

    describe('register', () => {
        const username = 'jack', password = '123'

        it('should register', () => {
            expect(logic.users[username]).not.to.exist

            logic.register(username, password)

            const user = logic.users[username]

            expect(user).to.exist
            expect(user.password).to.equal(password)
        })

        it('should fail on trying to register on already registered user', () => {
            logic.register(username, password)
            expect(()=> logic.register(username, password)).to.throw(`user ${username} already exists`)
        })
    })

    describe('login', () => {
        const username = 'jack', password = '123'

        beforeEach(() => {
            expect(logic.users[username]).not.to.exist
            logic.register(username, password)
        })

        it('should login', () => {
            expect(logic.users[username]).not.to.exist

            logic.register(username, password)

            const user = logic.users[username]

            expect(user).to.exist
            expect(user.password).to.equal(password)
        })

        it('should not register', () => {
            expect(logic.users[username]).not.to.exist
            logic.register(username, password)
            expect(logic.users[username]).to.exist

            logic.register(username, password)

            expect(user.error).to.exist
        })
    })
   
})