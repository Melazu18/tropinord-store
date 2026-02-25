import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";
import { useTranslation } from "react-i18next";

import AppLayout from "@/layouts/AppLayout";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { CartDrawer } from "@/components/CartDrawer";
import { ChatbotWidget } from "@/components/ChatbotWidget";

import { supportedLanguages, type SupportedLanguage } from "@/i18n/resources";
import { normalizeSupportedLang } from "@/utils/getLocalizedPath";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const OurStory = lazy(() => import("./pages/OurStory"));
const FAQ = lazy(() => import("./pages/FAQ"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess")); // ✅ optional fallback
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const CurrencyConverter = lazy(() => import("./pages/CurrencyConverter"));
const NotFound = lazy(() => import("./pages/NotFound"));

// ✅ Route-guard component (checkout-only auth)
const RequireAuth = lazy(() => import("./components/RequireAuth"));

const queryClient = new QueryClient();

function RouteLoading() {
  return (
    <div className="container py-10">
      <div className="animate-pulse space-y-3">
        <div className="h-6 w-48 rounded bg-muted" />
        <div className="h-4 w-80 rounded bg-muted" />
        <div className="h-4 w-72 rounded bg-muted" />
      </div>
    </div>
  );
}

function RootRedirect() {
  const { i18n } = useTranslation();
  const lang = normalizeSupportedLang(i18n.language);
  return <Navigate to={`/${lang}`} replace />;
}

function isSupportedLang(l?: string): l is SupportedLanguage {
  if (!l) return false;
  const set = new Set(supportedLanguages.map((x) => x.code));
  return set.has(l as SupportedLanguage);
}

function LocalizedShell() {
  const { i18n } = useTranslation();
  const { lang } = useParams();
  const location = useLocation();

  const normalized = normalizeSupportedLang(lang);
  const supported = isSupportedLang(lang);

  useEffect(() => {
    if (supported && i18n.language !== normalized) {
      void i18n.changeLanguage(normalized);
    }
  }, [supported, normalized, location.pathname, i18n]);

  if (!supported) {
    return <Navigate to={`/${normalized}`} replace />;
  }

  return <Outlet />;
}

/**
 * ✅ Handles Stripe/old backend hitting /checkout/success WITHOUT lang.
 * Redirects to /:lang/checkout/success using current i18n language.
 */
function CheckoutSuccessNoLangRedirect() {
  const { i18n } = useTranslation();
  const lang = normalizeSupportedLang(i18n.language);
  return <Navigate to={`/${lang}/checkout/success`} replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <CurrencyProvider>
          <BrowserRouter>
            <CartProvider>
              <Toaster />
              <Sonner />
              <CartDrawer />
              <ChatbotWidget />

              <Suspense fallback={<RouteLoading />}>
                <Routes>
                  <Route element={<AppLayout />}>
                    <Route path="/" element={<RootRedirect />} />

                    {/* ✅ IMPORTANT: Catch non-localized Stripe success route */}
                    <Route
                      path="/checkout/success"
                      element={<CheckoutSuccessNoLangRedirect />}
                    />

                    <Route path="/:lang" element={<LocalizedShell />}>
                      <Route index element={<Home />} />
                      <Route path="login" element={<Login />} />
                      <Route path="explore" element={<Index />} />
                      <Route path="about" element={<About />} />
                      <Route path="story" element={<OurStory />} />
                      <Route path="faq" element={<FAQ />} />
                      <Route path="privacy" element={<PrivacyPolicy />} />
                      <Route path="product/:slug" element={<ProductDetail />} />

                      {/* ✅ Checkout requires auth */}
                      <Route
                        path="checkout"
                        element={
                          <RequireAuth>
                            <Checkout />
                          </RequireAuth>
                        }
                      />

                      {/* ✅ Optional fallback success route */}
                      <Route
                        path="checkout/success"
                        element={<CheckoutSuccess />}
                      />

                      <Route
                        path="order-confirmation"
                        element={<OrderConfirmation />}
                      />

                      {/* ✅ OPTIONAL: Protect orders too (recommended) */}
                      <Route
                        path="orders"
                        element={
                          <RequireAuth>
                            <OrderHistory />
                          </RequireAuth>
                        }
                      />

                      <Route path="converter" element={<CurrencyConverter />} />
                    </Route>

                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Suspense>
            </CartProvider>
          </BrowserRouter>
        </CurrencyProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;