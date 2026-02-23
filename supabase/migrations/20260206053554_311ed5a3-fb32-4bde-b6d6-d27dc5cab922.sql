CREATE OR REPLACE FUNCTION public.decrement_inventory(p_product_id uuid, p_quantity integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_quantity IS NULL OR p_quantity <= 0 THEN
    RAISE EXCEPTION 'Quantity must be a positive integer';
  END IF;

  UPDATE public.products
  SET inventory = inventory - p_quantity
  WHERE id = p_product_id
    AND inventory >= p_quantity;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient inventory or product not found';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.decrement_inventory(uuid, integer) TO service_role;
