-- Allow anonymous users to update response fields on shared dates (by token)
CREATE POLICY "Anyone can respond to shared dates"
ON public.saved_dates
FOR UPDATE
TO anon, authenticated
USING (
  share_token IS NOT NULL
  AND share_expires_at > now()
)
WITH CHECK (
  share_token IS NOT NULL
  AND share_expires_at > now()
);