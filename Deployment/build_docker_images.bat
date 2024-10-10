@echo on

CD "C:\it01-project\repo\ICT302-Animals\FrontEnd Web Interface\ict302-animals-frontend"
docker build . -t ict302-animals-frontend-frontend:latest

CD "C:\it01-project\repo\ICT302-Animals\Backend API\ICT302-BackendAPI"
docker build . -t ict302-animals-backend:latest