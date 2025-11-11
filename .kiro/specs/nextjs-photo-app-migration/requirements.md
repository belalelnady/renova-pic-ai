# Requirements Document

## Introduction

This document outlines the requirements for migrating a React-based AI photo editing and printing application to Next.js with PostgreSQL database and Google Authentication. The application allows users to upload photos, apply AI-powered editing tools (Visa Photo, Absher Photo, Saudi Look, Baby Photo), customize print options, manage a shopping cart, and place orders. The system supports bilingual functionality (English/Arabic) with RTL support.

## Glossary

- **Photo Editing App**: The web application system that provides AI-powered photo editing and print ordering services
- **User**: An authenticated individual who uses the Photo Editing App to edit photos and place orders
- **AI Tool**: External webhook-based service that processes photos (Visa Photo, Absher Photo, Saudi Look, Baby Photo)
- **Photo Entity**: Database record storing photo metadata, editing settings, and file references
- **Cart System**: Shopping cart functionality that manages items before checkout
- **Order System**: Order processing and tracking functionality
- **Next.js App**: The migrated application built on Next.js framework
- **PostgreSQL Database**: The relational database system storing all application data
- **Google OAuth**: Authentication system using Google identity provider
- **Bilingual Interface**: User interface supporting both English and Arabic languages with RTL layout

## Requirements

### Requirement 1: User Authentication

**User Story:** As a user, I want to sign in with my Google account, so that I can securely access my photos and orders

#### Acceptance Criteria

1. WHEN a user visits the Photo Editing App, THE Next.js App SHALL display a Google sign-in option
2. WHEN a user clicks the Google sign-in button, THE Next.js App SHALL redirect to Google OAuth consent screen
3. WHEN Google OAuth returns successful authentication, THE Next.js App SHALL create or retrieve the user record in PostgreSQL Database
4. THE Next.js App SHALL maintain user session across page navigations
5. WHEN a user clicks logout, THE Next.js App SHALL terminate the session and redirect to the home page

### Requirement 2: Photo Upload and AI Processing

**User Story:** As a user, I want to upload photos and apply AI editing tools, so that I can get professionally edited photos

#### Acceptance Criteria

1. WHEN a user navigates to the edit photo page, THE Next.js App SHALL display available AI Tool options with preview examples
2. THE Next.js App SHALL accept photo uploads from device storage or camera capture
3. WHEN a user selects an AI Tool and uploads a photo, THE Next.js App SHALL send the photo to the corresponding AI Tool webhook
4. WHEN the AI Tool webhook returns processed results, THE Next.js App SHALL display the edited photo with before/after comparison
5. THE Next.js App SHALL store both original and edited photo URLs in the Photo Entity within PostgreSQL Database
6. IF the AI Tool webhook fails to respond within 60 seconds, THEN THE Next.js App SHALL display an error message to the user

### Requirement 3: Print Customization and Pricing

**User Story:** As a user, I want to customize print options and see pricing, so that I can order physical prints of my edited photos

#### Acceptance Criteria

1. WHEN a user views an edited photo, THE Next.js App SHALL display available print size options
2. THE Next.js App SHALL allow users to specify quantity for each print size
3. WHERE the photo category is portrait, THE Next.js App SHALL offer optional frame addition
4. WHERE the photo category is ID photo, THE Next.js App SHALL offer optional extra print sets
5. WHEN a user modifies print options, THE Next.js App SHALL calculate and display the updated price in real-time
6. THE Next.js App SHALL store all editing settings and pricing in the Photo Entity

### Requirement 4: Gallery Management

**User Story:** As a user, I want to view and manage my saved photos, so that I can access my editing history

#### Acceptance Criteria

1. WHEN a user navigates to the gallery page, THE Next.js App SHALL retrieve and display all Photo Entity records belonging to the user from PostgreSQL Database
2. THE Next.js App SHALL allow users to filter photos by AI Tool type
3. THE Next.js App SHALL allow users to sort photos by date or alphabetically
4. WHEN a user clicks on a photo, THE Next.js App SHALL display the photo in slideshow view
5. THE Next.js App SHALL provide an option to add photos directly to the Cart System from the gallery

### Requirement 5: Shopping Cart Management

**User Story:** As a user, I want to manage items in my cart, so that I can review and modify my order before checkout

#### Acceptance Criteria

1. WHEN a user adds a photo to cart, THE Next.js App SHALL create a cart item record in PostgreSQL Database
2. THE Next.js App SHALL display all cart items with photo thumbnails, print details, and prices
3. THE Next.js App SHALL allow users to modify quantity for each cart item
4. THE Next.js App SHALL allow users to remove items from the cart
5. WHEN cart contents change, THE Next.js App SHALL recalculate subtotal, shipping, and total amounts
6. THE Next.js App SHALL display the cart item count in the navigation header

### Requirement 6: Order Placement and Tracking

**User Story:** As a user, I want to place orders and track their status, so that I can receive my printed photos

#### Acceptance Criteria

1. WHEN a user proceeds to checkout, THE Next.js App SHALL collect shipping address information
2. THE Next.js App SHALL validate all required shipping address fields before order creation
3. WHEN a user confirms the order, THE Next.js App SHALL create an Order Entity record in PostgreSQL Database with unique order number
4. THE Next.js App SHALL trigger the database webhook to notify external systems of the new order
5. WHEN an order is created, THE Next.js App SHALL clear the user's cart items
6. THE Next.js App SHALL display order confirmation with order number and details
7. WHEN a user views their profile, THE Next.js App SHALL display order history with status and tracking information

### Requirement 7: Bilingual Interface Support

**User Story:** As a user, I want to use the app in my preferred language, so that I can understand all content clearly

#### Acceptance Criteria

1. THE Next.js App SHALL support both English and Arabic languages
2. THE Next.js App SHALL provide a language toggle button in the navigation header
3. WHEN a user switches language, THE Next.js App SHALL update all interface text immediately
4. WHEN Arabic language is selected, THE Next.js App SHALL apply right-to-left (RTL) layout
5. WHEN English language is selected, THE Next.js App SHALL apply left-to-right (LTR) layout
6. THE Next.js App SHALL persist language preference across sessions

### Requirement 8: File Storage Management

**User Story:** As a user, I want my photos to be stored securely, so that I can access them reliably

#### Acceptance Criteria

1. WHEN a user uploads a photo, THE Next.js App SHALL store the file in the designated file storage system
2. THE Next.js App SHALL generate and store unique URLs for original photos, edited photos, and thumbnails
3. THE Next.js App SHALL validate file types to accept only image formats
4. THE Next.js App SHALL limit file upload size to 10 megabytes
5. THE Next.js App SHALL ensure uploaded files are associated with the authenticated user

### Requirement 9: Responsive Design and Navigation

**User Story:** As a user, I want to access the app on any device, so that I can use it conveniently

#### Acceptance Criteria

1. THE Next.js App SHALL render correctly on desktop, tablet, and mobile screen sizes
2. THE Next.js App SHALL provide a mobile-responsive navigation menu
3. THE Next.js App SHALL display a header with navigation links to Home, Edit Photo, Gallery, Cart, and Profile pages
4. THE Next.js App SHALL display a footer with product information, support links, and social media links
5. WHEN a user navigates between pages, THE Next.js App SHALL maintain consistent layout and styling

### Requirement 10: Static Content Pages

**User Story:** As a user, I want to read privacy and return policies, so that I understand my rights and the app's terms

#### Acceptance Criteria

1. THE Next.js App SHALL provide a Privacy Policy page with information about data collection and usage
2. THE Next.js App SHALL provide a Returns Policy page with information about return eligibility and process
3. THE Next.js App SHALL display both policy pages in the selected language
4. THE Next.js App SHALL include contact information on policy pages
5. THE Next.js App SHALL make policy pages accessible from the footer navigation
