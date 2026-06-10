# ParvaApp – Device Request Management System

## 📌 Overview

ParvaApp is a company that manufactures AI-powered devices for construction workers — including safety drones, AR glasses, smart hats, and wearable environmental sensors.
This ServiceNow application was built to replace their entirely manual ordering workflow (calls, emails, and spreadsheets) with a fully automated system that handles everything from client-facing order submission to internal approval, dispatch, and customer notification.


Platform         ServiceNow (Scoped Application)
App Scope        x_1617115_parvaapp
Source Control   GitHub (via ServiceNow Studio)
Build Parts      10

---

## Business Problem

Organizations often struggle with:

* Manual device request handling
* Lack of visibility into request status
* Inconsistent approval processes

This application solves these issues by automating and standardizing the workflow.

---

## Solution Architecture

```
Client (Portal)
      │
      ▼
Service Catalog
      │
      ▼
Flow Designer
      │
      ├───────────────┐
      │               │
      ▼               ▼
Approval        Catalog Task
(Release Mgmt)  (Dispatch Mgmt)
      │               │
      └──────┬────────┘
             ▼
   Device Request Table
             │
     ┌───────┴────────┐
     │                │
     ▼                ▼
Notifications   Reports & Dashboard
(Event Registry + Scheduled Script)
```

---

## 🔄 Process Flow

1. Client submits a device order via the Service Catalog portal
2. Order is routed to the Device Management team for review
3. Approval request is sent to the Release Management group
4. Upon approval, a dispatch task is created for the Dispatch team
5. Client receives automated email notifications at each stage
6. If delivery fails, a scheduled script runs every 3 hours and notifies the client



Process Flow:
	1	Client submits a device order via the Service Catalog portal
	2	Order is automatically routed to the Device Management team for review
	3	An approval request is sent to the Release Management group
	4	Upon approval, a dispatch task is created for the Dispatch Management team
	5	Client receives automated email notifications at each stage
	6	If delivery fails, a scheduled script fires every 3 hours and notifies the client automatically
  
---

##  Key Features

* Device request submission form
* Company-based filtering
* Automated workflows
* Approval tracking
* Scheduled data updates
* Import set integration

---

##  Architecture

* Custom Table: `x_1617115_parvaapp_device_request`
* Scoped Application: `x_1617115_parvaapp`
* Client Scripts & UI Policies
* Access Controls (ACLs)
* Import Sets & Data Sources

---

##  Tech Stack

* ServiceNow Platform
* JavaScript (Client & Server-side)
* GlideRecord API
* Import Set API

---

##  How to Use

1. Submit a device request
2. System assigns and processes request
3. Approval workflow is triggered
4. Device request is fulfilled and tracked

---

##  Full Documentation

For complete technical details, see **DOCUMENTATION.md**

---

## 👩‍💻 Author
Parva Ghanbarian 
