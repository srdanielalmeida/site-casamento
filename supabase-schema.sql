-- ==============================================================================
-- SUPABASE SCHEMA — Casamento Daniel & Franciellen Maria
-- Execute este script no SQL Editor do seu projeto Supabase para criar/atualizar
-- as tabelas com todas as permissões de acesso público (RLS) necessárias.
-- ==============================================================================

-- 1. TABELA DE CATEGORIAS DE PRESENTES
CREATE TABLE IF NOT EXISTS public.presentes_categorias (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '',
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE ITENS DE PRESENTES
CREATE TABLE IF NOT EXISTS public.presentes_itens (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT DEFAULT '',
  link TEXT NOT NULL,
  category TEXT REFERENCES public.presentes_categorias(id) ON DELETE SET NULL,
  coupon TEXT DEFAULT '',
  is_purchased BOOLEAN DEFAULT FALSE,
  purchased_by TEXT DEFAULT '',
  purchased_at TIMESTAMPTZ,
  audit_info JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garante que todas as colunas existem se a tabela já tiver sido criada anteriormente
ALTER TABLE public.presentes_itens ADD COLUMN IF NOT EXISTS coupon TEXT DEFAULT '';
ALTER TABLE public.presentes_itens ADD COLUMN IF NOT EXISTS is_purchased BOOLEAN DEFAULT FALSE;
ALTER TABLE public.presentes_itens ADD COLUMN IF NOT EXISTS purchased_by TEXT DEFAULT '';
ALTER TABLE public.presentes_itens ADD COLUMN IF NOT EXISTS purchased_at TIMESTAMPTZ;
ALTER TABLE public.presentes_itens ADD COLUMN IF NOT EXISTS audit_info JSONB;
ALTER TABLE public.presentes_itens ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. TABELA DE CONFIRMAÇÕES DE PRESENÇA (RSVP)
CREATE TABLE IF NOT EXISTS public.rsvp_confirmacoes (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  mensagem TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
-- Permite leitura e operações públicas necessárias para convidados anônimos
-- ==============================================================================

-- Habilita RLS nas tabelas
ALTER TABLE public.presentes_categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presentes_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_confirmacoes ENABLE ROW LEVEL SECURITY;

-- Remove políticas antigas para evitar duplicidade
DROP POLICY IF EXISTS "Categorias: Leitura Pública" ON public.presentes_categorias;
DROP POLICY IF EXISTS "Categorias: Gerenciamento Total" ON public.presentes_categorias;

DROP POLICY IF EXISTS "Itens: Leitura Pública" ON public.presentes_itens;
DROP POLICY IF EXISTS "Itens: Atualizar Compra" ON public.presentes_itens;
DROP POLICY IF EXISTS "Itens: Gerenciamento Total" ON public.presentes_itens;

DROP POLICY IF EXISTS "RSVP: Leitura Pública" ON public.rsvp_confirmacoes;
DROP POLICY IF EXISTS "RSVP: Inserção Pública" ON public.rsvp_confirmacoes;
DROP POLICY IF EXISTS "RSVP: Gerenciamento Total" ON public.rsvp_confirmacoes;

-- --- Políticas para presentes_categorias ---
CREATE POLICY "Categorias: Leitura Pública"
  ON public.presentes_categorias
  FOR SELECT
  USING (true);

CREATE POLICY "Categorias: Gerenciamento Total"
  ON public.presentes_categorias
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- --- Políticas para presentes_itens ---
CREATE POLICY "Itens: Leitura Pública"
  ON public.presentes_itens
  FOR SELECT
  USING (true);

-- Permite que convidados anônimos marquem itens como comprados ou desmarquem
CREATE POLICY "Itens: Atualizar Compra"
  ON public.presentes_itens
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Itens: Gerenciamento Total"
  ON public.presentes_itens
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- --- Políticas para rsvp_confirmacoes ---
CREATE POLICY "RSVP: Leitura Pública"
  ON public.rsvp_confirmacoes
  FOR SELECT
  USING (true);

CREATE POLICY "RSVP: Inserção Pública"
  ON public.rsvp_confirmacoes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "RSVP: Gerenciamento Total"
  ON public.rsvp_confirmacoes
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- HABILITAR REALTIME (Publicação em tempo real)
-- ==============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'presentes_itens'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.presentes_itens;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'rsvp_confirmacoes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.rsvp_confirmacoes;
  END IF;
END $$;
