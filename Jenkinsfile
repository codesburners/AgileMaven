pipeline {
    agent any // Runs on any available Jenkins agent

    stages {
        stage('Checkout') {
            steps {
                // Checks out the source code from the configured Git repository
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Building the Spring Boot application...'
                script {
                    // Uses the Maven wrapper to ensure the correct Maven version is used
                    if (isUnix()) {
                        sh 'chmod +x mvnw'
                        sh './mvnw clean compile'
                    } else {
                        bat 'mvnw.cmd clean compile'
                    }
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Running Unit & Integration Tests...'
                script {
                    if (isUnix()) {
                        sh './mvnw test'
                    } else {
                        bat 'mvnw.cmd test'
                    }
                }
            }
            post {
                always {
                    // Publishes the test results to the Jenkins UI
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }

        stage('Package') {
            steps {
                echo 'Packaging the application into a JAR file...'
                script {
                    if (isUnix()) {
                        sh './mvnw package -DskipTests'
                    } else {
                        bat 'mvnw.cmd package -DskipTests'
                    }
                }
            }
            post {
                success {
                    // Archives the generated JAR file so you can download it from Jenkins
                    archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
                }
            }
        }
    }
}
