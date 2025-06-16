
"use client";
import { toast } from "react-toastify";
import Notification from "@/components/Notification";
import { useState , useContext,useEffect} from "react";
import axios from "axios";
import { GlobalContext } from "@/context";
import { useRouter } from 'next/navigation'
import ComponentLevelLoader from "@components/Loader/componentLevelLoader";

export default function VerifyEmail(){
  const router = useRouter();
    const [token, setToken] = useState("");
    const [isVerifying, setIsVerifying] = useState(true);
    
    const {
        pageLevelLoader,setPageLevelLoader
      } = useContext(GlobalContext);

    const verifyUserEmail = async ()=>{

        try{
            const res = await axios.post(`/api/verifyEmail`,{token});
             
            if (res.data.success) {
              // setPageLevelLoader(false); no need here i guess
                toast.success(res.data.message, {
                  position: toast.POSITION.TOP_RIGHT,
                });
                  setIsVerifying(false);
                  router.push("/");

              } else {
                console.log("error in here veryfying")
                toast.error(res.data.message, {
                  position: toast.POSITION.TOP_RIGHT,
                });
                // setPageLevelLoader({ loading: false, id: "" });
                setIsVerifying(false);
                router.push("/");
              }

        }catch(error){
              console.log(error);
        }
    }

    useEffect(()=>{

      const urlToken = window.location.search.split("=")[1];
      setToken(urlToken || "");

   },[]);

    useEffect(()=>{

        if(token.length > 0){
            verifyUserEmail();
        }

   },[token]);

   
     if (isVerifying) {
       return (

   
       <>
       
         <ComponentLevelLoader text="  Verifying your email. Please wait..." color="text-red-500" size="w-12 h-12" /> ;
        
       <Notification/>
       </>
     
       )

    }
}
