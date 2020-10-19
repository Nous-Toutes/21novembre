import seed from "./index"

describe('Start to load', () => {
	test('Should load the file', async done => {
        seed()
        done()
    })
})