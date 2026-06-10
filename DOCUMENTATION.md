# PARVA App – Full Technical Documentation

---

## Application Scope

* **Scoped App:** `x_1617115_parvaapp`

---

## Data Model

### Device Request Table

* **Table Name:** `x_1617115_parvaapp_device_request`

### Fields

| Label         | Field Name     |
| ------------- | -------------- |
| Number        | number         |
| Device Name   | u_reference_2  |
| Requestor     | u_requestor_4  |
| Company       | company        |
| Quantity      | u_string_5     |
| Delivery Date | u_glide_date_6 |
| State         | u_choice_1     |
| Description   | u_string_2     |

---

## Part 1 — Use Case & Business Analysis

Defined the full business problem, stakeholder map, process flow, and desired outcomes before writing any code.

### Users

* External — Clients (portal access only)
* Internal — Device Management, Release Management, Dispatch Management, System Admin

### Desired Outcomes

* Single portal for device requests
* Automated and streamlined order processing
* Faster approvals and fulfillment
* Automated email notifications
* Centralized dashboard and reporting

---

## Part 2 — Data Model

Two custom tables built from scratch in ServiceNow Studio:

### AI Devices Table

Stores the product catalog of all AI devices manufactured by ParvaApp.

| Field       | Purpose                  |
| ----------- | ------------------------ |
| Device Name | Unique identifier        |
| Model       | Model name/number        |
| Price       | Unit price               |
| Description | Device description       |
| Warranty    | Warranty period          |
| Expiration  | Warranty expiration date |
| Status      | Active / Inactive        |

---

### Device Request Table

Stores every order placed by a client or internal user.

| Field                  | Purpose                                   |
| ---------------------- | ----------------------------------------- |
| Requestor Name         | Reference to `sys_user`                   |
| Requestor's Company    | Reference to `core_company`               |
| Device Name            | Reference to AI Devices table             |
| Quantity               | Number of devices ordered                 |
| Business Justification | Required for quantity ≥ 3                 |
| Delivery Address       | Shipping destination                      |
| State                  | In-progress / Delivered / Delivery Failed |
| Reminder for Pick-up   | Date/time stamp (set by scheduled script) |
| Cost                   | Auto-calculated total                     |
| Approval               | Approval status                           |

The Device Request table uses a **reference field** to link to the AI Devices table.
When a device is selected, related details (price, warranty, model) are auto-populated via Client Script.

---

## Part 3 — UI Policies

Three UI Policies enforce business rules without scripting:

| Policy                    | Condition               | Action                      |
| ------------------------- | ----------------------- | --------------------------- |
| Delivery Date Visibility  | State = Delivered       | Show field + make mandatory |
| Business Justification    | Quantity > 2            | Make mandatory              |
| Reminder Field Visibility | State = Delivery Failed | Show field                  |

---

## Part 4 — Client Scripts

### Script 1 — Hide Sections (OnLoad)

* Hides Device Details and Delivery Details sections by default
* Improves form usability and cleanliness

### Script 2 — Auto-Populate Device Details

* Uses `getReference()` with callback
* Automatically fills model, price, warranty, expiration
* Prevents performance issues from synchronous loading

---

## Part 5 — Access Control (Roles & ACLs)

### Roles & Groups

| Group               | Role                                   | Members        |
| ------------------- | -------------------------------------- | -------------- |
| Device Management   | x_1617115_parvaapp.device_management   | Multiple users |
| Release Management  | x_1617115_parvaapp.release_management  | Multiple users |
| Dispatch Management | x_1617115_parvaapp.dispatch_management | Multiple users |

---

### ACL — Device Request Table

| Operation | Roles             |
| --------- | ----------------- |
| Read      | All three groups  |
| Create    | Device Management |
| Write     | Device & Dispatch |
| Delete    | Device Management |

---

### ACL — AI Devices Table

| Operation | Roles             |
| --------- | ----------------- |
| Read      | All three groups  |
| Create    | Device Management |
| Write     | Device Management |
| Delete    | Device Management |

---

### Issues Solved

* Company field locked → fixed via Dictionary override
* Description field restricted → required ITIL role assignment

---

## Part 6 — Application Modules & Navigation

| Table          | Module            | Type          | Roles             |
| -------------- | ----------------- | ------------- | ----------------- |
| AI Devices     | Device Details    | List          | All roles         |
| AI Devices     | Upload New Device | Create        | Device Management |
| Device Request | All Requests      | List          | All roles         |
| Device Request | Create Request    | Create        | Device Management |
| Device Request | Active Requests   | Filtered List | Device Management |

---

## Part 7 — Service Catalog

Catalog Item: **Order AI Devices**

* Catalog: Service Catalog
* Category: Hardware

### Variables

| Field          | Type       | Details            |
| -------------- | ---------- | ------------------ |
| Requestor Name | Reference  | Auto-populated     |
| Company        | Reference  | Auto-populated     |
| Device         | Reference  | Mandatory          |
| Quantity       | Text       | Numeric validation |
| Justification  | Multi-line | Conditional        |
| Address        | Multi-line | Mandatory          |

---

## Part 8 — Catalog Client Scripts

* Field validation for numeric quantity
* Dynamic enforcement of justification field
* Real-time cost calculation based on quantity and device

---

## Part 9 — Scheduled Scripts & Events

### Business Logic

Every 3 hours:

* Find requests with **Delivery Failed**
* If no reminder → set timestamp
* Trigger event → send notification

### Pattern

Event → Scheduled Script → Notification

(Standard ServiceNow production pattern)

---

## Part 10 — Import Set & Data Migration

Migrated 12 records from Excel using Import Set.

### Flow

Excel → Staging Table → Transform Map → Target Table

---

### Issues & Fixes

**Date Format Error**

* Cause: DD/MM/YYYY mismatch
* Fix: Field transform script
* Result: Records recovered

**Missing Justification**

* Cause: Legacy data
* Fix: onBefore script
* Result: Data integrity maintained

---

### Coalesce Strategy

Used key fields to prevent duplicate records during re-import.
