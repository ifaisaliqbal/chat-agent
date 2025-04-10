# Sierra Outfitters Chat agent

This is a full-stack chat agent application with UI in React and backend in nodejs. This implements the following features:
- Fetch customer orders
- Provide Early risers 10% promo
- Provide hiking tips

## Setup Instructions
### Prerequisites
- Docker
- Docker Compose

### Run the Project
Paste OPENAI_API_KEY in `backend/.env` file and from the project root, run:

```bash
docker-compose up --build
```

Then access:
- Frontend: http://localhost:3000

**Backend and frontend project should be running at this point!**