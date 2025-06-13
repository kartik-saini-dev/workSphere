
import Categoryservices from "@/components/Services/CategoryServices";
import { getAllCatservices } from "@/apicalls/services";

export  default async function({params}){
   
    const catArray = params.cat;


    if (!catArray || catArray.length === 0) {
      return <div>No category found</div>;
    }
  
    const mainCategory = catArray[0]; // The main category
    const subCategory = catArray[1] || null; // Optional subcategory

    const decodedMainCategory = mainCategory.replace(/-/g, " ").replace(/%20/g, " ");
    const decodedSubCategory = subCategory?.replace(/-/g, " ") || null;
  
  
    // Fetch data (you can use subCategory in the API call if required)
    const response = await getAllCatservices(decodedMainCategory, decodedSubCategory);
           
    const servicesData = response?.data;
    const pagination = response?.pagination;
  
    return (
      <Categoryservices
        servicesData={servicesData}
        pagination={pagination}
        category={decodedMainCategory}
        subCategory={decodedSubCategory} // Pass subcategory name if exists
      />
    );
}