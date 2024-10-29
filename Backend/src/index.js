import app from "./app.js";
import ConnectDb from "./db/ConnectDb.js";
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT

ConnectDb()

.then(()=>{
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
    })
})
.catch((error)=>{
    console.log(`Server is not listening on port ${port}`, error);
})    

//     port, () => {
//   console.log(`Server is running on port ${port}`);
// });