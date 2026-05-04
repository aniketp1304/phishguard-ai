pipeline {
    agent any

    stages {

        stage('Debug Workspace') {
            steps {
                sh '''
                echo "Current directory:"
                pwd
                echo "Files:"
                ls -la
                '''
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Stop Old Containers') {
            steps {
                sh 'docker compose down || true'
            }
        }

        stage('Build Services') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Run Services') {
            steps {
                sh 'docker compose up -d'
            }
        }

        stage('Verify') {
            steps {
                sh '''
                docker ps
                curl -f http://localhost:3030 || exit 1
                curl -f http://localhost:5050 || exit 1
                '''
            }
        }
    }
}
