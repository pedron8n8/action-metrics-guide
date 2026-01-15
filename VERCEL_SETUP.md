# Deploy na Vercel - Configuração

## Variáveis de Ambiente

Após fazer o deploy na Vercel, você precisa configurar as seguintes variáveis de ambiente:

### Passos:

1. Acesse o dashboard do seu projeto na Vercel
2. Vá em **Settings** > **Environment Variables**
3. Adicione as seguintes variáveis:

```
VITE_AIRTABLE_API_KEY=sua_chave_airtable_aqui
VITE_AIRTABLE_BASE_ID=appEzxAgICoJK3bFa
VITE_AIRTABLE_TABLE_ID=tblHHCUcIFMR0p80Z
```

### Como obter a chave do Airtable:

1. Acesse https://airtable.com/account
2. Na seção "API", clique em "Generate token"
3. Copie a chave gerada
4. Cole na variável `VITE_AIRTABLE_API_KEY` na Vercel

### Importante:

- ✅ As variáveis devem começar com `VITE_` para serem acessíveis no frontend
- ✅ Após adicionar as variáveis, faça um novo deploy
- ✅ Nunca commit o arquivo `.env` com suas chaves reais

## Build Settings na Vercel

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Após o Deploy

O sistema vai:
- ✅ Buscar dados diretamente do Airtable
- ✅ Aplicar filtros de data (today, week, month, custom)
- ✅ Fazer paginação automática para buscar todos os registros
- ✅ Exibir o dashboard com dados em tempo real
