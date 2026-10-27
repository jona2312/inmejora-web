import React from 'react';
import CanonicalCatalog from '@/components/plans/CanonicalCatalog';
// Public checkout remains structurally disabled; query/return URLs are not payment authority.
const PLANES_ACTIVOS = false;
export default function CheckoutPage(){return <main className="min-h-screen bg-[#0a0a0a] p-8 text-white"><h1>Checkout — compras desactivadas</h1>{!PLANES_ACTIVOS&&<CanonicalCatalog/>}</main>;}
