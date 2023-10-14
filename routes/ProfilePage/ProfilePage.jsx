import React, { useState, useEffect } from 'react';
import authService from "../../services/auth.service";
import './ProfilePage.css';

function ProfilePage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrderHistory() {
      try {
        const response = await authService.api.get("/api/orders/history");
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order history:", error);
        setLoading(false);
      }
    }

    fetchOrderHistory();
  }, []);

  return (
    <div className="profile-page">
      <h1>Profile Page</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="order-list">
          <div className="order-cards">
            {orders.map((order) => (
              <div className="order-card" key={order._id}>
                <div className="order-date">
                  <strong>Order Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                </div>
                <div className="order-details">
                  <h3>Order Details</h3>
                  <ul>
                    {order.products.map((productInfo, index) => (
                      <li key={index}>
                        <div className="product-info">
                          {productInfo.product && (
                            <img
                              className="product-image"
                              src={productInfo.product.imagen} // Asegúrate de que la propiedad sea "imagen"
                              alt={productInfo.product.nombre}
                            />
                          )}
                          <div className="product-name">
                            {productInfo.amount} x {productInfo.product && productInfo.product.nombre || 'N/A'} (${(productInfo.amount * (productInfo.product && productInfo.product.precio || 0))})
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="order-total">
                  <strong>Total:</strong> ${order.totalAmount || 0}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;










































// import "./ProfilePage.css";
// import authService from "../../services/auth.service";
// import React, { useState , useEffect} from 'react';

// function ProfilePage() {

//   const [data, setData] = useState([]);

//   useEffect(  ()=>{
//     async function start(){

//       let {data} = await authService.api("/api/orders/history")
//       setData(data)
//       // const response = await authService.api("/api/orders/history");
//       // setData(response.data); es lo mismo!!!!! 
//     }
//     start()
//   },[])




//   return (
//     <div>
//       <br></br>
//       <br></br>
//       <br></br>
//       <br></br>
//       <br></br>
//       <h1>Profile page</h1>
// { data ? 
//   data.map(order=>(
//     <div className="card">{order.createdAt}</div>
//   )) : <p>Cargando...</p> 
// }

//       {/* <div>
//         <hr></hr>
//         {JSON.stringify(data)}
//       </div> */}
//     </div>
//   );
// }

// export default ProfilePage;