# 🛍️ EcoStore - Full-Stack E-commerce Platform

> **A modern, full-stack e-commerce platform built with React and Django, featuring secure Braintree payments, stunning UI/UX, and enterprise-ready architecture.**

## 🌟 Major Highlights

### 🎨 **Stunning Modern UI/UX**
- **Glassmorphism Design**: Beautiful glassmorphic effects with backdrop blur and transparency
- **Dark/Light Mode**: Seamless theme switching with user preference persistence
- **Responsive Design**: Mobile-first approach that works flawlessly across all devices
- **Smooth Animations**: Professional micro-interactions and loading states
- **Custom Toast Notifications**: Beautiful feedback system for user actions

### 🔐 **Enterprise-Level Security**
- **SSL/HTTPS Support**: Complete SSL implementation for secure connections
- **JWT Authentication**: Secure token-based authentication system
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Input Validation**: Comprehensive data validation on both frontend and backend
- **Session Management**: Secure user session handling

### 💳 **Advanced Payment Processing**
- **Braintree Integration**: Industry-standard payment processing
- **PayPal Support**: Seamless PayPal checkout experience
- **Credit Card Processing**: Secure credit card transactions
- **Sandbox Testing**: Complete testing environment for development
- **Transaction Tracking**: Detailed payment and order tracking

### 🏗️ **Robust Architecture**
- **RESTful API**: Clean, scalable Django REST Framework backend
- **Component-Based Frontend**: Modular React components for maintainability
- **State Management**: Efficient state handling with React Hooks
- **Database Design**: Optimized SQLite database with proper relationships
- **Error Handling**: Comprehensive error management and user feedback

### 🚀 **Production-Ready Features**
- **Cart Management**: Persistent shopping cart with localStorage
- **User Dashboard**: Complete user profile and order management
- **Admin Panel**: Full-featured Django admin for content management
- **Search & Filter**: Product search and category filtering
- **Image Handling**: Optimized image upload and storage

## 💼 Business Use Case Suitability

### 🎯 **Perfect for Small to Medium Businesses**

#### **Fashion & Clothing Retailers**
- Built specifically for clothing stores with product categories
- Image-focused design perfect for showcasing fashion items
- Size and variant management capabilities
- Mobile-optimized for on-the-go shopping

#### **Startups & New Businesses**
- **Cost-Effective**: Open-source solution with no licensing fees
- **Quick Setup**: Can be deployed and running within hours
- **Scalable**: Grows with your business needs
- **Customizable**: Easy to modify and brand according to your needs

#### **Enterprise Applications**
- **API-First Design**: Can integrate with existing systems
- **Multi-Channel Support**: Backend API can serve web, mobile, and other platforms
- **User Management**: Complete user roles and permissions system
- **Analytics Ready**: Easy to integrate with analytics and reporting tools

### 💰 **Revenue Generation Features**

#### **Multiple Revenue Streams**
- Direct product sales with secure payment processing
- PayPal integration for global customer reach
- Easy integration with additional payment gateways
- Subscription model capability (with minor modifications)

#### **Business Intelligence**
- Order tracking and management
- User behavior insights through comprehensive logging
- Sales reporting capabilities
- Inventory management foundation

#### **Customer Experience**
- Fast, responsive shopping experience
- Secure checkout process
- User account management
- Order history and tracking

## 🛠️ Technology Stack

### **Frontend**
- **React 17.0.2** - Modern JavaScript library for building user interfaces
- **React Router Dom 5.3.0** - Declarative routing for React applications
- **React Toastify 8.0.2** - Beautiful toast notifications
- **Braintree Web Drop-in React** - Secure payment form components
- **Custom CSS** - Hand-crafted styles with modern design patterns

### **Backend**
- **Django 5.0.7** - High-level Python web framework
- **Django REST Framework 3.15.2** - Powerful toolkit for building Web APIs
- **Django CORS Headers 4.4.0** - Cross-Origin Resource Sharing handling
- **SQLite Database** - Lightweight, serverless database engine
- **Pillow 10.4.0** - Python Imaging Library for image processing

### **Payment Processing**
- **Braintree 4.28.0** - Secure payment processing platform
- **PayPal Integration** - Global payment solution
- **SSL Encryption** - End-to-end security for transactions

## 🚀 Quick Start

### **Prerequisites**
- Python 3.8+ with Django 5.0.7
- Node.js 14+ with npm/yarn
- Braintree Sandbox Account

### **Braintree Setup**
1. Create a sandbox account at [Braintree Sandbox](https://www.braintreepayments.com/sandbox)
2. Get your sandbox credentials:
   - Merchant ID
   - Public Key
   - Private Key
3. Update `projBacked/api/payment/views.py` with your credentials:
   ```python
   gateway = braintree.BraintreeGateway(
       braintree.Configuration(
           braintree.Environment.Sandbox,
           merchant_id="your-merchant-id",
           public_key="your-public-key", 
           private_key="your-private-key"
       )
   )
   ```

### **Installation**

#### **1. Clone the Repository**
```bash
git clone https://github.com/dennismbugua/Ecommerce-Store-ReactJS-and-Django-with-Braintree-.git
cd Ecommerce-Store-ReactJS-and-Django-with-Braintree-
```

#### **2. Backend Setup**
```bash
# Navigate to backend directory
cd projBacked

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start Django server
python manage.py runserver
```

#### **3. Frontend Setup**
```bash
# Navigate to frontend directory
cd projfrontend

# Install dependencies
npm install

# Start React development server
npm start
```

#### **4. SSL Configuration (Optional)**
```bash
# Generate SSL certificates for HTTPS
./generate-ssl.sh

# Start with HTTPS
npm run start:https
```

### **Environment Variables**

Create `.env` file in `projfrontend`:
```env
REACT_APP_BACKEND=http://127.0.0.1:8000/admin/
HTTPS=true
GENERATE_SOURCEMAP=false
```

## 📱 Features Overview

### **User Features**
- ✅ User Registration & Authentication
- ✅ Product Browsing & Search
- ✅ Shopping Cart Management
- ✅ Secure Checkout Process
- ✅ Order History & Tracking
- ✅ User Profile Management
- ✅ Dark/Light Mode Toggle

### **Admin Features**
- ✅ Product Management (CRUD)
- ✅ Category Management
- ✅ Order Management & Tracking
- ✅ User Management
- ✅ Payment Transaction Monitoring
- ✅ Dashboard Analytics

### **Technical Features**
- ✅ Responsive Design (Mobile-First)
- ✅ Progressive Web App Ready
- ✅ SEO Optimized
- ✅ Cross-Browser Compatible
- ✅ API Documentation Ready
- ✅ Error Handling & Logging

## 🎥 Demo & Documentation

### **Demo Video**
[![EcoStore Demo](https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg)](https://youtu.be/jhe_6WUrRqM)

*Click the image above to watch a comprehensive demo of the EcoStore platform showcasing all major features including product browsing, cart management, user authentication, and secure payment processing.*

### **Detailed Blog Article**
📖 **[Read the Complete Guide](https://dennismbugua.co.ke/articles/building-a-modern-e-commerce-platform-react--django--braintree-integration)**

*Dive deep into the technical implementation, architecture decisions, and best practices used in building this full-stack e-commerce platform.*

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                 │
├─────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Home      │  │   Products  │  │    Cart     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │    Auth     │  │   Payment   │  │   Profile   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────┤
│                 API Communication                   │
├─────────────────────────────────────────────────────┤
│                Backend (Django)                     │
├─────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Products  │  │    Users    │  │   Orders    │ │
│  │     API     │  │     API     │  │     API     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │  Categories │  │  Payments   │  │    Admin    │ │
│  │     API     │  │     API     │  │    Panel    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────┤
│               Database (SQLite)                     │
├─────────────────────────────────────────────────────┤
│          External Services (Braintree)              │
└─────────────────────────────────────────────────────┘
```

## 📊 Performance & Scalability

### **Performance Optimizations**
- **Code Splitting**: Lazy loading of components for faster initial load
- **Image Optimization**: Compressed images with proper formats
- **Caching**: Strategic caching for improved response times
- **Database Indexing**: Optimized database queries

### **Scalability Considerations**
- **Microservices Ready**: API-first architecture allows easy service separation
- **Database Flexibility**: Easy migration to PostgreSQL/MySQL for production
- **CDN Integration**: Static assets can be served via CDN
- **Load Balancing**: Architecture supports horizontal scaling

## 🔧 Configuration & Customization

### **Theme Customization**
```css
/* Custom CSS variables for easy theming */
:root {
  --primary-color: #your-brand-color;
  --secondary-color: #your-secondary-color;
  --accent-color: #your-accent-color;
}
```

### **API Endpoints**
```javascript
// Main API endpoints
const API_ENDPOINTS = {
  products: '/api/products/',
  categories: '/api/categories/',
  orders: '/api/orders/',
  payments: '/api/braintree/payment/',
  auth: '/api/auth/'
};
```

## 🧪 Testing

### **Frontend Testing**
```bash
# Run React tests
npm test

# Run test coverage
npm run test:coverage
```

### **Backend Testing**
```bash
# Run Django tests
python manage.py test

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

## 🚀 Deployment

### **Frontend Deployment (Netlify/Vercel)**
```bash
# Build for production
npm run build

# Deploy build folder to your hosting platform
```

### **Backend Deployment (Heroku/DigitalOcean)**
```bash
# Install production dependencies
pip install -r requirements.txt

# Run production server
python manage.py runserver 0.0.0.0:8000
```

### **Environment Variables for Production**
```env
DEBUG=False
ALLOWED_HOSTS=your-domain.com
DATABASE_URL=your-production-db-url
BRAINTREE_ENVIRONMENT=production  # Change to production
```

## 🗺️ Roadmap

### **Technical Improvements**
- [ ] GraphQL API implementation
- [ ] Redis caching layer
- [ ] Elasticsearch integration
- [ ] Docker containerization
- [ ] Kubernetes deployment configs
- [ ] CI/CD pipeline setup
- [ ] Automated testing suite expansion

---

⭐ **Star this repository if you found it helpful!**

📢 **Share it with others who might benefit from this e-commerce solution!**

🚀 **Ready to build your own e-commerce empire? Get started today!**
```

I am expecting python 3.5 or higher already installed in your system

**step 0.** Go in projBackend Folder

**Step 1.**
Install virtualenv by running this command

`py -m pip install --user virtualenv`

**Step 2.**
Create virtual enviroment by running this command
`py -m venv env`

**Step 3.** Activate your virtual enviroment by running this command
`.\env\Scripts\activate`

**Step 4.** Install all dependencies by running this command
`pip install -r requirements.txt`

**step 5.** For running the django run this command
`python manage.py runserver`

congratulation your backend is up and running


> ## Setup Frontend

I am expecting Node 14.7 or higher already installed in your system

**step 0.** Go in projfrontend Folder

_note:- you can use npm or yarn any of these package manager here i am using npm_

**step 1.** For install all node dependency run `npm install` command in the terminal.

**step2.** for running the front end run `npm start` command in your terminal

congratulation your frontend is up and running


For sandbox testing you compulsary have to use sandbox specific credit card or other wise you will get error. You will get testing card detail on https://developer.paypal.com/braintree/docs/guides/credit-cards/testing-go-live/php 




