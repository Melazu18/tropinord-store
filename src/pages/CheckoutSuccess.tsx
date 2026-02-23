import { useEffect } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { normalizeSupportedLang } from "@/utils/getLocalizedPath";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = normalizeSupportedLang(langParam);

  // Stripe sends session_id
  const sessionId = params.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      navigate(`/${lang}/checkout`, { replace: true });
      return;
    }

    // ✅ clear cart immediately on return
    clearCart();

    // ✅ If later you map session_id -> order_number via webhook/db,
    // you can redirect to order-confirmation using order_number.
    // For now, just keep them on a success page or show a message.
    navigate(
      `/${lang}/order-confirmation?session_id=${encodeURIComponent(sessionId)}`,
      {
        replace: true,
      },
    );
  }, [sessionId, clearCart, navigate, lang]);

  return null;
}
