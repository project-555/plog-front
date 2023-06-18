# Hello Plog Frontend! 👋
해당 레포지토리는 개발자 커리어 관리 플랫폼 Plog의 Frontend 파트의 형상 관리를 위해 만들어졌습니다.

## Stacks
- Plog Front 에서는 프론트엔드 프레임워크로 React를 사용하고 있습니다. 
  - [React](https://reactjs.org/)
- Plog Server은 Oracle Cloud의 컴퓨팅 인스턴스 서비스에서 구동되며, Nginx 환경에서 구동되고 있습니다.

## Install
해당 섹션에서는 Plog Frontend를 구동할 수 있는 가이드를 제공합니다. 
### 1. Clone Repository
- 해당 레포지토리를 클론합니다.
   ```bash
     $ git clone git@github.com:project-565/plog-front.git
   ```
  - Private 레포지토리이므로 대상자는 Collaborator 로 등록되어있어야 하며, 대상자의 SSH 키를 Github에 등록되어 있다고 가정합니다.

### 2. Docker
- Plog는 운영체제의 영향을 최소화하기 위해 로컬의 개발 환경을  Docker 컨테이너 환경으로 구성하였습니다. 
- 따라서 안정적인 로컬 환경 구동을 위해서는 Docker를 설치해야 합니다.
  - [Docker 설치](https://docs.docker.com/get-docker/)
  - [Docker Compose 설치](https://docs.docker.com/compose/install/)
### 3. Docker Compose
- Plog Frontend를 구동하기 위해 Docker Compose를 사용합니다.
- Docker Compose를 사용하여 Plog Frontend를 구동하기 위해서는 아래의 명령어를 입력합니다.
  ```bash
  $ docker compose up
  ```
### 4. 로컬 환경 접속
- Plog Frontend는 기본적으로 3000번 포트를 사용합니다.
- 따라서 로컬 환경에서 Plog Frontend에 접속하기 위해서는 아래의 주소로 접속합니다.
  ```
  http://localhost:3000
  ```