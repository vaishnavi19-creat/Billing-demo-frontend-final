import React from "react";
import{Routes,Route} from 'react-router-dom';
import AddAdminCustomer from "./AddAdminCustomer";
import AdminCustomerList from "./AdminCustomerList";
import ProductList from "./ProductList";
import AddProduct from "./AddProduct"
import AddInvoice from "./AddInvoice";
import QuotationPage from "./QuotationPage";


export default function RouterPage() {
    return(
        <div className="container">
            <Routes>
            <Route path="/admin/addadmin-customer" element={<AddAdminCustomer/>} />
            <Route path="/admin/admincustomer-list" element={<AdminCustomerList/>}/>
            <Route path="/admin/add-product" element={<AddProduct/>} />
            <Route path="/admin/product-list" element={<ProductList/>} />
            <Route path="/admin/add-invoice" element={<AddInvoice/>} />
            <Route path="/admin/create-quotation" element={<QuotationPage/>} />


            </Routes>
         </div>
    )

}