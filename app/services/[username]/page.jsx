
import Allservices  from "@/components/Services/AllServices";
import { fetchAllUserservices } from "@/apicalls/services";
export  default async function GetUserservices({params:{username}}){
      const correctUsername=  username.replace(/%20/g," ");
    
  const response = await fetchAllUserservices(correctUsername); 
    
  if(response){
    
    return <Allservices  servicesData = {response.data} pagination={response.pagination} username={correctUsername}/>
  }

}



