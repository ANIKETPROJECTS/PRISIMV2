# PRISM - Post-Production Management System
## Complete User Guide

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [Login & Authentication](#login--authentication)
3. [Dashboard Overview](#dashboard-overview)
4. [Operations Section](#operations-section)
5. [Masters Section](#masters-section)
6. [Reports Section](#reports-section)
7. [User Profile & Settings](#user-profile--settings)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### What is PRISM?
PRISM is a comprehensive Post-Production Management System designed to streamline bookings, resource allocation, invoicing, and reporting for production studios. It helps manage rooms, editors, customers, projects, and all associated operations efficiently.

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Active internet connection
- JavaScript enabled

---

## Login & Authentication

### Accessing PRISM
1. Open your browser and navigate to the PRISM application URL
2. You will be presented with the login page featuring:
   - **PRISM Logo**: Post-Production Management System branding
   - **Username Field**: Enter your assigned username
   - **Security PIN Field**: Enter your unique 4-digit security PIN
   - **Company Selector**: Choose which company you're logging into
   - **Sign In Button**: Submit your credentials

### Login Credentials
The system comes with default admin accounts:

**Company 1: PRISM**
- Username: `admin`
- Security PIN: `1234`

**Company 2: Airavata Studio**
- Username: `airavata_admin`
- Security PIN: `1234`

### Security Features
- **Security PIN**: 4-digit numeric code for additional security beyond username
- **Company Selection**: Users can be assigned to specific companies
- **Session Management**: Automatic logout after inactivity
- **Password Protection**: Secure password storage for backend operations

### Resetting Credentials
Contact your system administrator if you forget your username or security PIN.

---

## Dashboard Overview

### Main Dashboard
After successful login, you'll see the main dashboard with:

#### Left Sidebar Navigation
The sidebar is organized into three main sections:

**Operations** (Active management tasks)
- Booking
- Leaves Entry
- Chalan Entry
- Chalan Revise

**Masters** (Reference data management)
- Customer Master
- Project Master
- Room Master
- Editor Master

**Reports** (Analytical & historical views)
- Conflict Report
- Booking Report

#### Top Header
- **Company Selector**: Switch between companies (if authorized)
- **Current Date**: Displays today's date
- **Theme Toggle**: Switch between light/dark mode
- **User Menu**: Profile and logout options

---

## Operations Section

### 1. Booking

**Purpose**: Create and manage studio room bookings for different projects and editors.

#### Features:

**Create New Booking**
- **Room Selection**: Choose from available studios (Studio A, Studio B, Sound Room, VFX Lab, Music Room, Dubbing Theater, Mixing Suite)
- **Customer Selection**: Select the customer/production company
- **Project Selection**: Choose the project associated with the booking
- **Contact Person**: Specify the primary contact for this booking
- **Editor Assignment**: Assign an available editor to the booking
- **Booking Date**: Select the date for the booking
- **Time Slot**: Set start time (From) and end time (To)
- **Booking Status**: Select from:
  - **Planning**: Preliminary booking
  - **Tentative**: Likely to proceed
  - **Confirmed**: Finalized booking
  - **Cancelled**: No longer needed
- **Break Hours**: Specify lunch/tea break duration
- **Notes**: Add additional details or special requirements

**View Bookings**
- Calendar view showing all bookings
- Filter by:
  - Room
  - Customer
  - Date range
  - Project
  - Status

**Edit Booking**
- Modify booking details before confirmation
- Update times, assigned editor, or status
- Add notes or change break hours

**Cancel Booking**
- Cancel with reason documentation
- Maintains audit trail of cancellations

**Conflict Detection**
- Automatic alerts for double-bookings
- Editor availability checking
- Room conflict warnings

---

### 2. Leaves Entry

**Purpose**: Manage editor leave/time-off requests and track unavailable periods.

#### Features:

**Create Leave Request**
- **Editor Selection**: Choose the editor taking leave
- **From Date**: Start date of leave
- **To Date**: End date of leave
- **Reason**: Document leave reason:
  - Holiday break
  - Personal leave
  - Medical leave
  - Other approved leave
- **System Impact**: Prevents editor from being booked during leave period

**View Leave Calendar**
- Timeline view of all editor leaves
- Color-coded by reason type
- Editor-wise leave history
- Leave duration tracking

**Edit Leave**
- Modify dates if plans change
- Update reason documentation

**Delete Leave**
- Remove leave entries if cancelled
- Frees up editor availability

#### Default Leaves in System:
- Rahul Gupta: Dec 25-31, 2025 (Holiday break)
- Priya Desai: Dec 15-17, 2025 (Personal leave)
- Arjun Singh: Dec 10-12, 2025 (Medical leave)

---

### 3. Chalan Entry

**Purpose**: Create delivery chalans/invoices for completed services.

#### Features:

**Create New Chalan**
- **Chalan Number**: Auto-generated unique identifier (CH-2025-XXX format)
- **Customer**: Select billing customer
- **Project**: Associate with specific project
- **Chalan Date**: Date of invoice
- **Line Items**: Add multiple service items:
  - Description (e.g., "Editing - Feature film (20 hrs)")
  - Quantity
  - Rate per unit
  - Automatic amount calculation
- **Notes**: Add special billing notes or terms
- **Status**: Track as:
  - Draft
  - Ready for Review
  - Issued

**Line Item Details**
Each chalan can contain multiple items:
- Editing services (hourly rates)
- VFX services
- Audio mixing
- Color grading
- Dubbing work
- Music composition
- Sound design
- Other production services

**Sample Chalanization**
- Chalan CH-2025-001: ₹150,000 (Editing ₹100,000 + VFX ₹50,000)
- Chalan CH-2025-002: ₹200,000 (Web Series editing ₹150,000 + Audio ₹50,000)
- Chalan CH-2025-003: ₹75,000 (Ad campaign)

**Total Amount Tracking**
- Automatic calculation of total
- Qty × Rate = Amount per line
- Sum of all line items = Total chalan amount

---

### 4. Chalan Revise

**Purpose**: Manage revisions and amendments to previously created chalans.

#### Features:

**View Chalan Revisions**
- Track all amendments to a chalan
- Revision number tracking (v1, v2, v3, etc.)
- Change history documentation

**Create Revision**
- **Original Chalan**: Select chalan to revise
- **Changes Description**: Document what changed:
  - Price adjustments
  - Quantity corrections
  - Added/removed services
  - Tax corrections
- **Revision Notes**: Add context for the revision
- **Timestamp**: Automatic tracking of revision time

**Revision Audit Trail**
- User who made the revision
- Date and time of revision
- Complete change documentation
- Previous version access

---

## Masters Section

### 1. Customer Master

**Purpose**: Maintain centralized database of all customer companies and contacts.

#### Features:

**Customer Information**
- **Name**: Company name
- **Company Name**: Legal company name
- **Address**: Billing address
- **Phone**: Primary contact number
- **Email**: Business email
- **GST Number**: Tax identification number
- **Status**: Active/Inactive

**Customer Contacts**
Each customer can have multiple contacts:
- **Contact Name**: Person's name
- **Designation**: Job title (Producer, Director, Project Manager, etc.)
- **Phone**: Direct contact number
- **Email**: Personal email
- **Primary Flag**: Mark as primary contact (yes/no)

#### Sample Customers in System:
1. **Bollywood Productions**
   - Address: Bandra, Mumbai
   - Contacts: Rajesh Kumar (Producer), Priya Singh (Director)

2. **Digital Stories**
   - Address: Fort, Mumbai
   - Contact: Amit Verma (Project Manager)

3. **Epic Entertainment**
   - Address: Andheri, Mumbai
   - Contact: Neha Sharma (Content Lead)

4. **Creative Minds**
   - Address: Powai, Mumbai
   - Contact: Vikram Patel (Creative Director)

**Operations**
- Add new customers
- Edit customer details
- Manage multiple contacts per customer
- Set active/inactive status
- Search customers by name or GST number

---

### 2. Project Master

**Purpose**: Maintain all projects and their associated information.

#### Features:

**Project Details**
- **Project Name**: Title of the project
- **Customer**: Associated customer company
- **Project Type**: 
  - Movie (full-length feature films)
  - Serial (TV series episodes)
  - Web Series (streaming content)
  - Ad (commercial advertisements)
  - Teaser (promotional videos)
  - Trilogy (multi-part projects)
- **Description**: Project overview and details
- **Status**: Active/Inactive

**Billing Tracking**
- **Chalan Created**: Flag indicating if invoices exist
- **Invoice Created**: Final invoice status
- Multiple chalans can be created per project

#### Sample Projects in System:
1. **Action Movie - 2025** (Bollywood Productions)
   - Type: Movie
   - Description: High-action blockbuster film

2. **Web Series - Season 1** (Digital Stories)
   - Type: Web Series
   - Description: Crime thriller web series

3. **Ad Campaign - Spring** (Epic Entertainment)
   - Type: Ad
   - Description: Commercial advertisement

4. **Movie Teaser Pack** (Bollywood Productions)
   - Type: Teaser
   - Description: Teaser videos for upcoming movie

5. **Serial - Daily Episodes** (Digital Stories)
   - Type: Serial
   - Description: Daily TV serial episodes

**Operations**
- Create new projects
- Link customers to projects
- Edit project details
- Track billing status
- Search by customer or type

---

### 3. Room Master

**Purpose**: Manage all available studios and production rooms.

#### Features:

**Room Details**
- **Room Name**: Studio/room identifier
- **Room Type**: 
  - Sound (audio recording)
  - Music (composition/recording)
  - VFX (visual effects)
  - Editing (video post-production)
  - Dubbing (audio dubbing)
  - Mixing (final audio mix)
  - Client Office (client meeting space)
- **Capacity**: Maximum occupancy
- **Ignore Conflict**: Flag for rooms that can overbooking
- **Status**: Active/Inactive

#### Sample Rooms in System:
1. **Studio A** - Editing, Capacity: 2
2. **Studio B** - Editing, Capacity: 3
3. **Sound Room** - Sound, Capacity: 1
4. **VFX Lab** - VFX, Capacity: 4
5. **Music Room** - Music, Capacity: 2
6. **Dubbing Theater** - Dubbing, Capacity: 6
7. **Mixing Suite** - Mixing, Capacity: 2

**Operations**
- Add new rooms
- Edit room specifications
- Manage capacity settings
- Set active/inactive status
- Configure conflict rules

---

### 4. Editor Master

**Purpose**: Maintain database of all production editors and their specializations.

#### Features:

**Editor Profile**
- **Name**: Editor's full name
- **Editor Type**: Specialization:
  - Video (video editing)
  - Audio (audio editing/mixing)
  - VFX (visual effects)
  - Colorist (color grading)
  - DI (Digital Intermediate specialist)
- **Phone**: Contact number
- **Email**: Professional email
- **Join Date**: Employment start date
- **Leave Date**: Employment end date (if applicable)
- **Status**: Active/Inactive

**Availability Tracking**
- **Current Availability**: Real-time status
- **Conflict Ignore Flag**: Can override conflict detection if needed

#### Sample Editors in System:
1. **Rahul Gupta** - Video Editor (Joined Jan 2023)
2. **Priya Desai** - Audio Editor (Joined Feb 2023)
3. **Arjun Singh** - VFX Artist (Joined Mar 2023)
4. **Divya Nair** - Colorist (Joined Apr 2023)
5. **Sanjay Reddy** - DI Specialist (Joined May 2023)

**Operations**
- Add new editors
- Edit editor profiles
- Update availability status
- Track leaves and time-off
- Search by specialization
- Monitor editor workload

---

## Reports Section

### 1. Conflict Report

**Purpose**: Identify and resolve room and editor scheduling conflicts.

#### Features:

**Conflict Detection**
- **Room Double-Bookings**: Same room booked simultaneously
- **Editor Over-Booking**: Editor assigned to multiple rooms at same time
- **Leave Conflicts**: Bookings during editor leaves
- **Time Overlaps**: Overlapping time slots

**Filter Options**
- **Date Range**: From date to to date
- **Room Filter**: Specific room or all rooms
- **Editor Filter**: Specific editor or all editors
- **Conflict Type**: By type of conflict

**Report Details**
- Conflicting booking IDs
- Conflicting entities (rooms/editors)
- Time of conflict
- Severity level
- Suggested resolution

**Resolution Actions**
- Reschedule conflicting bookings
- Assign alternate editor
- Suggest alternate time slot
- Document resolution

---

### 2. Booking Report

**Purpose**: Generate comprehensive booking analytics and summaries.

#### Features:

**Booking Statistics**
- **Total Bookings**: Overall count
- **Confirmed Bookings**: Finalized reservations
- **Tentative Bookings**: Pending confirmation
- **Cancelled Bookings**: Cancelled reservations

**Filter Options**
- **Date Range**: Custom period selection
- **Room Filter**: By room or room type
- **Customer Filter**: By customer
- **Editor Filter**: By editor specialization
- **Status Filter**: Planning/Tentative/Confirmed/Cancelled
- **Project Filter**: By project type

**Report Metrics**
- **Booking Duration**: Total hours booked
- **Room Utilization**: Percentage of available time used
- **Editor Workload**: Hours assigned per editor
- **Customer Activity**: Bookings per customer
- **Revenue Tracking**: Estimated revenue from confirmed bookings

**Export Options**
- Export as CSV for spreadsheet analysis
- Generate PDF reports
- Schedule automated reports

---

### 3. Chalan Report

**Purpose**: Track and analyze invoicing and financial data.

#### Features:

**Chalan Statistics**
- **Total Chalans**: Overall invoice count
- **Total Amount**: Sum of all invoiced amounts
- **Active Chalans**: Non-cancelled invoices
- **Cancelled Chalans**: Cancelled invoices

**Sample Data Visualization**
- **Total Chalans**: 5
- **Total Amount**: ₹595,000
- Breakdown by customer and project

**Filter Options**
- **Date Range**: From date to to date (default: month view)
- **Customer Filter**: All customers or specific
- **Project Filter**: By project
- **Show Cancelled**: Include/exclude cancelled chalans

**Chalan Details Table**
Columns displayed:
- Chalan Number
- Customer Name
- Project Name
- Chalan Date
- Total Amount
- Status (Active/Cancelled)
- Line Item Count

**Operational Features**
- View detailed chalan with line items
- Check billing status
- Track payments received
- Generate financial reports
- Export chalan data

---

## User Profile & Settings

### Profile Management

**Access Profile**
1. Click user menu (AD - Admin initials) in bottom left
2. Select "Profile" or user settings option

**Profile Information**
- Username display
- Current company
- User role (Admin, GST, Non-GST)
- Last login timestamp

**Theme Settings**
- **Light Mode**: Standard white background
- **Dark Mode**: Dark background for reduced eye strain
- Toggle available in top-right corner

---

## Troubleshooting

### Common Issues & Solutions

#### Login Issues

**Problem**: Cannot log in
- **Solution 1**: Verify correct company is selected before entering credentials
- **Solution 2**: Ensure security PIN is 4 digits and correct
- **Solution 3**: Check CAPS LOCK is off for username
- **Solution 4**: Clear browser cache and try again
- **Contact**: Reach out to system administrator if issue persists

#### Booking Conflicts

**Problem**: Cannot create booking due to conflict
- **Solution 1**: Check room availability for selected time
- **Solution 2**: Verify editor is not on leave during booking date
- **Solution 3**: Ensure time slots don't overlap with existing bookings
- **Solution 4**: Use Conflict Report to identify specific issues

#### Missing Data

**Problem**: Customer/Project/Room not showing in dropdown
- **Solution 1**: Ensure it's marked as "Active" in respective Master
- **Solution 2**: Verify you're in correct company
- **Solution 3**: Try refreshing the page
- **Solution 4**: Check if data was recently created (may need page refresh)

#### Session Timeout

**Problem**: Logged out unexpectedly
- **Cause**: Session expired after inactivity
- **Solution**: Log back in with credentials
- **Tip**: Keep sessions active by clicking regularly

#### Report Not Loading

**Problem**: Report shows no data
- **Solution 1**: Verify date range includes existing data
- **Solution 2**: Check filters aren't too restrictive
- **Solution 3**: Try clearing filters and reload
- **Solution 4**: Refresh browser page

### Performance Tips

1. **Faster Navigation**: Use keyboard shortcuts if available
2. **Efficient Filtering**: Use specific filters to narrow results
3. **Browser Performance**: Clear cache periodically
4. **Large Reports**: Generate during off-peak hours
5. **Data Export**: Use CSV for offline analysis

---

## Key Features Summary

| Feature | Purpose | Access |
|---------|---------|--------|
| Booking | Room & editor scheduling | Operations > Booking |
| Leaves Entry | Manage editor time-off | Operations > Leaves Entry |
| Chalan Entry | Create invoices | Operations > Chalan Entry |
| Chalan Revise | Modify invoices | Operations > Chalan Revise |
| Customer Master | Manage customers | Masters > Customer Master |
| Project Master | Manage projects | Masters > Project Master |
| Room Master | Manage studios/rooms | Masters > Room Master |
| Editor Master | Manage editors | Masters > Editor Master |
| Conflict Report | Identify scheduling conflicts | Reports > Conflict Report |
| Booking Report | Analyze booking data | Reports > Booking Report |

---

## Support & Assistance

### Getting Help
- Review this guide for detailed feature information
- Use search functionality within sections
- Check status messages for error details
- Contact system administrator for access or permission issues

### Best Practices
1. **Regular Updates**: Keep customer and project information current
2. **Accurate Bookings**: Double-check dates and times before confirming
3. **Timely Chalan Creation**: Generate invoices promptly after project completion
4. **Conflict Resolution**: Address scheduling conflicts immediately
5. **Backup Reports**: Export important reports regularly

### Data Maintenance
- Inactivate rather than delete old records
- Keep customer contact information current
- Update editor availability regularly
- Archive completed projects periodically

---

## System Details

### Current Seed Data
The system comes pre-populated with:
- 2 Companies (PRISM, Airavata Studio)
- 4 Customers with 5 contacts
- 5 Projects
- 7 Production Rooms
- 5 Specialized Editors
- 8 Sample Bookings
- 5 Sample Chalans with 9 line items
- 3 Editor Leave records

### Data Validation
- GST numbers follow Indian format
- Phone numbers are 10 digits
- Dates are in YYYY-MM-DD format
- Times are in 24-hour format (HH:MM)
- Amounts in Indian Rupees (₹)

---

## Version Information
- **Application**: PRISM v1.0
- **Last Updated**: December 2025
- **Supported Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Database**: PostgreSQL with Neon hosting

---

*For technical support or feature requests, contact your system administrator.*
