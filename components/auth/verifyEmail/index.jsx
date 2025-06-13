
"use client";
import { toast } from "react-toastify";
import Notification from "@/components/Notification";
import { useState , useContext,useEffect} from "react";
import axios from "axios";
import { GlobalContext } from "@/context";
import { PulseLoader } from "react-spinners";
import { useRouter } from 'next/navigation'

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
        <div className="w-full min-h-screen flex justify-center items-center">
        <PulseLoader
          color={"#000000"}
          loading={isVerifying}
          size={30}
          data-testid="loader"
        />
         <p className="mt-4 text-lg font-semibold text-gray-600">
            Verifying your email. Please wait...
          </p>
      </div>
      <Notification/>
        </>
      
    );
  }

}
