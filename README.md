# Automation Hub

Plataforma fullstack para gerenciamento de usuários, controle de permissões e execução segura de scripts.

O Automation Hub foi criado para permitir que desenvolvedores disponibilizem scripts e automações de forma centralizada, enquanto usuários finais podem executá-los com segurança e simplicidade — mesmo sem conhecimento técnico.

O foco do projeto é unir segurança, organização e usabilidade, garantindo controle total sobre quem pode subir, gerenciar e executar scripts.

------------------------------------------------------------------------
## Objetivo do Projeto

O projeto tem como principal objetivo:

-   Permitir que desenvolvedores (dev) façam upload e gerenciem scripts
-   Permitir que usuários (user) executem esses scripts de forma simples
-   Garantir que apenas perfis autorizados tenham acesso a determinadas ações
-   Facilitar o uso de automações por pessoas que não são familiarizadas com programação

A ideia central é reduzir barreiras técnicas e centralizar automações em um ambiente seguro.
------------------------------------------------------------------------

## Visão Geral

A aplicação implementa um sistema completo de autenticação com controle
de acesso baseado em roles (RBAC), área administrativa protegida e
gerenciamento de usuários.

Boas práticas aplicadas:

-   Organização modular de código
-   Segurança baseada em JWT
-   Controle de acesso por role
-   Integração frontend + backend
-   Estrutura preparada para escalabilidade

------------------------------------------------------------------------

## Principais Funcionalidades

### Autenticação

-   Registro de usuários
-   Login com geração de JWT
-   Proteção de rotas via Bearer Token

### Controle de Permissões (RBAC)

-   Roles disponíveis: user, dev, admin
-   Validação de permissões no backend
-   Área administrativa protegida

### Administração

-   Listagem de usuários
-   Alteração de permissões
-   Exclusão de usuários

------------------------------------------------------------------------

## Arquitetura

### Backend

-   FastAPI
-   SQLModel
-   JWT Authentication
-   Estrutura modular (auth, db, routers)

### Frontend

-   React + TypeScript
-   Axios
-   Wouter
-   Shadcn/UI
-   TailwindCSS

Comunicação via API REST protegida por token JWT.

------------------------------------------------------------------------

## Diferenciais Técnicos

-   Implementação real de RBAC
-   Separação clara de responsabilidades
-   Proteção de rotas no backend
-   Estrutura preparada para expansão

------------------------------------------------------------------------

