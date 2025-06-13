
import Companies from "../components/Landing/Companies";
import Everything from "../components/Landing/Everything";
import workSphereBusiness from "../components/Landing/workSphereBusiness";
import HeroBanner from "../components/Landing/HeroBanner";
import JoinworkSphere from "../components/Landing/JoinWorkSphere";
import PopularServices from "../components/Landing/PopularServices";
import Services from "../components/Landing/Services";
import { cleanupExpiredTokens } from "../utilis/cleanupUnverifiedUsers";

export const unVerifiedUsers = async () => {
  try {
            
       await cleanupExpiredTokens();

  } catch (e) {
    console.log("this cleanup error ", e);
  }
};

 function Index() {
  return (
    <div>
      <HeroBanner />
      <Companies />
      <PopularServices />
      <Everything />
      <Services />
      <workSphereBusiness />
      <JoinworkSphere />
    </div>
  );
}

export default Index;
