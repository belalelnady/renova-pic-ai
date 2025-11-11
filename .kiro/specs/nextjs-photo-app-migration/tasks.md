# Implementation Plan

- [x] 1. Set up Next.js project structure and core dependencies





  - Initialize Next.js 14 project with TypeScript and App Router
  - Install and configure Tailwind CSS, Shadcn/ui components
  - Set up project folder structure according to design specifications
  - Configure ESLint, Prettier, and TypeScript settings
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 2. Configure database and authentication infrastructure





  - [x] 2.1 Set up PostgreSQL database and Prisma ORM


    - Install Prisma and PostgreSQL dependencies
    - Create Prisma schema with User, Photo, CartItem, and Order models
    - Generate Prisma client and run initial migration
    - _Requirements: 1.3, 4.1, 5.1, 6.3_

  - [x] 2.2 Implement NextAuth.js with Google OAuth


    - Install and configure NextAuth.js with Google provider
    - Create authentication API routes and middleware
    - Set up session management and user creation logic
    - _Requirements: 1.1, 1.2, 1.3, 1.5_

- [x] 3. Create core layout and navigation components





  - [x] 3.1 Build main layout with header and footer


    - Create Layout component with responsive header navigation
    - Implement footer with product, support, and legal links
    - Add mobile-responsive navigation menu
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 3.2 Implement authentication UI components


    - Create SignInButton component with Google OAuth integration
    - Build user profile dropdown with logout functionality
    - Add authentication state management throughout the app
    - _Requirements: 1.1, 1.5_

- [x] 4. Implement internationalization and language support





  - [x] 4.1 Set up next-intl for bilingual support


    - Install and configure next-intl for English and Arabic
    - Create translation files with all required text content
    - Implement language detection and persistence
    - _Requirements: 7.1, 7.2, 7.3, 7.6_

  - [x] 4.2 Implement RTL layout switching


    - Create LanguageToggle component with language switching logic
    - Implement CSS classes for RTL/LTR layout switching
    - Test layout changes across all components
    - _Requirements: 7.4, 7.5_

- [x] 5. Build photo upload and AI processing functionality





  - [x] 5.1 Create photo upload component


    - Build PhotoUpload component with drag-and-drop and camera capture
    - Implement file validation for image types and size limits
    - Add upload progress indicators and error handling
    - _Requirements: 2.2, 8.3, 8.4_

  - [x] 5.2 Implement AI tool selection and processing


    - Create AI tool selection interface with preview examples
    - Build API routes for communicating with AI webhook services
    - Implement photo processing workflow with status tracking
    - Add timeout handling and error recovery for AI processing
    - _Requirements: 2.1, 2.3, 2.4, 2.6_

  - [x] 5.3 Build before/after photo comparison


    - Create BeforeAfterSlider component for photo comparison
    - Implement side-by-side photo display option
    - Add photo storage logic for original and edited versions
    - _Requirements: 2.4, 2.5, 8.1, 8.2_

- [x] 6. Implement print customization and pricing system





  - [x] 6.1 Create print options interface


    - Build print size selection component
    - Implement quantity adjustment controls
    - Add conditional options for frames and extra prints based on photo category
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 6.2 Implement dynamic pricing calculation


    - Create pricing calculation logic for different print options
    - Build real-time price update functionality
    - Store editing settings and pricing in Photo entity
    - _Requirements: 3.5, 3.6_

- [x] 7. Build photo gallery and management features




  - [x] 7.1 Create photo gallery display


    - Build PhotoGallery component with grid layout
    - Implement photo retrieval from database with user filtering
    - Add slideshow functionality for large photo viewing
    - _Requirements: 4.1, 4.4_

  - [x] 7.2 Implement gallery filtering and sorting


    - Add filter controls for AI tool type
    - Implement sorting options by date and alphabetical order
    - Create search functionality for photo titles
    - _Requirements: 4.2, 4.3_

  - [x] 7.3 Add gallery cart integration


    - Implement "Add to Cart" functionality from gallery
    - Create quick action buttons for each photo
    - Add batch selection for multiple photos
    - _Requirements: 4.5_

- [x] 8. Develop shopping cart system




  - [x] 8.1 Create cart management components


    - Build CartItem component with photo display and controls
    - Implement quantity adjustment and item removal
    - Create CartSummary component with price calculations
    - _Requirements: 5.2, 5.3, 5.4_

  - [x] 8.2 Implement cart state management


    - Create cart API routes for CRUD operations
    - Build useCart hook for cart state management
    - Add cart item count display in navigation header
    - _Requirements: 5.1, 5.5, 5.6_

- [x] 9. Build order processing and checkout system




  - [x] 9.1 Create checkout form and validation


    - Build shipping address collection form
    - Implement form validation with Zod schemas
    - Add address validation and formatting
    - _Requirements: 6.1, 6.2_

  - [x] 9.2 Implement order creation and confirmation


    - Create order processing API route with unique order number generation
    - Build order confirmation dialog with order details
    - Implement cart clearing after successful order
    - Trigger database webhook for external order processing
    - _Requirements: 6.3, 6.4, 6.5, 6.6_

  - [x] 9.3 Build order history and tracking


    - Create order history display in user profile
    - Implement order status tracking and updates
    - Add order details view with tracking information
    - _Requirements: 6.7_

- [x] 10. Create static content pages





  - [x] 10.1 Build privacy policy page


    - Create Privacy page component with comprehensive policy content
    - Implement bilingual content with proper translations
    - Add contact information and data handling details
    - _Requirements: 10.1, 10.3, 10.4_

  - [x] 10.2 Build returns policy page


    - Create Returns page component with return policy details
    - Include return eligibility, process, and shipping information
    - Add contact information for return inquiries
    - _Requirements: 10.2, 10.3, 10.4_

  - [x] 10.3 Implement footer navigation integration


    - Link policy pages from footer navigation
    - Ensure accessibility compliance for all static pages
    - Test page rendering in both languages
    - _Requirements: 10.5_

- [x] 11. Implement file storage and webhook integrations





  - [x] 11.1 Set up file storage system


    - Configure file upload handling for photos
    - Implement secure file storage with unique URL generation
    - Add thumbnail generation for photo previews
    - _Requirements: 8.1, 8.2, 8.5_

  - [x] 11.2 Integrate AI processing webhooks


    - Create API routes for each AI tool webhook (visa-photo, absher, saudi-look, baby-photo)
    - Implement webhook authentication and validation
    - Add error handling and retry logic for webhook failures
    - _Requirements: 2.3, 2.6_

  - [x] 11.3 Set up database webhook integration


    - Create photo_created event webhook for external processing
    - Implement webhook payload formatting and delivery
    - Add webhook failure handling and logging
    - _Requirements: 6.4_

- [x] 12. Add error handling and validation





  - [x] 12.1 Implement comprehensive error boundaries


    - Create error boundary components for different app sections
    - Add toast notification system for user feedback
    - Implement loading states and error recovery options
    - _Requirements: 2.6_

  - [x] 12.2 Add form validation and security measures


    - Implement Zod schemas for all form inputs
    - Add CSRF protection and rate limiting
    - Create input sanitization for user data
    - _Requirements: 6.2, 8.3, 8.4_

- [ ]* 12.3 Write comprehensive test suite
    - Create unit tests for all components and utilities
    - Write integration tests for API routes and database operations
    - Add end-to-end tests for critical user workflows
    - _Requirements: All requirements validation_

- [-] 13. Optimize performance and deploy










  - [x] 13.1 Implement performance optimizations


    - Add image optimization with Next.js Image component
    - Implement lazy loading for photo galleries
    - Configure React Query caching strategies
    - _Requirements: 4.4, 9.1_

  - [x] 13.2 Set up production deployment


    - Configure environment variables for production
    - Set up database migrations and seeding
    - Deploy to production environment with monitoring
    - _Requirements: All requirements in production environment_