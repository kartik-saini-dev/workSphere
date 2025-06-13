import Details from "@/components/Services/Details";
import Pricing from "@/components/Services/Pricing";
import { fetchSingleservice } from "@/apicalls/services";

export default async function GetSingleservice({ params: { serviceId } }) {
  const response = await fetchSingleservice(serviceId);

  if (response?.success) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-20 px-5 lg:mx-32">
        {/* Details Section */}
        <div className="lg:col-span-2">
          <Details serviceData={response?.data} />
        </div>
        {/* Pricing Section */}
        <div>
          <Pricing serviceData={response?.data} />
        </div>
      </div>
    );
  } else {
    return <p>{response?.message}NO service</p>;
  }
}
