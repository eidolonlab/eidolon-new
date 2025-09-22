@@ .. @@
 ALTER TABLE users ENABLE ROW LEVEL SECURITY;
 
+-- Allow anonymous users to create user records (for consent tracking)
+CREATE POLICY "Allow anonymous user creation"
+  ON users
+  FOR INSERT
+  TO anon
+  WITH CHECK (true);
+
 -- Users can read their own data
 CREATE POLICY "Users can read own data"
   ON users