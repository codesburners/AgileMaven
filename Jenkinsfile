
pipeline {
    agent any

    environment {
        DOCKER_USERNAME = 'YOUR_DOCKERHUB_USERNAME'
        IMAGE_NAME = 'agilebanking'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Test') {
            steps {
                echo 'Building and testing Spring Boot application...'
                bat 'mvn clean package'
            }
            post {
                always {
                    junit testResults: 'target/surefire-reports/*.xml',
                          allowEmptyResults: true
                }
                success {
                    archiveArtifacts artifacts: 'target/*.jar',
                                     fingerprint: true
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %DOCKER_USERNAME%/%IMAGE_NAME%:%BUILD_NUMBER% -t %DOCKER_USERNAME%/%IMAGE_NAME%:latest .'
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-cred',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    bat '''
                    @echo off
                    echo %DOCKER_PASS%| docker login -u %DOCKER_USER% --password-stdin
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                bat 'docker push %DOCKER_USERNAME%/%IMAGE_NAME%:%BUILD_NUMBER%'
                bat 'docker push %DOCKER_USERNAME%/%IMAGE_NAME%:latest'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat 'kubectl apply -f deployment.yaml'
                bat 'kubectl set image deployment/agilebanking agilebanking=%DOCKER_USERNAME%/%IMAGE_NAME%:%BUILD_NUMBER%'
                bat 'kubectl rollout status deployment/agilebanking --timeout=180s'
                bat 'kubectl get pods'
                bat 'kubectl get services'
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Inspect Console Output for the failing stage.'
        }
    }
}
