
ALTER TABLE public.saved_dates 
ADD COLUMN IF NOT EXISTS allow_customise boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS date_response text CHECK (date_response IN ('pending', 'accepted', 'rejected', 'customised')) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS girl_name text,
ADD COLUMN IF NOT EXISTS response_message text,
ADD COLUMN IF NOT EXISTS customised_activities jsonb;
