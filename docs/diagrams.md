# MindCare Connect Diagrams

## Use Case Diagram (Text)

```text
Actors:
  - User
  - Psychiatrist
  - Admin

User use-cases:
  - Sign up / Log in
  - Browse verified psychiatrists
  - Book appointment
  - Pay with M-Pesa (simulation)
  - Chat with psychiatrist
  - Chat with AI assistant
  - Trigger SOS emergency alert
  - Change preferred language

Psychiatrist use-cases:
  - View appointments
  - Confirm consultation sessions
  - Send/receive messages
  - Review user context before session

Admin use-cases:
  - Verify psychiatrists
  - Monitor payment and booking logs
  - Track SOS alerts
  - Manage platform users
```

## ER Diagram (Text)

```text
users (1) --------< appointments >-------- (1) psychiatrists
  |                        |
  |                        v
  |                    payments
  |
  +--------< messages >--------+
            sender_id receiver_id

Tables:
  users
    - id (PK)
    - full_name
    - phone_number (unique)
    - language
    - role

  psychiatrists
    - id (PK)
    - user_id (FK -> users.id)
    - specialty
    - years_experience
    - location
    - consultation_fee_etb
    - rating
    - verified

  appointments
    - id (PK)
    - user_id (FK -> users.id)
    - psychiatrist_id (FK -> psychiatrists.id)
    - appointment_at
    - status
    - payment_status

  messages
    - id (PK)
    - sender_id (FK -> users.id)
    - receiver_id (FK -> users.id)
    - appointment_id (FK -> appointments.id)
    - body
    - sent_at

  payments
    - id (PK)
    - appointment_id (FK -> appointments.id)
    - user_id (FK -> users.id)
    - amount_etb
    - method
    - transaction_code
    - status
    - paid_at
```
