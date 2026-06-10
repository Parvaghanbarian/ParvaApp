#  PARVA APP – Full Technical Documentation  #

## Application Scope
Scoped App: x_1617115_parvaapp

## Data Model
Table: Device Request
Table Name: x_1617115_parvaapp_device_request
# Fields:
Number → number
Device Name → u_reference_2
Requestor → u_requestor_4
Company → company
Quantity → u_string_5
Delivery Date → u_glide_date_6
State → u_choice_1
Description → u_string_2

--------
## Part 1 — Use Case & Business Analysis
Defined the full business problem, stakeholder map, process flow, and desired outcomes before writing a single line of code.
Users:
	•	External — Clients (limited portal access only)
	•	Internal — Device Management, Release Management, Dispatch Management, System Admin
Desired Outcomes:
	•	Single portal for clients to submit device requests
	•	Automated and streamlined order processing
	•	Faster approvals and fulfillment
	•	Automated email notifications
	•	Centralized dashboard and reporting

--------
## Part 2 — Data Model
Two custom tables built from scratch in ServiceNow Studio:

# AI Devices Table
Stores the product catalog of all AI devices manufactured by ParvaApp.
  Field                                                    Purpose
Device Name                                    Unique identifier for the device
Model                                          Model name/number
Price                                          Unit price
Description                                    Device description
Warranty                                       Warranty period
Expiration                                     Warranty expiration date
Status                                         Active / Inactive

# Device Request Table
Stores every order placed by a client or internal user.
  Field                                                   Purpose
Requestor Name                                    Reference to sys_user
Requestor's Company                               Reference to core_company
Device Name                                       Reference to AI Devices table
Quantity                                          Number of devices ordered
Business Justification                            Required for quantity ≥ 3
Delivery Address                                  Shipping destination
State                                             In-progress / Delivered / Delivery Failed
Reminder for Pick-up                              Date/time stamp (set by scheduled script)
Cost                                              Auto-calculated total
Approval                                          Approval status

The Device Request table uses a Reference field to link to the AI Devices table. 
When a device is selected, all related details (price, warranty, model) are auto-populated via Client Script.

--------
## Part 3 — UI Policies
Three UI Policies configured to enforce business rules on the form without scripting:
Policy                                    Condition                                      Action
Delivery Date Visibility              State = "Delivered"                  Show Delivery Date field + make mandatory
Business Justification                Quantity > 2                         Make Business Justification mandatory
Reminder Field Visibility             State = "Delivery Failed"            Show Reminder for Pick-up field

--------
## Part 4 — Client Scripts
# Script 1 — Hide Sections on Load (OnLoad)
Hides the Device Details and Delivery Details form sections by default to keep the form clean. Sections appear only when a device is selected.

# Script 2 — Auto-Populate Device Details (getReference)
When a user selects a device, automatically fills in model, price, warranty, and expiration from the AI Devices table using an asynchronous callback:
getReference must use a callback function — calling it synchronously loads all reference data at once and causes performance issues.

--------
## Part 5 — Access Control (Groups, Roles & ACLs)
Device Management    x_1617115_parvaapp.device_management     Andrew Jackson, Billie Cowley, David Miller
Release Management   x_1617115_parvaapp.release_management    Daniel Zill, Felipe Mahone
Dispatch Management  x_1617115_parvaapp.dispatch_management   George Grey, Jason Roy, John Retak

# ACL Matrix — Device Request Table
read    dispatch_management, device_management, release_management
create  device_management
write   dispatch_management, device_management
delete  device_management

# ACL Matrix — AI Devices Table
read    dispatch_management, device_management, release_management
create  device_management
write   device_management
delete  device_management

# Field-Level ACL
Owned By field in AI Devices table → visible only to device_management and release_management.
Problems solved during ACL configuration:
	•	Company field locked — Fixed by navigating to the field's Dictionary Entry and deactivating the security_admin restriction
	•	Description field inaccessible — Root cause: field inherited from the Task table and required the ITIL role. Fixed by assigning the ITIL role to Device Management group members

--------
## Part 6 — Application Modules & Navigation
  Table                         Module                        Type                            Roles
AI Devices                  Device Details               List of Records        dispatch_management, device_management, release_management
AI Devices                  Upload New Device            New Record             device_management
Device Request              All Device Request           List of Records        dispatch_management, device_management, release_management
Device Request              Create New Device Request    New Record             device_management
Device Request              Active Device Request        Active Record          device_management

--------
## Part 7 — Service Catalog
A Catalog Item named "Order AI Devices" was built in the ServiceNow Catalog Builder to provide a clean, client-facing portal for device requests.
Catalog: Service Catalog | Category: Hardware
Catalog Variables
   Field                               Type                                  Details
Requestor Name                 Reference (Read Only)            Auto-populated from logged-in user (gs.getUserID())
Requestor's Company            Reference (Read Only)            Auto-populated from user's company record
Choose Your AI Device          Reference (Mandatory)            Reference to AI Devices table
Choose Quantity                Single Line Text (Mandatory)     Numbers only — validated by script
Business Justification         Multi Line Text                  Mandatory when quantity > 3
Delivery Address               Multi Line Text (Mandatory)      Shipping destination

--------
## Part 8 — Catalog Client Scripts
Script 1 — Field Validation (OnChange)
Validates that the quantity field contains a number, and conditionally enforces the Business Justification field:
Script 2 — Amount Calculation (OnChange)
Calculates and displays the total order cost whenever the device or quantity changes:

--------
## Part 9 — Scheduled Scripts & Event Registry
Business Requirement
Every 3 hours, the system checks for device orders where:
	•	State = Delivery Failed
	•	Reminder for Pick-up field = empty
For each match, it stamps the current date/time and fires a notification event to alert the client.

# Email Template
Hey [Requestor Name],
This is regarding your order number ([Order Number]). We have tried to deliver your ([AI Device Name]) but we could not deliver.
As per our company policy we will deliver this to your company location and would request you collect the same.

# Implementation
Step 1 — Register the Event System Policy → Events → Registry → x_1617115_parvaapp.pickup
Step 2 — Scheduled Script (runs every 3 hours)
Step 3 — Notification A Notification record listens for x_1617115_parvaapp.pickup and sends the email to the requestor automatically.
This pattern — register event → fire from schedule → notification listens — is a standard ServiceNow automation pattern used in production implementations.

--------

## Part 10 — Import Set & Data Migration
Migrated 12 historical device request records from a client-provided Excel file into the device_request table using ServiceNow's Import Set framework.

Workflow
Excel File
    │
    ▼
Staging Table (device_data)    ← Load Data
    │
    ▼
Transform Map (device_transform)
    │   - Field mapping
    │   - Coalesce keys
    │   - Field-level scripts
    ▼
Device Request Table           ← Target

# Problem 1 — Date Format Mismatch
Error: Unable to format date using format type YMD Cause: Excel stored dates as DD/MM/YYYY — ServiceNow expected YYYY-MM-DD Impact: 5 out of 12 records failed to insert
Fix — field-level script on delivery_date mapping:
Result: All 5 records recovered ✓

# Problem 2 — Missing Business Justification
Issue: Legacy records with quantity ≥ 3 had no justification — violating the UI Policy rule
Fix — onBefore Transform Script:
Result: Placeholder inserted only where field was blank — existing data preserved ✓

# Coalesce Configuration
Key fields set as Coalesce = true to prevent duplicate records on re-import: device name, type, requester, company, quantity, state
Â
