import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster as SonnerToaster } from 'sonner';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';

// Contexts
import { HealthCheckProvider } from '@/contexts/HealthCheckContext';
import { ContactFormProvider } from '@/contexts/ContactFormContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { InmejoraAuthProvider } from '@/contexts/InmejoraAuthContext';
import { ProveedorAuthProvider } from '@/contexts/ProveedorAuthContext';
import { SupplierProvider } from '@/contexts/SupplierContext';
import { ContactModalProvider } from '@/contexts/ContactModalContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { ChatProvider } from '@/contexts/ChatContext';

// Standard Components
import ScrollToTop from '@/components/ScrollToTop';
import Spinner from '@/components/Spinner';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute';
import OfflineBanner from '@/components/OfflineBanner';
import ContactModal from '@/components/ContactModal';
import ScrollTriggerRegistrationModal from '@/components/ScrollTriggerRegistrationModal';
import SupplierProtectedRoute from '@/components/SupplierProtectedRoute';
import CookieBanner from '@/components/CookieBanner';

// Environment Check Utility
import { supabase } from '@/lib/customSupabaseClient';

// Robust Lazy Loading Wrapper
const lazyWithRetry = (componentImport, name) => React.lazy(async () => {
  try {
    const module = await componentImport();
    if (name) {
      console.log(`[Module Resolution] Loaded route component: ${name}`);
    }
    return module;
  } catch (error) {
    console.error(`[Module Resolution Error] Failed to fetch dynamically imported module: ${name}`, error);
    if (error.message.includes('Failed to fetch dynamically imported module')) {
      if (!window.sessionStorage.getItem('inmejora_reloaded')) {
         window.sessionStorage.setItem('inmejora_reloaded', 'true');
         window.location.reload();
      }
    }
    throw error;
  }
});

// Dynamic Imports 
const LandingPage = lazyWithRetry(() => import('@/pages/LandingPage'), 'LandingPage');
const ProveedoresPage = lazyWithRetry(() => import('@/pages/ProveedoresPage'), 'ProveedoresPage');
const PresupuestoPage = lazyWithRetry(() => import('@/pages/PresupuestoPage'), 'PresupuestoPage');
const ContactoPage = lazyWithRetry(() => import('@/pages/ContactoPage'), 'ContactoPage');
const ProjectosPage = lazyWithRetry(() => import('@/pages/ProjectosPage'), 'ProjectosPage');
const ServiciosPage = lazyWithRetry(() => import('@/pages/ServiciosPage'), 'ServiciosPage');

// NEW SUPPLIER ROUTES
const SupplierLoginPage = lazyWithRetry(() => import('@/pages/SupplierLoginPage'), 'SupplierLoginPage');
const SupplierRegistrationPage = lazyWithRetry(() => import('@/pages/SupplierRegistrationPage'), 'SupplierRegistrationPage');
const SupplierPortalPage = lazyWithRetry(() => import('@/pages/SupplierPortalPage'), 'SupplierPortalPage');

const AdminProvidersPage = lazyWithRetry(() => import('@/pages/AdminProvidersPage'), 'AdminProvidersPage');
const AdminInmejora = lazyWithRetry(() => import('@/pages/AdminInmejora'), 'AdminInmejora');
const PrivacyPolicy = lazyWithRetry(() => import('@/pages/PrivacyPolicy'), 'PrivacyPolicy');
const TermsAndConditions = lazyWithRetry(() => import('@/pages/TermsAndConditions'), 'TermsAndConditions');
const LoginPage = lazyWithRetry(() => import('@/pages/LoginPage'), 'LoginPage');
const RegistrationPage = lazyWithRetry(() => import('@/pages/RegistrationPage'), 'RegistrationPage');
const ForgotPasswordPage = lazyWithRetry(() => import('@/pages/ForgotPasswordPage'), 'ForgotPasswordPage');
const ResetPasswordPage = lazyWithRetry(() => import('@/pages/ResetPasswordPage'), 'ResetPasswordPage');

const QuoterPage = lazyWithRetry(() => import('@/pages/QuoterPage'), 'QuoterPage');
const CatalogPage = lazyWithRetry(() => import('@/pages/CatalogPage'), 'CatalogPage');
const PortalPage = lazyWithRetry(() => import('@/pages/PortalPage'), 'PortalPage');
const ProfilePage = lazyWithRetry(() => import('@/pages/ProfilePage'), 'ProfilePage');
const PaymentHistoryPage = lazyWithRetry(() => import('@/pages/PaymentHistoryPage'), 'PaymentHistoryPage');
const RenderGeneratorPage = lazyWithRetry(() => import('@/pages/RenderGeneratorPage'), 'RenderGeneratorPage');
const EditRenderPage = lazyWithRetry(() => import('@/pages/EditRenderPage'), 'EditRenderPage');
const PortalCotizaciones = lazyWithRetry(() => import('@/pages/PortalCotizaciones'), 'PortalCotizaciones');

const PlansPage = lazyWithRetry(() => import('@/pages/PlansPage'), 'PlansPage');
const PricingPage = lazyWithRetry(() => import('@/pages/PricingPage'), 'PricingPage');
const ImageUploadPage = lazyWithRetry(() => import('@/pages/ImageUploadPage'), 'ImageUploadPage');
const AnalysisPage = lazyWithRetry(() => import('@/pages/AnalysisPage'), 'AnalysisPage');
const ClientDashboard = lazyWithRetry(() => import('@/pages/ClientDashboard'), 'ClientDashboard');
const BudgetsPage = lazyWithRetry(() => import('@/pages/BudgetsPage'), 'BudgetsPage');

// Proveedor Routes
const ProveedorRegisterPage = lazyWithRetry(() => import('@/pages/ProveedorRegisterPage'), 'ProveedorRegisterPage');

// Checkout Flow Imports
const CheckoutSuccessPage = lazyWithRetry(() => import('@/pages/CheckoutSuccessPage'), 'CheckoutSuccessPage');
const CheckoutErrorPage = lazyWithRetry(() => import('@/pages/CheckoutErrorPage'), 'CheckoutErrorPage');
const CheckoutPendingPage = lazyWithRetry(() => import('@/pages/CheckoutPendingPage'), 'CheckoutPendingPage');

// 404 Page
const NotFoundPage = lazyWithRetry(() => import('@/pages/NotFoundPage'), 'NotFoundPage');

const AuthErrorHandler = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthError = () => {
            toast({
                variant: "destructive",
                title: "Sesión expirada",
                description: "Tu sesión ha expirado. Por favor, inicia sesión de nuevo.",
            });
            navigate('/login');
        };

        window.addEventListener('auth:unauthorized', handleAuthError);
        return () => window.removeEventListener('auth:unauthorized', handleAuthError);
    }, [toast, navigate]);

    return null;
};

const AppContent = () => {
  return (
    <Suspense fallback={<div className="w-full h-screen bg-[#0f0f0f] flex items-center justify-center"><Spinner /></div>}>
      <AuthErrorHandler />
      <OfflineBanner />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Public Routes */}
        <Route path="/precios" element={<PricingPage />} />
        <Route path="/servicios" element={<ServiciosPage />} />
        <Route path="/proyectos" element={<ProjectosPage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/catalogo/colores" element={<CatalogPage />} />
        <Route path="/catalogo/productos" element={<CatalogPage />} />
        <Route path="/cotizador" element={<QuoterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistrationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/presupuesto" element={<PresupuestoPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/planes" element={<PlansPage />} />

        {/* Proveedores Routes (Public facing landing) */}
        <Route path="/proveedores" element={<ProveedoresPage />} />
        <Route path="/proveedores/registro" element={<ProveedorRegisterPage />} />
        
        {/* NEW SUPPLIER ROUTES */}
        <Route path="/proveedores/login" element={<SupplierLoginPage />} />
        <Route 
          path="/proveedores/portal" 
          element={
            <SupplierProtectedRoute>
              <SupplierPortalPage />
            </SupplierProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin/proveedores" 
          element={
            <ProtectedAdminRoute>
              <AdminProvidersPage />
            </ProtectedAdminRoute>
          } 
        />

        {/* Portal Routes */}
        <Route path="/portal" element={<ProtectedRoute><PortalPage /></ProtectedRoute>} />
        <Route path="/portal/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/portal/pagos" element={<ProtectedRoute><PaymentHistoryPage /></ProtectedRoute>} />
        <Route path="/portal/renders" element={<ProtectedRoute><RenderGeneratorPage /></ProtectedRoute>} />
        <Route path="/portal/renders/:id/edit" element={<ProtectedRoute><EditRenderPage /></ProtectedRoute>} />
        <Route path="/portal/cotizaciones" element={<ProtectedRoute><PortalCotizaciones /></ProtectedRoute>} />

        <Route path="/portal/dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
        <Route path="/portal/analizar" element={<ProtectedRoute><AnalysisPage /></ProtectedRoute>} />
        <Route path="/portal/budgets" element={<ProtectedRoute><BudgetsPage /></ProtectedRoute>} />
        <Route path="/portal/upload" element={<ProtectedRoute><ImageUploadPage /></ProtectedRoute>} />
        <Route path="/portal/planes" element={<ProtectedRoute><PlansPage /></ProtectedRoute>} />

        {/* Checkout Routes (Handles redirects back from Mercado Pago) */}
        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
        <Route path="/checkout/error" element={<CheckoutErrorPage />} />
        <Route path="/checkout/pending" element={<CheckoutPendingPage />} />

        <Route path="/admin-inmejora" element={<AdminInmejora />} />
        <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
        <Route path="/terminos-y-condiciones" element={<TermsAndConditions />} />

        {/* 404 Catch-All Route - MUST BE LAST */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ContactModal />
    </Suspense>
  );
};

function App() {
  useEffect(() => {
    // Verifying environment variables on init
    const supaUrl = import.meta.env.VITE_SUPABASE_URL;
    const supaKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supaUrl || !supaKey) {
      console.warn("⚠️ Warning: Supabase Environment Variables are missing! (VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY)");
    } else if (!supabase) {
      console.warn("⚠️ Warning: Supabase client failed to initialize properly.");
    } else {
      console.log("✅ Supabase environment successfully initialized.");
    }
  }, []);

  return (
    <HealthCheckProvider>
      <ThemeProvider>
        <ContactFormProvider>
          <AuthProvider>
            <InmejoraAuthProvider>
              <SubscriptionProvider>
                <ProveedorAuthProvider>
                  <SupplierProvider>
                    <ContactModalProvider>
                      <ChatProvider>
                        <Router>
                          <ScrollToTop />
                          <AppContent />
                          
                          <ScrollTriggerRegistrationModal />
                          <Toaster />
                          <SonnerToaster theme="dark" />
                          <WhatsAppButton />
                          <CookieBanner />
                        </Router>
                      </ChatProvider>
                    </ContactModalProvider>
                  </SupplierProvider>
                </ProveedorAuthProvider>
              </SubscriptionProvider>
            </InmejoraAuthProvider>
          </AuthProvider>
        </ContactFormProvider>
      </ThemeProvider>
    </HealthCheckProvider>
  );
}

export default App;