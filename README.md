# Hans Peter Online Shop

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project Stack

- **Frontend:** Next.js 16 + React 19 + TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Backend:** Next.js API Routes + Socket.IO (WebSockets)
- **Database:** PostgreSQL + Prisma ORM
- **DevOps:** Docker Compose

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Git Workflow & Branch Strategy

### Quick Start - Working with Branches

**1. Pick an Issue from GitHub**
- Go to [Issues](https://github.com/NiklasTech/hans-peter-online-shop/issues)
- Find the issue you want to work on
- Note the issue number (e.g., #1, #5, #23)

**2. Create a Branch**
```bash
# Feature branch
git checkout -b feature/#<ISSUE_NUMBER>-<description>

# Example:
git checkout -b feature/#1-navbar
git checkout -b feature/#5-product-card

# For admin features (no issue number needed)
git checkout -b admin-dashboard
```

**3. Make Your Changes**
```bash
# Edit files...
git add .
git commit -m "feat: Add navbar component (#1)"
git push -u origin feature/#1-navbar
```

**4. Create a Pull Request on GitHub**
- GitHub will show "Compare & Pull Request" button
- Add title: `feat: Add navbar component`
- Add description: What did you do?
- Click "Create Pull Request"

**5. After Review & Merge**
```bash
git checkout main
git pull origin main
git branch -d feature/#1-navbar
```

### Branch Naming Rules

✅ **Allowed:**
- `feature/#1-navbar`
- `bugfix/#10-cart-error`
- `hotfix/#20-payment-issue`
- `admin-dashboard`
- Groß-/Kleinschreibung ist egal
- Minuse sind erlaubt

❌ **Not Allowed:**
- `my-feature` (keine Issue-Nummer)
- `fix-bug` (falsches Format)
- Direct commits zu `main` (PR verwenden)

### Common Commands

```bash
# List branches
git branch -a

# Switch branches
git checkout main
git checkout feature/#1-navbar

# Push your branch
git push origin feature/#1-navbar

# Pull latest from main
git checkout main
git pull origin main

# Delete local branch
git branch -d feature/#1-navbar

# Delete remote branch
git push origin --delete feature/#1-navbar
```

For more details, see [BRANCHING-STRATEGY.md](./BRANCHING-STRATEGY.md)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
