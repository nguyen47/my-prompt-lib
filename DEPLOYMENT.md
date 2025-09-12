# Deployment Guide

## Environment Variables

For the authentication system to work, you need to set the following environment variables:

### Local Development

Create a `.env.local` file in the root directory:

```env
AUTH_EMAIL=your-email@example.com
AUTH_PASSWORD=your-secure-password
```

### Production Deployment

Set these environment variables in your hosting platform:

- `AUTH_EMAIL` - The email address for login
- `AUTH_PASSWORD` - The password for login

## Platform-Specific Instructions

### Vercel

1. Go to your project dashboard on Vercel
2. Navigate to Settings → Environment Variables
3. Add the following variables:
   - `AUTH_EMAIL` = your chosen email
   - `AUTH_PASSWORD` = your chosen password
4. Deploy your project

### Netlify

1. Go to your site dashboard on Netlify
2. Navigate to Site Settings → Environment Variables
3. Add the following variables:
   - `AUTH_EMAIL` = your chosen email
   - `AUTH_PASSWORD` = your chosen password
4. Deploy your project

### Railway

1. Go to your project on Railway
2. Navigate to Variables tab
3. Add the following variables:
   - `AUTH_EMAIL` = your chosen email
   - `AUTH_PASSWORD` = your chosen password
4. Deploy your project

### Docker

The application includes complete Docker support for easy deployment.

#### Quick Start

1. Create `.env` file:
```bash
cat << EOF > .env
AUTH_EMAIL=admin@promptlib.com
AUTH_PASSWORD=your-secure-password
EOF
```

2. Run the deployment script:
```bash
./scripts/deploy.sh
```

#### Manual Docker Commands

For production deployment:
```bash
# Build and run
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f

# Stop
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
```

For development:
```bash
# Development mode (with hot reload)
docker-compose up -d
```

#### Accessing the Application

Once deployed, the application will be available at:
- **URL:** http://localhost:3002
- **Port:** 3002 (as specified in docker-compose)

#### Docker Features

- ✅ Multi-stage build for optimized production image
- ✅ Non-root user for security
- ✅ Persistent SQLite database with volume mounting
- ✅ Health checks for container monitoring
- ✅ Automatic restart on failure
- ✅ Log rotation for production
- ✅ Development override for hot reload

#### Troubleshooting Docker Build Issues

If you encounter build errors with `better-sqlite3`, try the alternative Dockerfile:

```bash
# Use Ubuntu-based Dockerfile for better compatibility
USE_ALTERNATIVE_DOCKERFILE=true ./scripts/deploy.sh
```

Or manually:
```bash
# Set environment variable and build
export DOCKERFILE=Dockerfile.alternative
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

**Common Issues:**
- **Node.js version errors**: Fixed by using Node.js 20+ (already configured)
- **Python/build tools missing**: Fixed in alternative Dockerfile with Ubuntu base
- **SQLite compilation errors**: Use `Dockerfile.alternative` for better compatibility

**Dockerfile Options:**
- `Dockerfile` (default): Alpine-based, smaller image size
- `Dockerfile.alternative`: Ubuntu-based, better compatibility with native modules

## Security Notes

- Use a strong password for production
- Consider using a password manager to generate secure credentials
- The email can be any valid email format (doesn't need to be a real email)
- Change the default credentials before deploying to production

## Database

The SQLite database will be created automatically in the `data/` directory. Make sure this directory is writable in your deployment environment.

For platforms like Vercel that don't support persistent file storage, the database will be recreated on each deployment. Consider using a persistent database solution for production if you need data persistence across deployments.
