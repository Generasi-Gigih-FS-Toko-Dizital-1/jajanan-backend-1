pipeline {
    agent any
    stages {
        stage('stage') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    sh 'docker compose build'
                    sh 'docker compose down'
                    sh 'docker compose up -d --wait'
                }
            }
        }
        stage('log') {
            steps {
                sh 'docker compose logs'
            }
        }
        stage('post') {
            steps {
                sh 'docker system prune --all --force'
                jiraSendBuildInfo()
                jiraSendDeploymentInfo environmentId: 'sg-staging-1', environmentName: 'sg-staging-1', environmentType: 'staging', status: 'successful'
                publishHTML (
                     target : [
                         allowMissing: false,
                         alwaysLinkToLastBuild: true,
                         keepAll: true,
                         reportDir: 'coverage',
                         reportFiles: 'index.html',
                         reportName: 'Post Reports',
                         reportTitles: 'Code Coverage Report'
                     ]
                )
            }
        }
    }
}
