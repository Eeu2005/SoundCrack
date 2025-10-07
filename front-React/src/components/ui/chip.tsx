interface args {
  label:string,
  value:string,
  name:string
  image:string
  onClick:()=>void
} 

 export  function Chip({label,image,value,name,onClick}:args){
  return <div onClick={onClick} className="bg-Secundaria flex justify-between rounded-full text-white p-0 pl-1 cursor-pointer ">
    <p className="text-black self-center">{label}</p>
    <img src={image} alt="" className="h-13 w-13 rounded-r-full" />
    <input type="hidden" value={value} name={name} />
    </div>



}
