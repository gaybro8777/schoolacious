-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

ALTER TABLE IF EXISTS public.grade ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."user" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow new users to create their metadata" ON public."user" AS PERMISSIVE FOR
INSERT TO public WITH CHECK (
    (
      (auth.role() = 'authenticated'::text)
      AND auth.uid() = id
      AND id NOT IN (
        SELECT id
        FROM "user"
      )
    )
  );
CREATE POLICY "allow the user to update their own metadata" ON public."user" AS PERMISSIVE FOR
UPDATE TO public USING (
    (
      (auth.role() = 'authenticated'::text)
      AND (auth.uid() = id)
    )
  ) WITH CHECK (
    (
      (auth.role() = 'authenticated'::text)
      AND (auth.uid() = id)
    )
  );
CREATE POLICY "allow all authenticated user to read" ON public."user" AS PERMISSIVE FOR
SELECT TO public USING ((auth.role() = 'authenticated'::text));
ALTER POLICY "allow users with school:modify permission to update" ON public.school USING (
  (
    EXISTS (
      SELECT 1
      FROM (
          public."user"
          JOIN roles ON (("user".role_id = roles.id))
        )
      WHERE (
          ("user".id = auth.uid())
          AND (
            roles.permissions @> '{school:modify}'::character varying []
          )
        )
    )
  )
) WITH CHECK (
  (
    EXISTS (
      SELECT 1
      FROM (
          public."user"
          JOIN roles ON (("user".role_id = roles.id))
        )
      WHERE (
          ("user".id = auth.uid())
          AND (
            roles.permissions @> '{school:modify}'::character varying []
          )
        )
    )
  )
);
ALTER POLICY "allow authenticated user with no school association to insert" ON public.school WITH CHECK (
  (
    EXISTS (
      SELECT 1
      FROM "user"
      WHERE (
          ("user".id = auth.uid())
          AND (auth.role() = 'authenticated'::text)
          AND ("user".role_id IS NULL)
        )
    )
  )
);
DROP VIEW user_with_role;
ALTER TABLE auth.users DROP COLUMN role_id;