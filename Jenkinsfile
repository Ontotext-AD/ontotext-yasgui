pipeline {
    agent {
       label 'graphdb-jenkins-node'
    }

    tools {
        nodejs 'nodejs-14.17.0'
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm install yarn'
                sh 'npm install'
            }
        }

        stage('Build ontotext-yasgui component') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Start dev server') {
            steps {
                sh 'npm run start &'
            }
        }

        stage('Acceptance') {
            steps {
                sh 'npm run cy:run'
            }
        }
    }
}