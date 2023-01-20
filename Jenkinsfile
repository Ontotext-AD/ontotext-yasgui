pipeline {
    agent {
       label 'graphdb-jenkins-node'
    }

    tools {
        nodejs 'nodejs-14.17.0'
    }

    stages {
        stage('Installing ontotext-yasgui') {
            steps {
                sh 'npm install yarn'
                sh 'npm install'
            }
        }

        stage('Building ontotext-yasgui component') {
            steps {
             sh 'npm run build'
            }
         }

        stage('Starting eslint') {
             steps {
              sh 'npm run lint'
             }
          }

        stage('Starting dev server') {
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

    post {
         failure {
            echo "___________________________________________________"
            emailext(
              to: env.ghprbActualCommitAuthorEmail,
              from: "Jenkins <hudson@ontotext.com>",
              subject: '''[Jenkins] $PROJECT_NAME - Build #$BUILD_NUMBER - $BUILD_STATUS!''',
              mimeType: 'text/html',
              body: '''${SCRIPT, template="groovy-html.template"}'''
            )
         }
         unstable {
             emailext(
               to: env.ghprbActualCommitAuthorEmail,
               from: "Jenkins <hudson@ontotext.com>",
               subject: '''[Jenkins] $PROJECT_NAME - Build #$BUILD_NUMBER - $BUILD_STATUS!''',
               mimeType: 'text/html',
               body: '''${SCRIPT, template="groovy-html.template"}'''
             )
         }
     }
}
