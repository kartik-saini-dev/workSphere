// just like axios you can use fetch as well without prefix url for client side and you can create seperate file for code maintenance

export const registerNewUser = async (formData) => {
    try {
      const response = await fetch(`/api/register`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const finalData = await response.json();

      return finalData;
    } catch (e) {
      console.log("this error in servuces ", e);
    }
  };


  