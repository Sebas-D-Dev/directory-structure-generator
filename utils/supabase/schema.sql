-- Required tables for NextAuth.js (Auth.js) Supabase Adapter
-- These tables will store user profiles, linked accounts (e.g., GitHub),
-- and session information.

CREATE TABLE IF NOT EXISTS users (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text,
    email text,
    "emailVerified" timestamp with time zone,
    image text,
    plan text DEFAULT 'free'::text NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS accounts (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    "userId" uuid NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at bigint,
    token_type text,
    scope text,
    id_token text,
    session_state text,
    CONSTRAINT accounts_pkey PRIMARY KEY (id),
    CONSTRAINT "accounts_provider_providerAccountId_key" UNIQUE (provider, "providerAccountId"),
    CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    "sessionToken" text NOT NULL,
    "userId" uuid NOT NULL,
    expires timestamp with time zone NOT NULL,
    CONSTRAINT sessions_pkey PRIMARY KEY (id),
    CONSTRAINT sessions_sessionToken_key UNIQUE ("sessionToken"),
    CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS verification_token (
    identifier text,
    token text,
    expires timestamp with time zone,
    CONSTRAINT verification_token_pkey PRIMARY KEY (identifier, token)
);


-- Custom table for our application's workspaces
-- This table stores the directory structure data and links it to an owner.

CREATE TABLE IF NOT EXISTS workspaces (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    "ownerId" uuid NOT NULL,
    name text,
    content text,
    "isPublic" boolean DEFAULT false,
    version integer DEFAULT 1,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone,
    CONSTRAINT workspaces_pkey PRIMARY KEY (id),
    CONSTRAINT "workspaces_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES users(id) ON DELETE CASCADE
);

-- Recommended: Enable Row Level Security (RLS) on your tables.
-- This is a crucial security step for any production application.

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_token ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

-- Create policies to allow users to manage their own data.
-- This is a basic example; you may need more granular policies.

CREATE POLICY "Users can insert their own user record." ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own user record." ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own workspaces." ON workspaces FOR SELECT USING (auth.uid() = "ownerId");
CREATE POLICY "Users can insert their own workspaces." ON workspaces FOR INSERT WITH CHECK (auth.uid() = "ownerId");
CREATE POLICY "Users can update their own workspaces." ON workspaces FOR UPDATE USING (auth.uid() = "ownerId");

-- Policy to allow public read access for workspaces marked as public
CREATE POLICY "Public workspaces are viewable by everyone." ON workspaces FOR SELECT USING ("isPublic" = true);

