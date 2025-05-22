# Kamusewa - Rental Management System 🏪

A modern web application for managing rental businesses, built with Next.js and TypeScript.

![Next.js](https://img.shields.io/badge/Next.js-13.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- 🔐 **Authentication**
  - Secure login and registration
  - Protected routes
  - Session management

- 📦 **Inventory Management**
  - Add, edit, and delete items
  - Categorize items
  - Track stock levels
  - Set rental prices

- 👥 **Customer Management**
  - Customer profiles
  - Contact information
  - Rental history

- 📝 **Rental Management**
  - Create rental transactions
  - Track rental status
  - Calculate rental costs
  - Manage returns

- 📊 **Dashboard**
  - Overview of business metrics
  - Recent activities
  - Quick actions

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm (recommended) or npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/fe-kamusewa.git
cd fe-kamusewa
```

2. Install dependencies
```bash
pnpm install
```

3. Create a `.env.local` file in the root directory
```env
NEXT_PUBLIC_API_URL=https://api.ks.kodekosan.com/api
```

4. Start the development server
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
fe-kamusewa/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   └── profile/          # User profile
├── components/            # Reusable components
│   ├── forms/            # Form components
│   └── ui/               # UI components
├── lib/                   # Utility functions and services
│   ├── api/              # API services and types
│   └── utils/            # Helper functions
└── public/               # Static assets
```

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn UI](https://ui.shadcn.com/) - UI components
- [Lucide Icons](https://lucide.dev/) - Icons

## 📦 API Services

The application uses a modular API service structure:

```typescript
// Example usage
import { itemService, type Item } from '@/lib/api'

// Get all items
const items = await itemService.getAll()
```

Available services:
- `authService` - Authentication
- `itemService` - Item management
- `categoryService` - Category management
- `customerService` - Customer management
- `rentalService` - Rental management

## 🔒 Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_API_URL=your_api_url
```

## 🚀 Deployment

The application is configured for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy!

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@kamusewa.com or join our Slack channel.

---

Made with ❤️ by [Your Name/Team]
