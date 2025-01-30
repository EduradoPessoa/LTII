-- Habilitar extensões necessárias
create extension if not exists "uuid-ossp";

-- Configurar RLS (Row Level Security)
alter default privileges revoke execute on functions from public;

-- Tabela de usuários
create table public.users (
    id uuid default uuid_generate_v4() primary key,
    email text unique not null,
    encrypted_password text not null,
    is_admin boolean default false,
    is_owner boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de perfis
create table public.profiles (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade,
    name text not null,
    email text unique not null,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de assinaturas
create table public.subscriptions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade,
    plan text not null check (plan in ('basic', 'premium', 'enterprise')),
    status text not null check (status in ('active', 'inactive', 'cancelled')),
    start_date timestamp with time zone not null,
    end_date timestamp with time zone,
    max_profiles integer not null,
    price decimal(10,2) not null,
    auto_renew boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de pagamentos
create table public.payments (
    id uuid default uuid_generate_v4() primary key,
    subscription_id uuid references public.subscriptions(id) on delete cascade,
    amount decimal(10,2) not null,
    status text not null check (status in ('success', 'failed', 'pending')),
    payment_date timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Funções auxiliares
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql security definer;

-- Triggers para updated_at
create trigger handle_users_updated_at
    before update on public.users
    for each row
    execute function public.handle_updated_at();

create trigger handle_profiles_updated_at
    before update on public.profiles
    for each row
    execute function public.handle_updated_at();

create trigger handle_subscriptions_updated_at
    before update on public.subscriptions
    for each row
    execute function public.handle_updated_at();

-- Políticas de segurança (RLS)
alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;

-- Políticas para usuários
create policy "Usuários podem ver seus próprios dados"
    on public.users for select
    using (auth.uid() = id or is_admin = true);

create policy "Apenas admins podem criar usuários"
    on public.users for insert
    with check (auth.role() = 'authenticated' and exists (
        select 1 from public.users where id = auth.uid() and is_admin = true
    ));

-- Políticas para perfis
create policy "Usuários podem ver perfis associados"
    on public.profiles for select
    using (
        auth.uid() = user_id 
        or exists (
            select 1 from public.users 
            where id = auth.uid() and is_admin = true
        )
    );

create policy "Apenas donos e admins podem gerenciar perfis"
    on public.profiles for all
    using (
        exists (
            select 1 from public.users 
            where id = auth.uid() and (is_admin = true or is_owner = true)
        )
    );

-- Políticas para assinaturas
create policy "Usuários podem ver suas assinaturas"
    on public.subscriptions for select
    using (
        auth.uid() = user_id 
        or exists (
            select 1 from public.users 
            where id = auth.uid() and is_admin = true
        )
    );

-- Índices
create index idx_profiles_user_id on public.profiles(user_id);
create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_payments_subscription_id on public.payments(subscription_id);
