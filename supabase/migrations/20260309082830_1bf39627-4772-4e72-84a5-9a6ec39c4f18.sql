-- Add proposed_datetime column for time change proposals
ALTER TABLE public.saved_dates ADD COLUMN proposed_datetime timestamptz NULL;
ALTER TABLE public.saved_dates ADD COLUMN proposed_by_name text NULL;

-- Change date_scheduled from date to timestamptz to support time
ALTER TABLE public.saved_dates ALTER COLUMN date_scheduled TYPE timestamptz USING date_scheduled::timestamptz;