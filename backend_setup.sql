
-- ==========================================
-- 1. CRIAR TABELA DE LOGS
-- ==========================================
create table if not exists public.logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text check (type in ('morning', 'night')) not null,
  date_str text not null,
  video_url text not null,
  timestamp bigint not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS (Row Level Security) na tabela
alter table public.logs enable row level security;

-- ==========================================
-- 2. POLÍTICAS DE SEGURANÇA (RLS) PARA LOGS
-- ==========================================

-- Permitir que usuários vejam apenas seus próprios registros
create policy "Usuários podem ver seus próprios logs"
on public.logs for select
using (auth.uid() = user_id);

-- Permitir que usuários insiram apenas seus próprios registros
create policy "Usuários podem criar seus próprios logs"
on public.logs for insert
with check (auth.uid() = user_id);

-- Permitir que usuários deletem apenas seus próprios registros
create policy "Usuários podem deletar seus próprios logs"
on public.logs for delete
using (auth.uid() = user_id);


-- ==========================================
-- 3. CONFIGURAR STORAGE (BUCKET DE VÍDEOS)
-- ==========================================

-- Criar o bucket de vídeos se não existir
insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do nothing;

-- ==========================================
-- 4. POLÍTICAS DE SEGURANÇA PARA STORAGE
-- ==========================================

-- Permitir acesso público de leitura aos vídeos (necessário para o player)
create policy "Vídeos são públicos para leitura"
on storage.objects for select
using (bucket_id = 'videos');

-- Permitir upload apenas para a pasta do próprio usuário (UID)
create policy "Usuários só fazem upload na sua própria pasta"
on storage.objects for insert
with check (
  bucket_id = 'videos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Permitir deletar apenas da sua própria pasta
create policy "Usuários só deletam da sua própria pasta"
on storage.objects for delete
using (
  bucket_id = 'videos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);
