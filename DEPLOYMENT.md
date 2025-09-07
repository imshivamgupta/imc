# GitHub Pages Deployment

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

## Automatic Deployment

The deployment happens automatically when you push to the `main` branch. The workflow:

1. **Builds** the Nuxt.js application using `npm run generate`
2. **Generates** static files in the `dist` directory
3. **Deploys** to GitHub Pages

## Manual Deployment

You can also trigger deployment manually:

1. Go to your repository on GitHub
2. Click on "Actions" tab
3. Select "Deploy to GitHub Pages" workflow
4. Click "Run workflow"

## Setup Instructions

1. **Enable GitHub Pages**:

   - Go to your repository settings
   - Scroll down to "Pages" section
   - Select "GitHub Actions" as the source

2. **Environment Variables** (if needed for production):

   - Go to repository Settings > Secrets and variables > Actions
   - Add any required environment variables:
     - `NUXT_PUBLIC_API_BASE` - Your production API base URL
     - `JWT_SECRET` - Your JWT secret key
     - Database connection variables if using external database

3. **Custom Domain** (optional):
   - Add a `CNAME` file to the `public` directory with your domain
   - Configure DNS settings for your domain

## Local Development

For local development with the same static generation:

```bash
# Install dependencies
npm install

# Generate static site
npm run generate

# Preview the generated site
npm run preview
```

## Important Notes

- **API Routes**: Server-side API routes (`/server/api/*`) won't work on GitHub Pages as it's static hosting
- **Database**: You'll need an external database service for production
- **Authentication**: Consider using a service like Supabase, Firebase, or similar for production auth
- **Environment**: Configure production environment variables in GitHub repository settings

## Alternative Hosting Options

For full-stack functionality (with server API routes), consider:

- **Vercel** - Full Nuxt.js support with serverless functions
- **Netlify** - Similar to Vercel with serverless support
- **Railway** - Full server hosting
- **Digital Ocean** - VPS hosting
- **Heroku** - Platform as a Service

## Production Checklist

- [ ] Set up external database
- [ ] Configure environment variables
- [ ] Set up external authentication service
- [ ] Test all functionality in production environment
- [ ] Set up monitoring and error tracking
