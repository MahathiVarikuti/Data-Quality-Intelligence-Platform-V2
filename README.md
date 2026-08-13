# Data Quality Intelligence Platform

A full-stack data quality platform for uploading, profiling, validating, cleaning, and exporting structured CSV datasets.

The platform turns raw datasets into actionable quality reports by measuring **completeness, uniqueness, validity, consistency, and overall quality**, then providing configurable cleaning operations and exportable results.

## Overview

Data preparation is often one of the most time-consuming parts of a data workflow. Before analysis or machine learning, datasets commonly contain:

- Missing values
- Duplicate records
- Invalid values such as malformed emails
- Inconsistent text formatting
- Statistical outliers
- Unnecessary columns
- Different data types and distributions

The **Data Quality Intelligence Platform** provides a single workflow to identify these problems, understand their impact, clean the dataset, and export the processed data and quality metadata.

### Core workflow

```text
Authenticate
    ↓
Upload CSV
    ↓
Profile Dataset
    ↓
Calculate Quality Scores
    ↓
Identify Data Quality Issues
    ↓
Apply Configurable Cleaning
    ↓
Recalculate Quality
    ↓
Undo / Restore if Required
    ↓
Export Dataset + Reports
```

---

## Key Features

### 1. Authentication

Users can create an account and sign in before accessing the platform.

- User registration
- Login
- JWT-based authentication
- Authenticated API requests
- User-specific dataset access

![Login](docs/screenshots/login.png)

![Register](docs/screenshots/register.png)

---

### 2. CSV Dataset Upload

Datasets can be uploaded through a dedicated drag-and-drop interface.

The platform then stores the dataset and prepares it for profiling and quality analysis.

![Upload Dataset](docs/screenshots/upload.png)

---

### 3. Dataset Dashboard

The dashboard provides a high-level view of the user's datasets.

It displays:

- Total datasets
- Cleaned datasets
- Validated datasets
- Average quality score
- Recent datasets
- Dataset status distribution

![Dashboard](docs/screenshots/dashboard.png)

---

### 4. Dataset Analytics

The analytics page provides an aggregate view of dataset health across the platform.

It includes:

- Total dataset count
- Average quality score
- Total rows
- Total storage
- Quality distribution
- Dataset quality radar
- Datasets requiring cleaning
- Latest quality alerts

![Dataset Analytics](docs/screenshots/datasets-1.png)

![Cleaning Required and Alerts](docs/screenshots/datasets-2.png)

---

## Data Quality Assessment

Each dataset is evaluated across multiple quality dimensions.

### Completeness

Measures the proportion of expected values that are present.

A dataset with many missing cells receives a lower completeness score.

### Uniqueness

Measures duplicate-record quality.

Duplicate rows reduce the uniqueness score and are surfaced as a data quality issue.

### Validity

Checks whether values satisfy supported validity rules, including malformed email detection.

### Consistency

Evaluates consistency-related dataset characteristics.

### Overall Quality

The platform combines the quality dimensions into an overall dataset quality score.

A dataset's quality is therefore represented as:

```text
Completeness
Uniqueness
Validity
Consistency
       ↓
Overall Quality Score
```

---

## Dataset Overview

The Overview page summarizes the health of an individual dataset.

It displays:

- Number of rows
- Number of columns
- File size
- Dataset status
- Completeness score
- Uniqueness score
- Validity score
- Consistency score
- Overall score
- Issue summary
- Cleaning recommendations

![Dataset Overview](docs/screenshots/overview.png)

For example, a dataset can surface issues such as:

```text
Dataset contains 11927 missing values.
Dataset contains 100 duplicate rows.
Dataset contains 473 invalid email values.
```

The platform also generates recommendations based on the detected issues.

---

## Dataset Profiling

The profiling view provides column-level statistics before cleaning.

For each column, the platform can display information such as:

- Column name
- Data type
- Missing values
- Unique values
- Mean
- Median
- Minimum
- Maximum
- Top values

A preview of the first five rows is also provided.

![Dataset Profiling](docs/screenshots/profile-1.png)

![Dataset Profiling and Preview](docs/screenshots/profile-2.png)

This makes it possible to understand the structure and quality of a dataset before modifying it.

---

## Cleaning Operations

The Cleaning page provides a centralized interface for transforming datasets.

Available operations include:

| Operation | Description |
|---|---|
| Remove Duplicates | Removes duplicate records |
| Fill Missing Values | Handles missing values using configurable strategies |
| Normalize Text | Standardizes values in text columns |
| Detect Outliers | Finds statistical outliers using IQR |
| Remove Columns | Removes selected columns |
| Undo Last Action | Reverts the most recent cleaning operation |
| Restore Original | Restores the originally uploaded dataset |

![Cleaning Actions](docs/screenshots/cleaning-actions.png)

---

### Remove Duplicates

Duplicate records can be removed while preserving unique rows.

The operation is implemented using Pandas duplicate detection and returns the cleaned dataset.

Conceptually:

```python
df.drop_duplicates()
```

---

### Fill Missing Values

Missing values can be handled on a column-by-column basis.

Supported strategies include:

- Mean
- Median
- Mode
- Custom value
- Drop row

The interface also distinguishes between numeric and text columns.

![Fill Missing Values](docs/screenshots/fill-missing.png)

For example:

```text
Age       → Median
Salary    → Mean
Department → Mode
Name      → Custom Value
Email     → Drop Row
```

This allows the user to choose a strategy based on the semantics of each column instead of applying a single rule to the entire dataset.

---

### Text Normalization

Text columns can be standardized using:

- Trim whitespace
- Lowercase
- Uppercase
- Title Case

Users can select the columns to modify and choose the required transformation.

![Text Normalization](docs/screenshots/text.png)

For example:

```text
"  john smith  "
        ↓
"John Smith"
```

The cleaning service preserves missing values while applying transformations only to string values.

---

### Outlier Detection

The platform uses the **Interquartile Range (IQR)** method to identify statistical outliers.

For each selected numeric column:

```text
IQR = Q3 - Q1

Lower Bound = Q1 - 1.5 × IQR
Upper Bound = Q3 + 1.5 × IQR
```

Values outside these bounds are identified as outliers.

The interface shows:

- Column
- Number of detected outliers
- IQR range
- Data range
- Selected columns

Users can review the results before removing the selected outliers.

![Outlier Detection](docs/screenshots/outliers.png)

---

### Remove Columns

Users can inspect dataset columns and permanently remove selected columns.

The interface shows:

- Column name
- Data type
- Missing-value count
- Selected columns
- Number of selected columns

![Remove Columns](docs/screenshots/column-drop.png)

This is particularly useful for removing columns that are:

- Mostly empty
- Irrelevant to analysis
- Redundant
- Constant or low-value features

---

## Before-and-After Cleaning

Cleaning operations update the dataset and its quality metrics.

For example, a missing-value cleaning operation can produce a result such as:

```text
Missing Values: 11927 → 3868
Overall Score: 81.38% → 82.86%
```

This gives the user immediate feedback on whether the cleaning operation improved the dataset.

![Cleaning Result](docs/screenshots/updates.png)

The platform also supports reviewing the updated dataset quality after cleaning.

---

## Undo and Restore

Cleaning operations are designed to be reversible.

### Undo Last Action

The platform maintains a one-level backup of the dataset before a cleaning operation.

Selecting **Undo Last Action** restores the previous dataset state.

### Restore Original

The originally uploaded dataset is stored separately as an original backup.

Selecting **Restore Original** discards subsequent cleaning changes and restores the dataset to its original uploaded state.

This provides two levels of protection:

```text
Original Dataset
      │
      ├── Cleaning Action 1
      │       ↓
      │   Current Dataset
      │
      └── Undo → Previous State
```

---

## Export

The Export page provides three downloadable outputs.

### CSV

Downloads the latest version of the dataset.

### Profile JSON

Exports profiling information, including metadata and dataset preview/profile information.

### Quality Report JSON

Exports the calculated quality scores, detected issues, and recommendations.

![Export Dataset](docs/screenshots/export.png)

![Quality Report JSON](docs/screenshots/export-report.png)

Example quality report structure:

```json
{
  "completeness_score": 41.24,
  "uniqueness_score": 100,
  "validity_score": 5.83,
  "consistency_score": 100,
  "overall_score": 58.83,
  "total_missing": 133526,
  "duplicate_count": 0,
  "invalid_email_count": 5350,
  "invalid_type_count": 0,
  "issue_summary": [],
  "recommendations": []
}
```

The exported report makes the quality assessment available outside the application for further analysis or record keeping.

---

# Technical Architecture

The project follows a frontend-backend architecture.

```text
                    ┌──────────────────────────┐
                    │        React Frontend    │
                    │                          │
                    │ Dashboard                │
                    │ Upload                   │
                    │ Profiling                │
                    │ Cleaning                 │
                    │ Export                   │
                    └────────────┬─────────────┘
                                 │
                          REST API / JWT
                                 │
                    ┌────────────▼─────────────┐
                    │      Django Backend      │
                    │                          │
                    │ REST API                 │
                    │ Authentication           │
                    │ Dataset Operations       │
                    │ Cleaning Services        │
                    │ Quality Reports          │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │          Pandas          │
                    │                          │
                    │ CSV Processing            │
                    │ Profiling                │
                    │ Cleaning                 │
                    │ Statistical Analysis     │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │        PostgreSQL        │
                    │                          │
                    │ Users                    │
                    │ Dataset Metadata         │
                    │ Validation Reports       │
                    └──────────────────────────┘
```

---

## Technology Stack

### Frontend

- React
- JavaScript
- Axios
- Tailwind CSS
- Lucide React

### Backend

- Python
- Django
- Django REST Framework
- Simple JWT

### Data Processing

- Pandas
- NumPy-compatible Pandas operations
- Statistical profiling
- IQR-based outlier detection

### Database

- PostgreSQL

### API Communication

The frontend communicates with the Django backend through REST APIs.

Example API operations include:

```text
GET    /api/datasets/
GET    /api/datasets/<id>/
POST   /api/datasets/upload/
GET    /api/profile/<id>/
POST   /api/clean/<id>/
GET    /api/datasets/<id>/report/
GET    /api/datasets/<id>/outliers/
POST   /api/datasets/<id>/undo/
POST   /api/datasets/<id>/restore/
GET    /api/datasets/<id>/export/
DELETE /api/datasets/<id>/delete/
PATCH  /api/datasets/<id>/rename/
```

Authentication uses JWT access tokens, which are attached to API requests from the frontend.

---

# Backend Design

The backend separates API handling from dataset-processing logic.

A simplified structure is:

```text
Backend
├── API / Views
│   ├── Dataset endpoints
│   ├── Authentication
│   ├── Profiling
│   ├── Cleaning
│   └── Export
│
├── Services
│   ├── DatasetService
│   └── CleaningService
│
├── Models
│   ├── Dataset
│   └── ValidationReport
│
└── Data Processing
    └── Pandas DataFrames
```

### DatasetService

The dataset service is responsible for file-related operations such as:

- Loading CSV files
- Saving modified datasets
- Creating original backups
- Creating undo backups
- Restoring previous states
- Restoring the original dataset
- Updating dataset metadata
- Deleting dataset and backup files

This keeps direct file operations out of the API views.

### CleaningService

The cleaning service contains the actual DataFrame transformations.

Implemented operations include:

```text
remove_duplicates()
fill_missing()
normalize_text()
remove_columns()
remove_outliers()
detect_outliers()
```

This separation makes the cleaning logic reusable and keeps the API layer focused on request/response handling.

---

# Data Model

The main dataset entities are:

### Dataset

Stores dataset ownership and metadata including:

- User
- Dataset name
- File
- Upload timestamp
- File size
- Row count
- Column count
- Status
- Initial quality metrics

### ValidationReport

Stores the quality assessment associated with a dataset.

It contains:

- Completeness score
- Uniqueness score
- Validity score
- Consistency score
- Overall score
- Total missing values
- Duplicate count
- Invalid email count
- Invalid type count
- Issue summary
- Recommendations

The relationship between a dataset and its validation report is one-to-one.

---

# Dataset Lifecycle

A dataset moves through the platform as follows:

```text
Uploaded
   ↓
Profiled
   ↓
Validated
   ↓
Cleaned
```

The platform keeps dataset metadata synchronized with file modifications, including row count, column count, file size, and status.

---

# Example Use Case

Consider a customer or employee dataset containing:

```text
1900 rows
17 columns
11927 missing values
100 duplicate rows
473 invalid email values
```

The platform first profiles the dataset and reports its quality:

```text
Completeness   63.07%
Uniqueness     94.74%
Validity       75.11%
Consistency    100%
Overall        81.38%
```

The user can then:

1. Inspect the profiling results.
2. Fill missing values using column-specific strategies.
3. Remove duplicate records.
4. Normalize inconsistent text.
5. Detect and remove selected outliers.
6. Remove unnecessary columns.
7. Review the updated quality metrics.
8. Undo the latest operation if necessary.
9. Restore the original dataset if required.
10. Export the cleaned CSV and quality reports.

This makes the platform useful as a preprocessing layer before downstream analytics or machine-learning workflows.

---

# Project Highlights

The project focuses on more than simply modifying CSV files.

### Quality-first workflow

The platform identifies quality problems before cleaning and reports the effect of cleaning operations afterward.

### Configurable cleaning

Cleaning is not limited to a single hard-coded strategy. Users can choose column-specific approaches for missing values and text transformations.

### Reversible transformations

Original and undo backups provide protection against accidental or unwanted changes.

### Explainable quality reports

Instead of presenting only one score, the platform exposes the individual quality dimensions and the underlying issue summary.

### Exportable results

The cleaned dataset and quality metadata can be taken outside the application through CSV and JSON exports.

---

# Screenshots

The main screenshots are included throughout this README to demonstrate the end-to-end workflow.

For a clean repository structure, store them under:

```text
docs/
└── screenshots/
    ├── login.png
    ├── register.png
    ├── dashboard.png
    ├── upload.png
    ├── datasets-1.png
    ├── datasets-2.png
    ├── overview.png
    ├── profile-1.png
    ├── profile-2.png
    ├── cleaning-actions.png
    ├── fill-missing.png
    ├── text.png
    ├── outliers.png
    ├── column-drop.png
    ├── updates.png
    ├── export.png
    └── export-report.png
```

The README references these paths directly, so keep the filenames unchanged after renaming them as above.

---

# Suggested Repository Structure

```text
data-quality-intelligence-platform/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── manage.py
│   ├── datasets/
│   ├── ...
│   └── requirements.txt
│
├── docs/
│   └── screenshots/
│       ├── login.png
│       ├── register.png
│       ├── dashboard.png
│       ├── upload.png
│       ├── datasets-1.png
│       ├── datasets-2.png
│       ├── overview.png
│       ├── profile-1.png
│       ├── profile-2.png
│       ├── cleaning-actions.png
│       ├── fill-missing.png
│       ├── text.png
│       ├── outliers.png
│       ├── column-drop.png
│       ├── updates.png
│       ├── export.png
│       └── export-report.png
│
└── README.md
```

---

# Running the Project

## Backend

Create and activate a Python virtual environment, install the backend dependencies, configure the database, and start the Django development server.

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Linux/macOS:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Apply migrations:

```bash
python manage.py migrate
```

Start the backend:

```bash
python manage.py runserver
```

The API runs at:

```text
http://127.0.0.1:8000/
```

## Frontend

Install the frontend dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend runs at the Vite development URL shown in the terminal, typically:

```text
http://localhost:5173/
```

---

# Environment Configuration

Configure the project-specific environment variables for the backend and frontend as required by the local setup.

Typical configuration areas include:

```text
Database connection
Django secret key
Allowed hosts / CORS
Frontend API base URL
JWT configuration
Media file storage
```

Do not commit passwords, secret keys, JWT secrets, database credentials, or other sensitive configuration to the repository.

---

# API Flow

A typical dataset workflow is represented by the following API sequence:

```text
POST /datasets/upload/
        ↓
GET /datasets/<id>/
        ↓
GET /profile/<id>/
        ↓
GET /datasets/<id>/report/
        ↓
POST /clean/<id>/
        ↓
GET /datasets/<id>/report/
        ↓
GET /datasets/<id>/export/
```

Cleaning-specific operations use the same cleaning endpoint with an action and optional configuration.

For example:

```json
{
  "action": "duplicates"
}
```

Configurable operations can additionally provide options such as selected columns, strategies, or custom values.

---

# What I Learned

This project provided practical experience with:

- Designing a full-stack application
- Building REST APIs with Django REST Framework
- Connecting a React frontend to backend APIs
- JWT authentication
- File upload and storage
- CSV processing with Pandas
- Data profiling
- Data quality metrics
- Statistical outlier detection
- Configurable data cleaning
- Backup and restore workflows
- Database modelling
- Frontend state management
- API error handling
- Exporting structured data and reports

---

# Future Improvements

Potential extensions include:

- Support for Excel and additional structured formats
- More comprehensive validation rules
- Configurable quality-score weighting
- Batch cleaning pipelines
- Cleaning history with multiple undo levels
- Automated data-quality scheduling
- Data-quality trend tracking
- Role-based access control
- Cloud object storage
- Background processing for very large datasets
- Advanced anomaly detection
- More extensive data-quality rules and custom validators

---

# Conclusion

The **Data Quality Intelligence Platform** provides an end-to-end workflow for understanding and improving structured dataset quality.

Instead of treating data cleaning as a collection of isolated operations, the platform connects:

```text
Profiling
   +
Quality Assessment
   +
Issue Detection
   +
Configurable Cleaning
   +
Reversible Changes
   +
Exportable Results
```

This creates a practical preprocessing layer that can be used before analytics, reporting, or machine-learning workflows.
