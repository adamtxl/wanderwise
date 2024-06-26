import React, {useState} from 'react';



function NonAdminLanding() {

   

    return (
       <>
       <section>
        <h2> Admin Only section </h2>
        <p> This section is only for Admins. Please make sure you are logged into the correct account</p>
       </section>
       </>
  );
}

  export default NonAdminLanding;