# Git Commit Commands

Run these commands in order to commit and push your changes to GitHub:

## Step 1: Stage All Changes

```bash
git add package.json package-lock.json eslint.config.js
git rm .eslintrc.json
```

Or to add everything (including the new DEPLOYMENT.md if not already committed):

```bash
git add -A
```

## Step 2: Commit with a Descriptive Message

```bash
git commit -m "Fix ESLint dependency conflict: upgrade to ESLint 9 and migrate to flat config"
```

Or if you want a more detailed commit message:

```bash
git commit -m "Fix ESLint dependency conflict

- Upgrade ESLint from v8 to v9 to match eslint-config-next@16.1.6 requirements
- Migrate from .eslintrc.json to ESLint 9 flat config (eslint.config.js)
- Add @eslint/eslintrc dependency for compatibility layer
- Fixes Vercel build deployment errors"
```

## Step 3: Push to GitHub

```bash
git push origin main
```

## Verify Your Contribution

After pushing, check your GitHub profile to confirm the contribution appears:
- Go to https://github.com/YOUR_USERNAME
- Check the contribution graph
- The commit should appear as a green square on today's date

## Alternative: Single Command (if you're confident)

```bash
git add -A && git commit -m "Fix ESLint dependency conflict: upgrade to ESLint 9 and migrate to flat config" && git push origin main
```

---

**Note**: Make sure your GitHub email (`patrick.antall2@gmail.com`) matches the email in your GitHub account settings for contributions to register properly. You can verify this at: https://github.com/settings/emails
