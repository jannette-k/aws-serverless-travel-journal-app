# ✈️ Serverless Travel Journal

> A full-stack serverless web application for documenting travel experiences built entirely on AWS using React, Cognito, API Gateway, Lambda, and DynamoDB.

![AWS](https://img.shields.io/badge/AWS-Cloud-orange?logo=amazon-aws)
![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Serverless](https://img.shields.io/badge/Architecture-Serverless-green)
![Auth](https://img.shields.io/badge/Auth-AWS%20Cognito-yellow)

---

## Architecture

> **Serverless Travel Journal — AWS Cloud Architecture**
![serverless travel journal ](screenshots/01-architecture-diagram)

---

## 🛠 Tech Stack

| Service | Purpose | Why chosen |
|---|---|---|
| **React 18** | Frontend SPA | Component-based UI, industry standard for SPAs |
| **AWS Cognito** | Authentication | Managed auth eliminates custom auth complexity, enterprise-grade security |
| **HTTP API Gateway** | API layer | Low latency, native JWT authorizer, serverless, 60% cheaper than REST API |
| **AWS Lambda (x5)** | Backend compute | No server management, auto-scales, pay-per-invocation |
| **DynamoDB** | Database | Serverless NoSQL, single-digit ms latency, scales to millions of requests |
| **Lambda Layer** | Shared utilities | utils.py shared across all functions update once, applies everywhere |
| **Python 3.10** | Lambda runtime | Lightweight, fast cold starts, excellent boto3 support |

---

## Features

- **User authentication** — custom signup, email verification and signin using AWS Cognito (no Hosted UI)
- **Create trips** — add destination, date, photo URL, rating, notes and tags
- **View all trips** — paginated dashboard with search and sort by date
- **Edit trips** — update any field on an existing trip
- **Delete trips** — remove a trip with confirmation
- **Per-user isolation** — each user only ever sees their own trips
- **JWT-protected API** — every endpoint requires a valid Cognito AccessToken
- **Persistent sessions** — token stored in localStorage, dashboard reloads on refresh

---

## Project Structure

```
react-travel-journal/
├── travel-journal/                 # React frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── trips.js            # All API fetch functions
│   │   ├── auth.js                 # Cognito SDK calls
│   │   ├── cognitoConfig.js        # Cognito config from .env
│   │   ├── components/
│   │   │   ├── TripCard.js         # Individual trip display
│   │   │   └── TripForm.js         # Add/edit trip form
│   │   ├── layouts/
│   │   │   └── DashboardLayout.js  # Main dashboard
│   │   ├── pages/
│   │   │   ├── LoginPage.js        # Custom auth UI
│   │   │   └── TripList.js         # Trips grid with search
│   │   ├── App.js
│   │   └── index.css
│   ├── .env                       
│   └── package.json
│
└── travel-journal-backend/         # Lambda functions
    ├── utils.py                    # Shared utilities (layer source)
    ├── get_trips.py                # GET /trips
    ├── get_trip.py                 # GET /trips/{id}
    ├── create_trip.py              # POST /trips
    ├── update_trip.py              # PUT /trips/{id}
    ├── delete_trip.py              # DELETE /trips/{id}
    └── layer/
        └── python/
            └── utils.py            # Packaged for Lambda Layer
```

---

## API Reference

All endpoints require `Authorization: Bearer <AccessToken>` header.

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `GET` | `/trips` | Get all trips for the logged-in user | — |
| `POST` | `/trips` | Create a new trip | `destination`, `date`, `image_url` |
| `GET` | `/trips/{id}` | Get a single trip by ID | — |
| `PUT` | `/trips/{id}` | Update an existing trip | Any trip fields |
| `DELETE` | `/trips/{id}` | Delete a trip | — |

**Example response — GET /trips:**
```json
[
  {
    "userId": "a1b2c3d4-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "TripID": "6a569ce5-f58c-4826-814f-1d711b0afedb",
    "destination": "Rio de Janeiro",
    "date": "2026-01-28",
    "image_url": "https://images.unsplash.com/photo-xxx",
    "rating": 4,
    "notes": "Amazing and friendly people",
    "tags": ["beaches", "carnival"]
  }
]
```

---

## Security

This project implements AWS security best practices throughout:

- **JWT authentication** — HTTP API Gateway JWT authorizer validates every request against Cognito before Lambda runs. Invalid or expired tokens return `401` before any business logic executes
- **IAM least privilege** — Lambda execution role (`travel-journal-lambda-role`) has only 5 specific DynamoDB actions (`GetItem`, `PutItem`, `UpdateItem`, `DeleteItem`, `Query`) scoped to the exact TripsTable ARN. No wildcard permissions
- **Per-user data isolation** — Cognito `sub` claim used as DynamoDB partition key. Each user's query only returns their own trips — impossible to access another user's data even with a valid token
- **No credentials in frontend** — React never holds AWS credentials or direct DynamoDB access. All data access goes through API Gateway → Lambda
- **No client secret** — Cognito App Client configured as public client (no secret) — correct for browser-based SPAs where secrets cannot be safely stored
- **Password management delegated to Cognito** — passwords never stored in DynamoDB. Cognito handles hashing, salting, and brute force protection automatically
- **CORS locked to known origins** — API Gateway and Lambda CORS headers restrict access to specific allowed origins only

---

## DynamoDB Design

**Table: TripsTable**

| Key | Type | Value | Purpose |
|---|---|---|---|
| `userId` (PK) | String | Cognito `sub` claim | Groups all trips per user |
| `TripID` (SK) | String | UUID (generated by Lambda) | Uniquely identifies each trip |

**Access pattern:** `Query` by `userId` — returns only that user's trips in one efficient operation. No table scans needed.

**Why this design:** Using `userId` as partition key means DynamoDB co-locates all of a user's trips on the same partition — making `GET /trips` a single targeted query rather than a full table scan regardless of how many total users exist.

---

## AWS Infrastructure Setup

### Prerequisites
- AWS account with Lambda, DynamoDB, Cognito and API Gateway access
- AWS CLI configured (`aws configure`)
- Node.js 18+ and npm
- Python 3.10

### 1. DynamoDB
```
Table name:     TripsTable
Partition key:  userId (String)
Sort key:       TripID (String)
Billing:        On-demand
```

### 2. IAM Role
Create role `travel-journal-lambda-role` with:
- Managed policy: `AWSLambdaBasicExecutionRole`
- Inline policy: DynamoDB actions on TripsTable ARN only

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "dynamodb:GetItem",
      "dynamodb:PutItem", 
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:Query"
    ],
    "Resource": "arn:aws:dynamodb:REGION:ACCOUNT_ID:table/TripsTable"
  }]
}
```

### 3. Cognito User Pool
```
Type:           Single Page Application (SPA)
Sign-in:        Email only
MFA:            Disabled
App client:     Public client — no secret
Auth flow:      ALLOW_USER_PASSWORD_AUTH  ← must enable manually
```

### 4. Lambda Layer
```bash
# Structure your layer zip correctly
layer/
└── python/
    └── utils.py    ← must be inside python/ folder

# Upload to Lambda → Layers → Create layer
Name:     travel-journal-utils
Runtime:  Python 3.10
```

### 5. Lambda Functions

| Function name | Handler | Route |
|---|---|---|
| travel-journal-getTrips | get_trips.lambda_handler | GET /trips |
| travel-journal-getTrip | get_trip.lambda_handler | GET /trips/{id} |
| travel-journal-createTrip | create_trip.lambda_handler | POST /trips |
| travel-journal-updateTrip | update_trip.lambda_handler | PUT /trips/{id} |
| travel-journal-deleteTrip | delete_trip.lambda_handler | DELETE /trips/{id} |

Each function uses:
- Runtime: Python 3.10
- Execution role: `travel-journal-lambda-role`
- Layer: `travel-journal-utils` (version 1)

### 6. HTTP API Gateway
```
Type:     HTTP API
Name:     travel-journal-api
Stage:    $default (auto-deploy)

JWT Authorizer:
  Issuer:   https://cognito-idp.REGION.amazonaws.com/POOL_ID
  Audience: YOUR_APP_CLIENT_ID

CORS:
  Allow origin:   http://localhost:3000
  Allow headers:  content-type    ← add as separate tags
                  authorization   ← not as one combined tag
  Allow methods:  GET, POST, PUT, DELETE, OPTIONS
  Max age:        300
```

---

## Local Setup

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/react-travel-journal.git
cd react-travel-journal
```

**2. Install dependencies**
```bash
cd travel-journal
npm install
```

**3. Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your AWS values:
```bash
REACT_APP_AWS_REGION=eu-north-1
REACT_APP_COGNITO_USER_POOL_ID=eu-north-1_xxxxxxxxx
REACT_APP_COGNITO_CLIENT_ID=your-app-client-id
REACT_APP_API_GATEWAY_ENDPOINT=https://xxxxxxxxxx.execute-api.eu-north-1.amazonaws.com
```

**4. Run the app**
```bash
npm start
```

App runs at `http://localhost:3000`

**5. Package Lambda functions**
```bash
cd travel-journal-backend

# each zip contains the handler + utils.py
# Windows: select both files → right-click → Send to Compressed folder
# Mac/Linux:
zip get_trips.zip get_trips.py utils.py
zip get_trip.zip get_trip.py utils.py
zip create_trip.zip create_trip.py utils.py
zip update_trip.zip update_trip.py utils.py
zip delete_trip.zip delete_trip.py utils.py

# layer zip — must have python/ folder inside
mkdir -p layer/python
cp utils.py layer/python/
cd layer && zip -r ../utils-layer.zip python/
```

---

## Lessons Learned

These are real issues encountered during development. Documenting them here to save you the debugging time.

**1. Lambda Layer zip structure**
```
❌ utils-layer.zip/utils.py          — Python can't find it
✅ utils-layer.zip/python/utils.py   — correct, Lambda adds python/ to path
```
The layer must have `utils.py` inside a `python/` folder. Without this you get `ImportModuleError: No module named utils` even when the layer is attached.

**2. After uploading a new layer version — update all functions**
Uploading a new layer version does NOT automatically update your functions. Every function must be manually pointed at the new version number or they keep using the old one silently.

**3. AccessToken vs IdToken**
```
❌ IdToken    — identifies the user, wrong audience for API Gateway
✅ AccessToken — authorizes API calls, correct for HTTP API JWT authorizer
```
Using `IdToken` causes `401 Unauthorized` on every request even with correct credentials. API Gateway JWT authorizer expects `AccessToken`.

**4. CORS headers in API Gateway — separate tags not one combined value**
```
❌ One tag:   content-type,authorization   — treated as literal string, no match
✅ Two tags:  content-type                 — correct, matches individually
              authorization
```
This was the most frustrating bug — CORS config looked correct in the console but the preflight kept failing. The fix was re-entering headers as two separate tags.

**5. Lambda test events need realistic userIds**
```
❌ "sub": "test-user-001"   — test data never appears in real app
✅ "sub": "a1b2c3d4-xxxx"   — use a real UUID format
```
Test trips saved with `userId: "test-user-001"` will never show in the React app because your real Cognito `sub` is a UUID. Always use a UUID-format sub in test events.

**6. DynamoDB Decimal serialization**
DynamoDB stores numbers as Python `Decimal` type. `json.dumps()` can't serialize `Decimal` — causes `500` on any response containing numeric fields like `rating`. Fix by adding a custom encoder to `utils.py`:
```python
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj) if obj % 1 == 0 else float(obj)
        return super().default(obj)

# use in success():
"body": json.dumps(body, cls=DecimalEncoder)
```

**7. getTrip vs getTrips — easy to wire wrong in API Gateway**
```
GET /trips      → travel-journal-getTrips   (list all)
GET /trips/{id} → travel-journal-getTrip    (single item)
```
Wiring `getTrip` to `GET /trips` causes `KeyError: pathParameters` on every dashboard load. Always double-check route integrations after wiring — the names look identical at a glance.

**8. Unsplash page URL vs direct image URL**
```
❌ https://unsplash.com/photos/city-buildings-...  — webpage, not an image
✅ https://images.unsplash.com/photo-xxxxxxxxx     — direct image URL
```
The page URL triggers `onError` in the image component and shows the default image. Right-click the photo on Unsplash → Copy image address to get the direct URL.

**9. userId missing from DynamoDB item**
If `userId` is not included when calling `put_item`, DynamoDB throws `ValidationException: Missing the key userId`. Extract it from JWT claims before building the item:
```python
user_id = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]
```

---