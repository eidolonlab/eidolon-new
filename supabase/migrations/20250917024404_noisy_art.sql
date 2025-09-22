@@ .. @@
 ALTER TABLE users ENABLE ROW LEVEL SECURITY;
 
+-- Allow anonymous users to create user records for consent tracking
+CREATE POLICY "Allow anonymous user creation"
+  ON users
+  FOR INSERT
+  TO anon
+  WITH CHECK (true);
+
 CREATE POLICY "Users can read own data"
   ON users
   FOR SELECT
   TO authenticated
   USING (auth.uid() = id);
 
 CREATE POLICY "Users can update own data"
   ON users
   FOR UPDATE
   TO authenticated
   USING (auth.uid() = id);