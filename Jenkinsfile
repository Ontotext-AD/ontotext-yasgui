@Library('ontotext-platform@v0.1.51') _
pipeline {
    agent {
        label 'aws-medium'
    }

    environment {
        NODE_IMAGE = 'node:16-bullseye'
        CYPRESS_IMAGE = 'cypress/included:12.10.0'
    }

    stages {
        stage('Installing ontotext-yasgui') {
            agent {
                docker {
                    image env.NODE_IMAGE
                    reuseNode true
                    args '--entrypoint=""'
                }
            }

            steps {
                script {
                    sh 'npm install yarn'
                    sh 'npm install'
                }
            }
        }

        stage('Building ontotext-yasgui component') {
            agent {
                docker {
                    image env.NODE_IMAGE
                    reuseNode true
                    args '--entrypoint=""'
                }
            }

            steps {
                script {
                    sh 'npm run build'
                }
            }
        }

        stage('Starting eslint') {
            agent {
                docker {
                    image env.NODE_IMAGE
                    reuseNode true
                    args '--entrypoint=""'
                }
            }

            steps {
                script {
                    sh 'npm run lint'
                }
            }
        }

        stage('Conformance unit tests') {
            agent {
                docker {
                    image env.NODE_IMAGE
                    reuseNode true
                    args '--entrypoint=""'
                }
            }

            steps {
                script {
                    sh 'npm run test:conformance'
                }
            }
        }

        stage('Conformance cypress tests') {
            agent {
                docker {
                    image env.CYPRESS_IMAGE
                    reuseNode true
                    args '--entrypoint=""'
                    label 'aws-large'
                }
            }

            steps {
                script {
                    sh """
                        export TERM=xterm
                        export ELECTRON_DISABLE_GPU=1
                        export NO_COLOR=1

                        # 1. Start the app in the background
                        npm run start &

                        # 2. Wait for the app
                        sleep 5

                        # 3. Run Cypress
                        npm run cy:run-conformance
                    """
                }
            }
        }

        stage('Acceptance') {
            agent {
                docker {
                    image env.CYPRESS_IMAGE
                    reuseNode true
                    args '--entrypoint=""'
                }
            }

            steps {
                script {
                    def caughtError = false
                    catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                        try {
                            sh """
                                export TERM=xterm
                                export ELECTRON_DISABLE_GPU=1
                                export NO_COLOR=1

                                # 1. Start the app in the background
                                npm run start &

                                # 2. Wait for the app
                                sleep 5

                                # 3. Run Cypress
                                npm run cy:run
                            """
                        } catch (e) {
                            caughtError = true
                        }
                    }

                    if (caughtError) {
                        echo "Tests failed — archiving Cypress video artifacts."
                        // Archive BEFORE cleanup
                        archiveArtifacts allowEmptyArchive: true, artifacts: 'cypress/report/screenshots/**/*.png, cypress/report/videos/**/*.mp4, cypress/logs/*.json'
                        error("Cypress tests failed, job failed.")
                    }

                    echo "Tests passed — skipping video artifacts."
                }
            }
        }
    }

    post {
        always {
            script {
                workspaceCleanup()
            }
        }
    }
}

def workspaceCleanup() {
    configFileProvider([configFile(fileId: 'cleanup-script', variable: 'CLEANUP_SCRIPT')]) {
        def scriptContent = readFile(env.CLEANUP_SCRIPT)
        evaluate(scriptContent)
    }
}

def getUserUidGidPair() {
    def uid = sh(script: 'id -u', returnStdout: true).trim()
    def gid = sh(script: 'id -g', returnStdout: true).trim()
    return [UID: uid, GID: gid]
}
