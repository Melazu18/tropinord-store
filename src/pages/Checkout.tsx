import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  DollarSign,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Header } from "@/components/Header";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import { useCurrency } from "@/contexts/CurrencyContext";
import { getProductImageUrl } from "@/utils/storage";
import { normalizeSupportedLang } from "@/utils/getLocalizedPath";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type PaymentMethod = Database["public"]["Enums"]["payment_method"];

interface AddressForm {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

function formatPrice(cents: number, currency = "SEK") {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

type SwishManualResponse = {
  order_id: string;
  attempt_id: string;
  swish_number: string;
  reference: string;
  amount_cents: number;
  currency: string;
  qr_svg: string;
  swish_deeplink?: string;
};

export default function Checkout() {
  // ✅ Keep using multiple namespaces, but reference them with nsSeparator ":"
  const { t } = useTranslation(["checkout", "errors", "common"]);
  const { items, subtotalPrice, discountTotal, appliedPromotions, totalPrice } =
    useCart();
  const { currency: preferredCurrency } = useCurrency();
  const { toast } = useToast();

  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = normalizeSupportedLang(langParam);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CARD");
  const [address, setAddress] = useState<AddressForm>({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    country: "Sweden", // keep default as-is (not translated)
  });

  // Swish modal
  const [swishOpen, setSwishOpen] = useState(false);
  const [swishData, setSwishData] = useState<SwishManualResponse | null>(null);

  const isMobileDevice = () => {
    if (typeof window === "undefined") return false;
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const cartBaseCurrency = useMemo(() => {
    const set = new Set(
      items.map((i) => (i.product.currency ?? "SEK").toUpperCase()),
    );
    if (set.size === 1) return [...set][0];
    return (items[0]?.product.currency ?? "SEK").toUpperCase();
  }, [items]);

  const displayCurrency = useMemo(() => {
    if (preferredCurrency.toUpperCase() === cartBaseCurrency)
      return preferredCurrency;
    return cartBaseCurrency;
  }, [preferredCurrency, cartBaseCurrency]);

  const swishAllowed = useMemo(
    () => displayCurrency.toUpperCase() === "SEK",
    [displayCurrency],
  );

  const validateForm = (): string | null => {
    const fullName = address.fullName.trim();
    const email = address.email.trim();
    const street = address.street.trim();
    const city = address.city.trim();
    const postalCode = address.postalCode.trim();
    const country = address.country.trim();

    // ✅ Translate via errors namespace
    if (!fullName) return t("errors:fullNameRequired");
    if (!email) return t("errors:emailRequired");
    if (!/^\S+@\S+\.\S+$/.test(email)) return t("errors:emailInvalid");
    if (!street) return t("errors:streetRequired");
    if (!city) return t("errors:cityRequired");
    if (!postalCode) return t("errors:postalCodeRequired");
    if (!country) return t("errors:countryRequired");
    return null;
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: t("checkout:copiedTitle"),
        description: t("checkout:copiedDescription", { label }),
      });
    } catch {
      toast({
        title: t("errors:copyFailedTitle"),
        description: t("errors:copyFailedDescription"),
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || isSubmitting) return;

    const validationError = validateForm();
    if (validationError) {
      toast({
        title: t("errors:missingInfoTitle"),
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      if (paymentMethod === "SWISH" && !swishAllowed) {
        toast({
          title: t("errors:swishRequiresSekTitle"),
          description: t("errors:swishRequiresSekDescription"),
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const payload = {
        items: items.map((it) => ({
          product_id: it.product.id,
          quantity: it.quantity,
        })),
        customer_name: address.fullName.trim(),
        customer_email: address.email.trim(),
        customer_phone: address.phone.trim(),
        address: {
          street: address.street.trim(),
          city: address.city.trim(),
          postal_code: address.postalCode.trim(),
          country: address.country.trim(),
        },
        lang,
        client_totals: {
          subtotal: subtotalPrice,
          discount: discountTotal,
          total: totalPrice,
          currency: displayCurrency.toUpperCase(),
          promotions: appliedPromotions ?? [],
        },
      };

      // ✅ SWISH (manual) — keep logic intact
      if (paymentMethod === "SWISH") {
        const { data, error } = await supabase.functions.invoke(
          "create-swish-checkout",
          { body: payload },
        );
        if (error) throw error;

        const sw = data as SwishManualResponse | undefined;
        if (!sw?.qr_svg || !sw?.reference || !sw?.swish_number) {
          throw new Error("Swish payload missing from server response");
        }

        setSwishData(sw);
        setSwishOpen(true);
        setIsSubmitting(false);
        return;
      }

      // ✅ CARD (Stripe Checkout) — keep logic intact
      const { data, error } = await supabase.functions.invoke(
        "create-stripe-checkout",
        { body: payload },
      );
      if (error) throw error;
      if (!data?.url) throw new Error("Stripe Checkout URL missing");

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      toast({
        title: t("errors:checkoutFailedTitle"),
        description: t("errors:checkoutFailedDescription"),
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // ✅ Empty cart — keep behavior
  if (items.length === 0) {
    return (
      <>
        <Header
          title={t("checkout:headerTitle")}
          subtitle={t("checkout:headerSubtitle")}
          showLogo={false}
        />
        <main>
          <PageShell>
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-4">
                {t("checkout:emptyTitle")}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t("checkout:emptyBody")}
              </p>
              <Button asChild>
                <Link to={`/${lang}`}>{t("checkout:continueShopping")}</Link>
              </Button>
            </div>
          </PageShell>
        </main>
      </>
    );
  }

  return (
    <>
      <Header
        title={t("checkout:headerTitle")}
        subtitle={t("checkout:headerSubtitle")}
        showLogo={false}
      />

      {/* Swish modal */}
      <Dialog open={swishOpen} onOpenChange={setSwishOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("checkout:swishModalTitle")}</DialogTitle>
            <DialogDescription>
              {t("checkout:swishModalDescription")}
            </DialogDescription>
          </DialogHeader>

          {swishData ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div
                  className="w-64 h-64 rounded-md border bg-white p-2"
                  dangerouslySetInnerHTML={{ __html: swishData.qr_svg }}
                />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-muted-foreground">
                      {t("checkout:amount")}
                    </div>
                    <div className="font-semibold">
                      {formatPrice(swishData.amount_cents, swishData.currency)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-muted-foreground">
                      {t("checkout:swishNumber")}
                    </div>
                    <div className="font-semibold break-all">
                      {swishData.swish_number}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        swishData.swish_number,
                        t("checkout:swishNumber"),
                      )
                    }
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    {t("common:copy")}
                  </Button>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-muted-foreground">
                      {t("checkout:reference")}
                    </div>
                    <div className="font-semibold break-all">
                      {swishData.reference}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        swishData.reference,
                        t("checkout:reference"),
                      )
                    }
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    {t("common:copy")}
                  </Button>
                </div>

                {swishData.swish_deeplink && isMobileDevice() ? (
                  <Button
                    className="w-full gap-2"
                    type="button"
                    onClick={() => {
                      window.location.href = swishData.swish_deeplink!;
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                    {t("checkout:openSwish")}
                  </Button>
                ) : null}

                <p className="text-xs text-muted-foreground">
                  {t("checkout:afterPayHint")}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSwishOpen(false)}
                >
                  {t("common:close")}
                </Button>
                <Button
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: t("checkout:paymentPendingTitle"),
                      description: t("checkout:paymentPendingDescription"),
                    });
                    setSwishOpen(false);
                  }}
                >
                  {t("checkout:iHavePaid")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              {t("common:loading")}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <main>
        <PageShell>
          <Link
            to={`/${lang}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common:backToShop")}
          </Link>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("checkout:contactTitle")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">
                          {t("checkout:fullName")} *
                        </Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={address.fullName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">{t("checkout:email")} *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={address.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        {t("checkout:phoneOptional")}
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={address.phone}
                        onChange={handleInputChange}
                        placeholder={t("checkout:phonePlaceholder")}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("checkout:shippingTitle")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="street">
                        {t("checkout:streetAddress")} *
                      </Label>
                      <Textarea
                        id="street"
                        name="street"
                        value={address.street}
                        onChange={handleInputChange}
                        required
                        rows={2}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">{t("checkout:city")} *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={address.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="postalCode">
                          {t("checkout:postalCode")} *
                        </Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={address.postalCode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">{t("checkout:country")} *</Label>
                      <Input
                        id="country"
                        name="country"
                        value={address.country}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("checkout:paymentTitle")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) =>
                        setPaymentMethod(value as PaymentMethod)
                      }
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="CARD" id="card" />
                        <Label
                          htmlFor="card"
                          className="flex items-center gap-3 cursor-pointer flex-1"
                        >
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {t("checkout:payCardTitle")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {t("checkout:payCardBody")}
                            </p>
                          </div>
                        </Label>
                      </div>

                      <div
                        className={`flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer ${
                          !swishAllowed ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => {
                          if (!swishAllowed) return;
                          setPaymentMethod("SWISH" as PaymentMethod);
                        }}
                      >
                        <RadioGroupItem
                          value="SWISH"
                          id="swish"
                          disabled={!swishAllowed}
                        />
                        <Label
                          htmlFor="swish"
                          className="flex items-center gap-3 cursor-pointer flex-1"
                        >
                          <Smartphone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {t("checkout:paySwishTitle")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {t("checkout:paySwishBody")}
                            </p>
                            {!swishAllowed ? (
                              <p className="text-xs text-muted-foreground">
                                {t("checkout:paySwishRequiresSek")}
                              </p>
                            ) : null}
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="PAYPAL" id="paypal" />
                        <Label
                          htmlFor="paypal"
                          className="flex items-center gap-3 cursor-pointer flex-1"
                        >
                          <DollarSign className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {t("checkout:payPaypalTitle")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {t("checkout:payPaypalBody")}
                            </p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle>{t("checkout:summaryTitle")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={getProductImageUrl(item.product.images?.[0])}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {item.product.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t("checkout:qty")}: {item.quantity}
                          </p>
                          <p className="text-sm font-medium">
                            {formatPrice(
                              item.product.price_cents * item.quantity,
                              (
                                item.product.currency ?? displayCurrency
                              ).toUpperCase(),
                            )}
                          </p>
                        </div>
                      </div>
                    ))}

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {t("checkout:subtotal")}
                        </span>
                        <span>
                          {formatPrice(subtotalPrice, displayCurrency)}
                        </span>
                      </div>

                      {discountTotal > 0 ? (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {t("checkout:discounts")}
                          </span>
                          <span>
                            -{formatPrice(discountTotal, displayCurrency)}
                          </span>
                        </div>
                      ) : null}

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {t("checkout:shipping")}
                        </span>
                        <span>{t("common:free")}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-semibold text-lg">
                      <span>{t("checkout:total")}</span>
                      <span>{formatPrice(totalPrice, displayCurrency)}</span>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? t("checkout:starting")
                        : paymentMethod === "SWISH"
                          ? t("checkout:showSwishQr")
                          : t("checkout:payWithStripe")}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      {paymentMethod === "SWISH"
                        ? t("checkout:swishHint")
                        : t("checkout:stripeHint")}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </PageShell>
      </main>
    </>
  );
}
