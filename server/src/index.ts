import express from 'express'
import cors from 'cors'
import connectToDb from '../src/database/mongoConnection'
import router from '../src/router/router'

const app = express()

app.use(express.json())
app.use(cors())
app.disable('x-powered-by')

const PORT = 5000

/** API routes */
app.use('/api', router)


/** start server */
connectToDb().then(() => {
  try{
    app.listen(PORT, () => {
      console.log(`Server connected to port: ${PORT}`)
    })
  }
  catch(err){
    console.error('Cannot connect to DB')
  }
}).catch(err => {
  console.error("Invalid database connection...")
})
