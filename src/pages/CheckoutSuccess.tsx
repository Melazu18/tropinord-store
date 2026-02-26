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

  // Prefer the new params if they exist
  const order = params.get("order");
  const token = params.get("token");

  // Legacy param (older Stripe success flow)
  const sessionId = params.get("session_id");

  useEffect(() => {
    clearCart();

    if (order) {
      const qs =
        `order=${encodeURIComponent(order)}` +
        (token ? `&token=${encodeURIComponent(token)}` : "");
      navigate(`/${lang}/order-confirmation?${qs}`, { replace: true });
      return;
    }

    // If we only have session_id, we can't load receipt without a mapping endpoint
    // so send them back to checkout with a flag.
    if (sessionId) {
      navigate(`/${lang}/checkout?success=1`, { replace: true });
      return;
    }

    navigate(`/${lang}/checkout`, { replace: true });
  }, [order, token, sessionId, clearCart, navigate, lang]);

  return null;
}
