import React from "react";
import{Routes,Route} from 'react-router-dom';
import AddCustomer from "./AddCustomer";
import CustomerList from "./CustomerList";
import ShopList from "./ShopList";
import AddShop from "./AddShop"


export default function RouterPage() {
    return(
        <div className="container">
            <Routes>
            <Route path="/add-customer" element={<AddCustomer/>} />
            <Route path="/customer-list" element={<CustomerList/>} />
            <Route path="/add-shop/:id" element={<AddShop />} />  
            {/* <Route path="/add-shop" element={<AddShop/>} /> */}
            <Route path="/shop-list" element={<ShopList/>} />
            </Routes>
         </div>
    )

}