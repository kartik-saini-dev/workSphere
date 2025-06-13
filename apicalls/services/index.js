

export const getAllCatservices = async (cat) => {
    try {
      const res = await fetch(`${process.env.BASE_URL}/api/services/Search?category=${cat}`, {
        method: "GET",
        cache: "no-store",
      });
  
      const data = await res.json();
      
      return data;
    } catch (error) {
      console.log(error," this si error ");
    }
  };


  
  export async function fetchAllUserservices(username){
    try{

     const res= await fetch(`${process.env.BASE_URL}/api/services?username=${username}`, {
      method: "GET",
      cache: "no-store",
    });
     const  servicesData = await res.json();

     if(servicesData){
       return servicesData;
     }
      return "Failed to Fetch Allservices";
    }catch(error){
           
     console.log("this is error in fetch all userservices",error);

    }
  
}
  
 
export async function fetchSingleservice(serviceId){
  try{

   const res= await fetch(`${process.env.BASE_URL}/api/services/single?serviceId=${serviceId}`, {
    method: "GET",
    cache: "no-store",
  });
   const  service = await res.json();

   if(service){
     return service;
   }
    return "Failed to Fetch single service";
  }catch(err){
        
   console.log(err,"this is error in fetch all userservices");

  }

}