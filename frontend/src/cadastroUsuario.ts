import { AxiosError } from "axios"
import {axios} from "./utils/axios"
import { querySelector } from "./utils/querySelector"

querySelector<HTMLFormElement>("#login").onsubmit= async function(event){
  event.preventDefault()
  console.log(event)
  try {
   // const {status} =await axios.post("/login",event.target)
    const {data} = await axios.get("/login")
    alert(JSON.stringify(data))
   } catch (error) {
    if(error instanceof AxiosError){
      console.log(error.response?.data.message)
      alert(error.response?.data.message);
    }
  }
}
