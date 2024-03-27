const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const connectToDb = require('./utils/db')
const cors = require('cors')
const dotenv = require('dotenv')
const userRouter = require('./Routes/user.routes')
const productRoutes = require('./Routes/product.routes');
const orderRoutes = require('./Routes/order.routes')
const doctorRoutes = require('./Routes/doctorRoutes')
const consultationRoutes = require('./Routes/consultationRoutes')
dotenv.config({path:'/.env'})
const PORT=process.env.PORT;
app.use(cors("*"))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api/v1', userRouter)
app.use('/api/v1',productRoutes)
app.use('/api/v1',orderRoutes)
app.use('/api/v1',doctorRoutes)
app.use('/api/v1',consultationRoutes)

app.listen(4000, (req, res) => {
    console.log(`server is running on ${4000}`)
});
connectToDb();
